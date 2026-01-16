import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Alle Kampagnen abrufen
export const list = query({
  args: { status: v.optional(v.string()) },
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

    campaigns.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    return campaigns;
  },
});

// Kampagnen mit verknüpften Content Pieces
export const listWithContent = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();
    const contentPieces = await ctx.db.query("contentPieces").collect();

    return campaigns.map(campaign => {
      const linkedContent = contentPieces.filter(cp => cp.campaignId === campaign._id);
      return {
        ...campaign,
        contentCount: linkedContent.length,
        content: linkedContent,
      };
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  },
});

// Einzelne Kampagne abrufen
export const get = query({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.id);
    if (!campaign) return null;

    const contentPieces = await ctx.db
      .query("contentPieces")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.id))
      .collect();

    return {
      ...campaign,
      contentCount: contentPieces.length,
      content: contentPieces,
    };
  },
});

// Kampagnen-Statistiken
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();
    const contentPieces = await ctx.db.query("contentPieces").collect();

    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

    const activeCampaigns = campaigns.filter(c => c.status === "Active");
    const avgRoas = activeCampaigns.length > 0
      ? activeCampaigns.reduce((sum, c) => sum + c.roas, 0) / activeCampaigns.length
      : 0;

    const linkedContentCount = contentPieces.filter(cp => cp.campaignId).length;

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      plannedCampaigns: campaigns.filter(c => c.status === "Planned").length,
      endedCampaigns: campaigns.filter(c => c.status === "Ended").length,
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      totalConversions,
      avgRoas: Math.round(avgRoas * 10) / 10,
      linkedContentCount,
    };
  },
});

// Kampagne hinzufügen
export const add = mutation({
  args: {
    name: v.string(),
    status: v.union(v.literal("Planned"), v.literal("Active"), v.literal("Paused"), v.literal("Ended")),
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

// Kampagne aktualisieren
export const update = mutation({
  args: {
    id: v.id("campaigns"),
    name: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Planned"), v.literal("Active"), v.literal("Paused"), v.literal("Ended"))),
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

// Kampagne löschen
export const remove = mutation({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    // Entferne auch die Verknüpfung von Content Pieces
    const linkedContent = await ctx.db
      .query("contentPieces")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.id))
      .collect();

    for (const piece of linkedContent) {
      await ctx.db.patch(piece._id, { campaignId: undefined });
    }

    await ctx.db.delete(args.id);
  },
});
