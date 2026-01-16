import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Alle Keywords abrufen
export const list = query({
  args: {
    cluster: v.optional(v.string()),
    journeyPhase: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let keywords;

    if (args.cluster) {
      keywords = await ctx.db
        .query("keywords")
        .withIndex("by_cluster", (q) => q.eq("cluster", args.cluster!))
        .collect();
    } else if (args.journeyPhase) {
      keywords = await ctx.db
        .query("keywords")
        .withIndex("by_journeyPhase", (q) => q.eq("journeyPhase", args.journeyPhase as any))
        .collect();
    } else {
      keywords = await ctx.db.query("keywords").collect();
    }

    // Sort by priority score
    keywords.sort((a, b) => b.priorityScore - a.priorityScore);

    if (args.limit) {
      keywords = keywords.slice(0, args.limit);
    }

    return keywords;
  },
});

// Keywords mit Content-Count (wie viele Content Pieces targeten dieses Keyword)
export const listWithContentCount = query({
  args: {},
  handler: async (ctx) => {
    const keywords = await ctx.db.query("keywords").collect();
    const contentPieces = await ctx.db.query("contentPieces").collect();

    return keywords.map(kw => {
      const contentCount = contentPieces.filter(cp =>
        cp.primaryKeyword === kw._id ||
        (cp.targetKeywords && cp.targetKeywords.includes(kw._id))
      ).length;

      return {
        ...kw,
        contentCount,
        hasContent: contentCount > 0,
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  },
});

// Keyword-Suche
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm || args.searchTerm.length < 2) {
      return [];
    }

    return await ctx.db
      .query("keywords")
      .withSearchIndex("search_keyword", (q) => q.search("keyword", args.searchTerm))
      .take(50);
  },
});

// Cluster-Übersicht
export const getClusters = query({
  args: {},
  handler: async (ctx) => {
    const keywords = await ctx.db.query("keywords").collect();
    const contentPieces = await ctx.db.query("contentPieces").collect();

    const clusterMap = keywords.reduce((acc, kw) => {
      if (!acc[kw.cluster]) {
        acc[kw.cluster] = { name: kw.cluster, count: 0, totalVolume: 0, avgDifficulty: 0, contentCount: 0 };
      }
      acc[kw.cluster].count++;
      acc[kw.cluster].totalVolume += kw.volume;
      acc[kw.cluster].avgDifficulty += kw.difficulty;
      return acc;
    }, {} as Record<string, { name: string; count: number; totalVolume: number; avgDifficulty: number; contentCount: number }>);

    // Content-Count pro Cluster
    for (const piece of contentPieces) {
      if (piece.primaryKeyword) {
        const kw = keywords.find(k => k._id === piece.primaryKeyword);
        if (kw && clusterMap[kw.cluster]) {
          clusterMap[kw.cluster].contentCount++;
        }
      }
    }

    return Object.values(clusterMap).map(cluster => ({
      ...cluster,
      avgDifficulty: Math.round(cluster.avgDifficulty / cluster.count),
    }));
  },
});

// Journey-Phase Verteilung
export const getJourneyDistribution = query({
  args: {},
  handler: async (ctx) => {
    const keywords = await ctx.db.query("keywords").collect();

    const phases = ["Awareness", "Consideration", "Decision", "Action", "Retention"];
    return phases.map(phase => ({
      phase,
      count: keywords.filter(kw => kw.journeyPhase === phase).length,
      totalVolume: keywords.filter(kw => kw.journeyPhase === phase).reduce((sum, kw) => sum + kw.volume, 0),
    }));
  },
});

// Keyword hinzufügen
export const add = mutation({
  args: {
    keyword: v.string(),
    cluster: v.string(),
    journeyPhase: v.union(
      v.literal("Awareness"),
      v.literal("Consideration"),
      v.literal("Decision"),
      v.literal("Action"),
      v.literal("Retention")
    ),
    volume: v.number(),
    difficulty: v.number(),
    priorityScore: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("keywords", args);
  },
});

// Keyword aktualisieren
export const update = mutation({
  args: {
    id: v.id("keywords"),
    keyword: v.optional(v.string()),
    cluster: v.optional(v.string()),
    journeyPhase: v.optional(v.union(
      v.literal("Awareness"),
      v.literal("Consideration"),
      v.literal("Decision"),
      v.literal("Action"),
      v.literal("Retention")
    )),
    volume: v.optional(v.number()),
    difficulty: v.optional(v.number()),
    priorityScore: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Keyword löschen
export const remove = mutation({
  args: { id: v.id("keywords") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Cluster-Detail: Keywords und Content Pieces eines Clusters
export const getClusterDetail = query({
  args: { cluster: v.string() },
  handler: async (ctx, args) => {
    const keywords = await ctx.db
      .query("keywords")
      .withIndex("by_cluster", (q) => q.eq("cluster", args.cluster))
      .collect();

    const contentPieces = await ctx.db.query("contentPieces").collect();
    const keywordIds = new Set(keywords.map(k => k._id));

    // Content Pieces die ein Keyword aus diesem Cluster targeten
    // (entweder als primaryKeyword ODER in targetKeywords)
    const clusterContent = contentPieces.filter(cp => {
      // Check primaryKeyword
      if (cp.primaryKeyword && keywordIds.has(cp.primaryKeyword)) {
        return true;
      }
      // Check targetKeywords array
      if (cp.targetKeywords && cp.targetKeywords.some(kwId => keywordIds.has(kwId))) {
        return true;
      }
      return false;
    });

    // Statistiken
    const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);
    const avgDifficulty = keywords.length > 0
      ? Math.round(keywords.reduce((sum, k) => sum + k.difficulty, 0) / keywords.length)
      : 0;
    const publishedContent = clusterContent.filter(c => c.status === "Published").length;

    // Keywords mit Content-Count anreichern
    const keywordsWithCount = keywords.map(kw => {
      const contentCount = contentPieces.filter(cp =>
        cp.primaryKeyword === kw._id ||
        (cp.targetKeywords && cp.targetKeywords.includes(kw._id))
      ).length;
      return { ...kw, contentCount };
    });

    return {
      cluster: args.cluster,
      keywords: keywordsWithCount.sort((a, b) => b.priorityScore - a.priorityScore),
      contentPieces: clusterContent.sort((a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ),
      stats: {
        keywordCount: keywords.length,
        contentCount: clusterContent.length,
        publishedCount: publishedContent,
        totalVolume,
        avgDifficulty,
      },
    };
  },
});
