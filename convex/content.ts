import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ============ CONTENT PILLARS ============

export const listPillars = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contentPillars").collect();
  },
});

export const addPillar = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    color: v.string(),
    priority: v.union(v.literal("HOCH"), v.literal("MITTEL"), v.literal("NIEDRIG")),
    targetKeywords: v.number(),
    completedKeywords: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentPillars", args);
  },
});

export const updatePillar = mutation({
  args: {
    id: v.id("contentPillars"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("HOCH"), v.literal("MITTEL"), v.literal("NIEDRIG"))),
    targetKeywords: v.optional(v.number()),
    completedKeywords: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// ============ CONTENT ITEMS ============

export const listItems = query({
  args: {
    pillarId: v.optional(v.number()),
    status: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items;

    if (args.pillarId !== undefined) {
      items = await ctx.db
        .query("contentItems")
        .withIndex("by_pillarId", (q) => q.eq("pillarId", args.pillarId!))
        .collect();
    } else if (args.status) {
      items = await ctx.db
        .query("contentItems")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else if (args.type) {
      items = await ctx.db
        .query("contentItems")
        .withIndex("by_type", (q) => q.eq("type", args.type as any))
        .collect();
    } else {
      items = await ctx.db.query("contentItems").collect();
    }

    return items;
  },
});

export const getItemsByPillar = query({
  args: {},
  handler: async (ctx) => {
    const pillars = await ctx.db.query("contentPillars").collect();
    const items = await ctx.db.query("contentItems").collect();

    return pillars.map(pillar => ({
      ...pillar,
      items: items.filter(item => item.pillarId === pillars.indexOf(pillar) + 1),
    }));
  },
});

export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("contentItems").collect();

    const statusCounts = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeCounts = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: items.length,
      byStatus: statusCounts,
      byType: typeCounts,
      published: items.filter(i => i.status === "Published").length,
      inProgress: items.filter(i => i.status === "In Progress" || i.status === "Draft" || i.status === "Review").length,
      planned: items.filter(i => i.status === "Planned").length,
    };
  },
});

export const addItem = mutation({
  args: {
    title: v.string(),
    pillarId: v.number(),
    type: v.union(
      v.literal("Blog"),
      v.literal("Video"),
      v.literal("Tool"),
      v.literal("Infographic"),
      v.literal("Pillar Page"),
      v.literal("Case Study")
    ),
    status: v.union(
      v.literal("Planned"),
      v.literal("Draft"),
      v.literal("In Progress"),
      v.literal("Review"),
      v.literal("Published")
    ),
    dueDate: v.optional(v.string()),
    assignee: v.optional(v.string()),
    description: v.optional(v.string()),
    relatedKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentItems", args);
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("contentItems"),
    title: v.optional(v.string()),
    pillarId: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("Blog"),
      v.literal("Video"),
      v.literal("Tool"),
      v.literal("Infographic"),
      v.literal("Pillar Page"),
      v.literal("Case Study")
    )),
    status: v.optional(v.union(
      v.literal("Planned"),
      v.literal("Draft"),
      v.literal("In Progress"),
      v.literal("Review"),
      v.literal("Published")
    )),
    dueDate: v.optional(v.string()),
    assignee: v.optional(v.string()),
    description: v.optional(v.string()),
    relatedKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

export const removeItem = mutation({
  args: { id: v.id("contentItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk insert content items
export const bulkInsertItems = mutation({
  args: {
    items: v.array(v.object({
      title: v.string(),
      pillarId: v.number(),
      type: v.union(
        v.literal("Blog"),
        v.literal("Video"),
        v.literal("Tool"),
        v.literal("Infographic"),
        v.literal("Pillar Page"),
        v.literal("Case Study")
      ),
      status: v.union(
        v.literal("Planned"),
        v.literal("Draft"),
        v.literal("In Progress"),
        v.literal("Review"),
        v.literal("Published")
      ),
      dueDate: v.optional(v.string()),
      assignee: v.optional(v.string()),
      description: v.optional(v.string()),
      relatedKeywords: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const item of args.items) {
      const id = await ctx.db.insert("contentItems", item);
      ids.push(id);
    }
    return ids;
  },
});

// Bulk insert pillars
export const bulkInsertPillars = mutation({
  args: {
    pillars: v.array(v.object({
      title: v.string(),
      description: v.string(),
      color: v.string(),
      priority: v.union(v.literal("HOCH"), v.literal("MITTEL"), v.literal("NIEDRIG")),
      targetKeywords: v.number(),
      completedKeywords: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const pillar of args.pillars) {
      const id = await ctx.db.insert("contentPillars", pillar);
      ids.push(id);
    }
    return ids;
  },
});
