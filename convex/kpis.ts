import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ============ MONTHLY KPIs ============

export const getMonthlyKPIs = query({
  args: {
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let kpis = await ctx.db.query("monthlyKPIs").collect();

    if (args.year) {
      kpis = kpis.filter(k => k.year === args.year);
    }

    // Sort by month order
    const monthOrder = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    kpis.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    return kpis;
  },
});

export const getYTDStats = query({
  args: {
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const kpis = await ctx.db
      .query("monthlyKPIs")
      .withIndex("by_year_month", (q) => q.eq("year", args.year))
      .collect();

    const totalRevenue = kpis.reduce((sum, k) => sum + k.revenue, 0);
    const totalTarget = kpis.reduce((sum, k) => sum + k.target, 0);
    const totalConversions = kpis.reduce((sum, k) => sum + k.conversions, 0);
    const avgUsvShare = kpis.length > 0 ? kpis.reduce((sum, k) => sum + k.usvShare, 0) / kpis.length : 0;
    const avgRoas = kpis.length > 0 ? kpis.reduce((sum, k) => sum + k.roas, 0) / kpis.length : 0;

    return {
      totalRevenue,
      totalTarget,
      targetAchievement: totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0,
      totalConversions,
      avgUsvShare: Math.round(avgUsvShare),
      avgRoas: Math.round(avgRoas * 10) / 10,
      totalOrganicTraffic: kpis.reduce((sum, k) => sum + k.organicTraffic, 0),
      totalPaidTraffic: kpis.reduce((sum, k) => sum + k.paidTraffic, 0),
    };
  },
});

export const addMonthlyKPI = mutation({
  args: {
    month: v.string(),
    year: v.number(),
    revenue: v.number(),
    target: v.number(),
    conversions: v.number(),
    usvShare: v.number(),
    roas: v.number(),
    organicTraffic: v.number(),
    paidTraffic: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("monthlyKPIs", args);
  },
});

export const updateMonthlyKPI = mutation({
  args: {
    id: v.id("monthlyKPIs"),
    revenue: v.optional(v.number()),
    target: v.optional(v.number()),
    conversions: v.optional(v.number()),
    usvShare: v.optional(v.number()),
    roas: v.optional(v.number()),
    organicTraffic: v.optional(v.number()),
    paidTraffic: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Bulk insert monthly KPIs
export const bulkInsertKPIs = mutation({
  args: {
    kpis: v.array(v.object({
      month: v.string(),
      year: v.number(),
      revenue: v.number(),
      target: v.number(),
      conversions: v.number(),
      usvShare: v.number(),
      roas: v.number(),
      organicTraffic: v.number(),
      paidTraffic: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const kpi of args.kpis) {
      const id = await ctx.db.insert("monthlyKPIs", kpi);
      ids.push(id);
    }
    return ids;
  },
});

// ============ CHANNEL ATTRIBUTION ============

export const getChannelAttribution = query({
  args: {
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let attribution = await ctx.db.query("channelAttribution").collect();

    if (args.year) {
      attribution = attribution.filter(a => a.year === args.year);
    }

    // Sort by value descending
    attribution.sort((a, b) => b.value - a.value);

    return attribution;
  },
});

export const addChannelAttribution = mutation({
  args: {
    name: v.string(),
    value: v.number(),
    percentage: v.number(),
    color: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("channelAttribution", args);
  },
});

// Bulk insert channel attribution
export const bulkInsertAttribution = mutation({
  args: {
    attribution: v.array(v.object({
      name: v.string(),
      value: v.number(),
      percentage: v.number(),
      color: v.string(),
      year: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const item of args.attribution) {
      const id = await ctx.db.insert("channelAttribution", item);
      ids.push(id);
    }
    return ids;
  },
});

// ============ INFOGRAPHICS ============

export const getInfographics = query({
  args: {
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let infographics = await ctx.db.query("infographics").collect();

    if (args.year) {
      infographics = infographics.filter(i => i.year === args.year);
    }

    // Sort by month
    const monthOrder = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    infographics.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    return infographics;
  },
});

export const addInfographic = mutation({
  args: {
    month: v.string(),
    title: v.string(),
    status: v.union(v.literal("Planned"), v.literal("In Progress"), v.literal("Published")),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("infographics", args);
  },
});

export const updateInfographic = mutation({
  args: {
    id: v.id("infographics"),
    title: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Planned"), v.literal("In Progress"), v.literal("Published"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Bulk insert infographics
export const bulkInsertInfographics = mutation({
  args: {
    infographics: v.array(v.object({
      month: v.string(),
      title: v.string(),
      status: v.union(v.literal("Planned"), v.literal("In Progress"), v.literal("Published")),
      year: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const item of args.infographics) {
      const id = await ctx.db.insert("infographics", item);
      ids.push(id);
    }
    return ids;
  },
});
