import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all calendar events with optional filtering
export const list = query({
  args: {
    month: v.optional(v.number()), // 0-11
    year: v.optional(v.number()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("calendarEvents").collect();

    // Filter by month/year if specified
    if (args.month !== undefined && args.year !== undefined) {
      events = events.filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === args.month && date.getFullYear() === args.year;
      });
    }

    // Filter by type if specified
    if (args.type) {
      events = events.filter(e => e.type === args.type);
    }

    // Filter by status if specified
    if (args.status) {
      events = events.filter(e => e.status === args.status);
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return events;
  },
});

// Get events for a specific date
export const getByDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calendarEvents")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

// Get upcoming events
export const getUpcoming = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];
    const events = await ctx.db.query("calendarEvents").collect();

    const upcoming = events
      .filter(e => e.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return args.limit ? upcoming.slice(0, args.limit) : upcoming;
  },
});

// Get event statistics by type
export const getStatsByType = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("calendarEvents").collect();

    const typeCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
    }));
  },
});

// Get event statistics by status
export const getStatsByStatus = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("calendarEvents").collect();

    const statusCounts = events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  },
});

// Add a new calendar event
export const add = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    type: v.union(
      v.literal("SEO"),
      v.literal("SEA"),
      v.literal("Social"),
      v.literal("Newsletter"),
      v.literal("PR"),
      v.literal("Product")
    ),
    status: v.union(
      v.literal("Planned"),
      v.literal("Draft"),
      v.literal("Review"),
      v.literal("Published"),
      v.literal("Active"),
      v.literal("Done"),
      v.literal("Sent"),
      v.literal("Dev")
    ),
    description: v.optional(v.string()),
    relatedKeywords: v.optional(v.array(v.string())),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendarEvents", args);
  },
});

// Update calendar event
export const update = mutation({
  args: {
    id: v.id("calendarEvents"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal("SEO"),
      v.literal("SEA"),
      v.literal("Social"),
      v.literal("Newsletter"),
      v.literal("PR"),
      v.literal("Product")
    )),
    status: v.optional(v.union(
      v.literal("Planned"),
      v.literal("Draft"),
      v.literal("Review"),
      v.literal("Published"),
      v.literal("Active"),
      v.literal("Done"),
      v.literal("Sent"),
      v.literal("Dev")
    )),
    description: v.optional(v.string()),
    relatedKeywords: v.optional(v.array(v.string())),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Delete calendar event
export const remove = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk insert events (for initial data seeding)
export const bulkInsert = mutation({
  args: {
    events: v.array(v.object({
      title: v.string(),
      date: v.string(),
      type: v.union(
        v.literal("SEO"),
        v.literal("SEA"),
        v.literal("Social"),
        v.literal("Newsletter"),
        v.literal("PR"),
        v.literal("Product")
      ),
      status: v.union(
        v.literal("Planned"),
        v.literal("Draft"),
        v.literal("Review"),
        v.literal("Published"),
        v.literal("Active"),
        v.literal("Done"),
        v.literal("Sent"),
        v.literal("Dev")
      ),
      description: v.optional(v.string()),
      relatedKeywords: v.optional(v.array(v.string())),
      assignee: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const event of args.events) {
      const id = await ctx.db.insert("calendarEvents", event);
      ids.push(id);
    }
    return ids;
  },
});
