import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all keywords with optional filtering
export const list = query({
  args: {
    cluster: v.optional(v.string()),
    journeyPhase: v.optional(v.string()),
    hasContent: v.optional(v.boolean()),
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
        .withIndex("by_journeyPhase", (q) =>
          q.eq("journeyPhase", args.journeyPhase as any)
        )
        .collect();
    } else {
      keywords = await ctx.db.query("keywords").collect();
    }

    // Filter by hasContent if specified
    if (args.hasContent !== undefined) {
      keywords = keywords.filter(k => k.hasContent === args.hasContent);
    }

    // Sort by priority score descending
    keywords.sort((a, b) => b.priorityScore - a.priorityScore);

    // Apply limit if specified
    if (args.limit) {
      keywords = keywords.slice(0, args.limit);
    }

    return keywords;
  },
});

// Search keywords
export const search = query({
  args: {
    searchTerm: v.string(),
    cluster: v.optional(v.string()),
    journeyPhase: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm || args.searchTerm.length < 2) {
      return [];
    }

    const results = await ctx.db
      .query("keywords")
      .withSearchIndex("search_keyword", (q) => {
        let search = q.search("keyword", args.searchTerm);
        if (args.cluster) {
          search = search.eq("cluster", args.cluster);
        }
        if (args.journeyPhase) {
          search = search.eq("journeyPhase", args.journeyPhase as any);
        }
        return search;
      })
      .take(50);

    return results;
  },
});

// Get keyword clusters with counts
export const getClusters = query({
  args: {},
  handler: async (ctx) => {
    const keywords = await ctx.db.query("keywords").collect();

    const clusterCounts = keywords.reduce((acc, kw) => {
      acc[kw.cluster] = (acc[kw.cluster] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(clusterCounts).map(([name, count]) => ({
      name,
      count,
    }));
  },
});

// Get journey phase distribution
export const getJourneyDistribution = query({
  args: {},
  handler: async (ctx) => {
    const keywords = await ctx.db.query("keywords").collect();

    const phaseCounts = keywords.reduce((acc, kw) => {
      acc[kw.journeyPhase] = (acc[kw.journeyPhase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const phases = ["Awareness", "Consideration", "Decision", "Action", "Retention"];
    return phases.map(phase => ({
      phase,
      count: phaseCounts[phase] || 0,
    }));
  },
});

// Add a new keyword
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
    hasContent: v.boolean(),
    contentType: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("keywords", args);
  },
});

// Update keyword
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
    hasContent: v.optional(v.boolean()),
    contentType: v.optional(v.string()),
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

// Delete keyword
export const remove = mutation({
  args: { id: v.id("keywords") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk insert keywords (for initial data seeding)
export const bulkInsert = mutation({
  args: {
    keywords: v.array(v.object({
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
      hasContent: v.boolean(),
      contentType: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const keyword of args.keywords) {
      const id = await ctx.db.insert("keywords", keyword);
      ids.push(id);
    }
    return ids;
  },
});
