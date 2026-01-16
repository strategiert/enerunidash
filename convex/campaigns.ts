import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all campaigns with optional filtering
export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let campaigns;

    if (args.status) {
      campaigns = await ctx.db
        .query("campaigns")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else {
      campaigns = await ctx.db.query("campaigns").collect();
    }

    // Sort by start date
    campaigns.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return campaigns;
  },
});

// Get campaign statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();

    const activeCampaigns = campaigns.filter(c => c.status === "Active");
    const totalBudget = activeCampaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = activeCampaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalConversions = activeCampaigns.reduce((sum, c) => sum + c.conversions, 0);

    // Calculate overall ROAS
    const totalRevenue = activeCampaigns.reduce((sum, c) => sum + (c.spent * c.roas), 0);
    const overallRoas = totalSpent > 0 ? totalRevenue / totalSpent : 0;

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      plannedCampaigns: campaigns.filter(c => c.status === "Planned").length,
      totalBudget,
      totalSpent,
      totalConversions,
      overallRoas: Math.round(overallRoas * 10) / 10,
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
    };
  },
});

// Get a single campaign by ID
export const get = query({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Add a new campaign
export const add = mutation({
  args: {
    name: v.string(),
    status: v.union(
      v.literal("Planned"),
      v.literal("Active"),
      v.literal("Paused"),
      v.literal("Ended")
    ),
    channel: v.string(),
    budget: v.number(),
    spent: v.number(),
    roas: v.number(),
    conversions: v.number(),
    clicks: v.number(),
    impressions: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    targetAudience: v.string(),
    goals: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("campaigns", args);
  },
});

// Update campaign
export const update = mutation({
  args: {
    id: v.id("campaigns"),
    name: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("Planned"),
      v.literal("Active"),
      v.literal("Paused"),
      v.literal("Ended")
    )),
    channel: v.optional(v.string()),
    budget: v.optional(v.number()),
    spent: v.optional(v.number()),
    roas: v.optional(v.number()),
    conversions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    impressions: v.optional(v.number()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    goals: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// Delete campaign
export const remove = mutation({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk insert campaigns
export const bulkInsert = mutation({
  args: {
    campaigns: v.array(v.object({
      name: v.string(),
      status: v.union(
        v.literal("Planned"),
        v.literal("Active"),
        v.literal("Paused"),
        v.literal("Ended")
      ),
      channel: v.string(),
      budget: v.number(),
      spent: v.number(),
      roas: v.number(),
      conversions: v.number(),
      clicks: v.number(),
      impressions: v.number(),
      startDate: v.string(),
      endDate: v.string(),
      targetAudience: v.string(),
      goals: v.array(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const campaign of args.campaigns) {
      const id = await ctx.db.insert("campaigns", campaign);
      ids.push(id);
    }
    return ids;
  },
});
