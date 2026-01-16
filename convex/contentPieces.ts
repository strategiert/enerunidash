import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============ QUERIES ============

// Alle Content Pieces abrufen (mit optionalen Filtern)
export const list = query({
  args: {
    year: v.optional(v.number()),
    month: v.optional(v.number()),
    status: v.optional(v.string()),
    channel: v.optional(v.string()),
    contentType: v.optional(v.string()),
    journeyPhase: v.optional(v.string()),
    pillarId: v.optional(v.id("contentPillars")),
    campaignId: v.optional(v.id("campaigns")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let pieces = await ctx.db.query("contentPieces").collect();

    // Filter by year
    if (args.year) {
      pieces = pieces.filter(p => {
        const date = new Date(p.publishDate);
        return date.getFullYear() === args.year;
      });
    }

    // Filter by month (1-12)
    if (args.month) {
      pieces = pieces.filter(p => {
        const date = new Date(p.publishDate);
        return date.getMonth() + 1 === args.month;
      });
    }

    // Filter by status
    if (args.status) {
      pieces = pieces.filter(p => p.status === args.status);
    }

    // Filter by channel
    if (args.channel) {
      pieces = pieces.filter(p => p.channel === args.channel);
    }

    // Filter by content type
    if (args.contentType) {
      pieces = pieces.filter(p => p.contentType === args.contentType);
    }

    // Filter by journey phase
    if (args.journeyPhase) {
      pieces = pieces.filter(p => p.journeyPhase === args.journeyPhase);
    }

    // Filter by pillar
    if (args.pillarId) {
      pieces = pieces.filter(p => p.pillarId === args.pillarId);
    }

    // Filter by campaign
    if (args.campaignId) {
      pieces = pieces.filter(p => p.campaignId === args.campaignId);
    }

    // Sort by publish date
    pieces.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());

    // Apply limit
    if (args.limit) {
      pieces = pieces.slice(0, args.limit);
    }

    return pieces;
  },
});

// Ein einzelnes Content Piece abrufen
export const get = query({
  args: { id: v.id("contentPieces") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Content Pieces für einen bestimmten Monat (Kalender-Ansicht)
export const getByMonth = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    const pieces = await ctx.db.query("contentPieces").collect();

    return pieces.filter(p => {
      const date = new Date(p.publishDate);
      return date.getFullYear() === args.year && date.getMonth() + 1 === args.month;
    }).sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
  },
});

// Content Pieces für einen bestimmten Tag
export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contentPieces")
      .withIndex("by_publishDate", q => q.eq("publishDate", args.date))
      .collect();
  },
});

// Upcoming Content (nächste X Tage)
export const getUpcoming = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const today = new Date();
    const daysAhead = args.days ?? 30;
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + daysAhead);

    const pieces = await ctx.db.query("contentPieces").collect();

    return pieces.filter(p => {
      const date = new Date(p.publishDate);
      return date >= today && date <= endDate;
    }).sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
  },
});

// Content Pieces die ein bestimmtes Keyword targeten
export const getByKeyword = query({
  args: { keywordId: v.id("keywords") },
  handler: async (ctx, args) => {
    const pieces = await ctx.db.query("contentPieces").collect();

    return pieces.filter(p =>
      p.primaryKeyword === args.keywordId ||
      (p.targetKeywords && p.targetKeywords.includes(args.keywordId))
    );
  },
});

// Statistiken für Dashboard
export const getStats = query({
  args: { year: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let pieces = await ctx.db.query("contentPieces").collect();

    if (args.year) {
      pieces = pieces.filter(p => new Date(p.publishDate).getFullYear() === args.year);
    }

    const total = pieces.length;
    const byStatus = pieces.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byChannel = pieces.reduce((acc, p) => {
      acc[p.channel] = (acc[p.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byContentType = pieces.reduce((acc, p) => {
      acc[p.contentType] = (acc[p.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byJourneyPhase = pieces.reduce((acc, p) => {
      acc[p.journeyPhase] = (acc[p.journeyPhase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byMonth = pieces.reduce((acc, p) => {
      const month = new Date(p.publishDate).getMonth();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
      acc[monthNames[month]] = (acc[monthNames[month]] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byStatus,
      byChannel,
      byContentType,
      byJourneyPhase,
      byMonth,
      published: byStatus["Published"] || 0,
      planned: (byStatus["Planned"] || 0) + (byStatus["Scheduled"] || 0),
      inProgress: (byStatus["Draft"] || 0) + (byStatus["In Progress"] || 0) + (byStatus["Review"] || 0),
    };
  },
});

// Content pro Pillar mit Fortschritt
export const getByPillar = query({
  args: {},
  handler: async (ctx) => {
    const pillars = await ctx.db.query("contentPillars").collect();
    const pieces = await ctx.db.query("contentPieces").collect();

    return pillars.map(pillar => {
      const pillarPieces = pieces.filter(p => p.pillarId === pillar._id);
      const published = pillarPieces.filter(p => p.status === "Published").length;

      return {
        ...pillar,
        contentCount: pillarPieces.length,
        publishedCount: published,
        progress: pillar.targetCount > 0 ? Math.round((published / pillar.targetCount) * 100) : 0,
        pieces: pillarPieces,
      };
    });
  },
});

// Jahresübersicht für Dashboard
export const getYearOverview = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    const pieces = await ctx.db.query("contentPieces").collect();
    const yearPieces = pieces.filter(p => new Date(p.publishDate).getFullYear() === args.year);

    const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

    return months.map((month, index) => {
      const monthPieces = yearPieces.filter(p => new Date(p.publishDate).getMonth() === index);
      return {
        month,
        total: monthPieces.length,
        published: monthPieces.filter(p => p.status === "Published").length,
        planned: monthPieces.filter(p => ["Planned", "Scheduled", "Draft", "In Progress", "Review"].includes(p.status)).length,
        seo: monthPieces.filter(p => p.channel === "SEO").length,
        social: monthPieces.filter(p => p.channel === "Social").length,
        email: monthPieces.filter(p => p.channel === "Email").length,
      };
    });
  },
});

// Pillar-Detail: Alle Infos zu einem Content Pillar
export const getPillarDetail = query({
  args: { pillarId: v.id("contentPillars") },
  handler: async (ctx, args) => {
    const pillar = await ctx.db.get(args.pillarId);
    if (!pillar) return null;

    const pieces = await ctx.db.query("contentPieces").collect();
    const pillarPieces = pieces.filter(p => p.pillarId === args.pillarId);

    // Statistiken
    const published = pillarPieces.filter(p => p.status === "Published").length;
    const inProgress = pillarPieces.filter(p => ["Draft", "In Progress", "Review"].includes(p.status)).length;
    const planned = pillarPieces.filter(p => ["Planned", "Scheduled"].includes(p.status)).length;

    // Nach Status gruppieren
    const byStatus = pillarPieces.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Nach Channel gruppieren
    const byChannel = pillarPieces.reduce((acc, p) => {
      acc[p.channel] = (acc[p.channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Nach Content Type gruppieren
    const byContentType = pillarPieces.reduce((acc, p) => {
      acc[p.contentType] = (acc[p.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...pillar,
      pieces: pillarPieces.sort((a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ),
      stats: {
        total: pillarPieces.length,
        published,
        inProgress,
        planned,
        progress: pillar.targetCount > 0 ? Math.round((published / pillar.targetCount) * 100) : 0,
        byStatus,
        byChannel,
        byContentType,
      },
    };
  },
});

// ============ MUTATIONS ============

// Neues Content Piece erstellen
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    publishDate: v.string(),
    contentType: v.union(
      v.literal("Blog"),
      v.literal("Video"),
      v.literal("Tool"),
      v.literal("Infographic"),
      v.literal("Pillar Page"),
      v.literal("Case Study"),
      v.literal("Social Post"),
      v.literal("Newsletter"),
      v.literal("PR"),
      v.literal("SEA Ad")
    ),
    channel: v.union(
      v.literal("SEO"),
      v.literal("SEA"),
      v.literal("Social"),
      v.literal("Email"),
      v.literal("PR"),
      v.literal("Product")
    ),
    status: v.union(
      v.literal("Idea"),
      v.literal("Planned"),
      v.literal("Draft"),
      v.literal("In Progress"),
      v.literal("Review"),
      v.literal("Scheduled"),
      v.literal("Published"),
      v.literal("Active"),
      v.literal("Paused"),
      v.literal("Ended")
    ),
    journeyPhase: v.union(
      v.literal("Awareness"),
      v.literal("Consideration"),
      v.literal("Decision"),
      v.literal("Action"),
      v.literal("Retention")
    ),
    pillarId: v.optional(v.id("contentPillars")),
    targetKeywords: v.optional(v.array(v.id("keywords"))),
    primaryKeyword: v.optional(v.id("keywords")),
    campaignId: v.optional(v.id("campaigns")),
    assignee: v.optional(v.string()),
    author: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("contentPieces", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Content Piece aktualisieren
export const update = mutation({
  args: {
    id: v.id("contentPieces"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    publishDate: v.optional(v.string()),
    contentType: v.optional(v.union(
      v.literal("Blog"),
      v.literal("Video"),
      v.literal("Tool"),
      v.literal("Infographic"),
      v.literal("Pillar Page"),
      v.literal("Case Study"),
      v.literal("Social Post"),
      v.literal("Newsletter"),
      v.literal("PR"),
      v.literal("SEA Ad")
    )),
    channel: v.optional(v.union(
      v.literal("SEO"),
      v.literal("SEA"),
      v.literal("Social"),
      v.literal("Email"),
      v.literal("PR"),
      v.literal("Product")
    )),
    status: v.optional(v.union(
      v.literal("Idea"),
      v.literal("Planned"),
      v.literal("Draft"),
      v.literal("In Progress"),
      v.literal("Review"),
      v.literal("Scheduled"),
      v.literal("Published"),
      v.literal("Active"),
      v.literal("Paused"),
      v.literal("Ended")
    )),
    journeyPhase: v.optional(v.union(
      v.literal("Awareness"),
      v.literal("Consideration"),
      v.literal("Decision"),
      v.literal("Action"),
      v.literal("Retention")
    )),
    pillarId: v.optional(v.id("contentPillars")),
    targetKeywords: v.optional(v.array(v.id("keywords"))),
    primaryKeyword: v.optional(v.id("keywords")),
    campaignId: v.optional(v.id("campaigns")),
    assignee: v.optional(v.string()),
    author: v.optional(v.string()),
    views: v.optional(v.number()),
    conversions: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Content Piece löschen
export const remove = mutation({
  args: { id: v.id("contentPieces") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk-Insert für Seed-Daten
export const bulkCreate = mutation({
  args: {
    pieces: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      publishDate: v.string(),
      contentType: v.union(
        v.literal("Blog"),
        v.literal("Video"),
        v.literal("Tool"),
        v.literal("Infographic"),
        v.literal("Pillar Page"),
        v.literal("Case Study"),
        v.literal("Social Post"),
        v.literal("Newsletter"),
        v.literal("PR"),
        v.literal("SEA Ad")
      ),
      channel: v.union(
        v.literal("SEO"),
        v.literal("SEA"),
        v.literal("Social"),
        v.literal("Email"),
        v.literal("PR"),
        v.literal("Product")
      ),
      status: v.union(
        v.literal("Idea"),
        v.literal("Planned"),
        v.literal("Draft"),
        v.literal("In Progress"),
        v.literal("Review"),
        v.literal("Scheduled"),
        v.literal("Published"),
        v.literal("Active"),
        v.literal("Paused"),
        v.literal("Ended")
      ),
      journeyPhase: v.union(
        v.literal("Awareness"),
        v.literal("Consideration"),
        v.literal("Decision"),
        v.literal("Action"),
        v.literal("Retention")
      ),
      assignee: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const ids = [];
    for (const piece of args.pieces) {
      const id = await ctx.db.insert("contentPieces", {
        ...piece,
        createdAt: now,
        updatedAt: now,
      });
      ids.push(id);
    }
    return ids;
  },
});

// Status schnell ändern (für Drag & Drop etc.)
export const updateStatus = mutation({
  args: {
    id: v.id("contentPieces"),
    status: v.union(
      v.literal("Idea"),
      v.literal("Planned"),
      v.literal("Draft"),
      v.literal("In Progress"),
      v.literal("Review"),
      v.literal("Scheduled"),
      v.literal("Published"),
      v.literal("Active"),
      v.literal("Paused"),
      v.literal("Ended")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Datum verschieben (für Kalender Drag & Drop)
export const updateDate = mutation({
  args: {
    id: v.id("contentPieces"),
    publishDate: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      publishDate: args.publishDate,
      updatedAt: new Date().toISOString(),
    });
  },
});
