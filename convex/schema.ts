import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============ EINHEITLICHES CONTENT-MODELL ============
  // Dies ist DIE zentrale Tabelle für alle Content-Pieces
  // Änderungen hier werden überall sichtbar (Kalender, Content, Keywords, etc.)

  contentPieces: defineTable({
    // Basis-Informationen
    title: v.string(),
    description: v.optional(v.string()),

    // Zeitplanung (für Kalender)
    publishDate: v.string(), // ISO date string YYYY-MM-DD

    // Content-Typ & Kanal
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

    // Status-Tracking
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

    // Content-Strategie
    pillarId: v.optional(v.id("contentPillars")),
    journeyPhase: v.union(
      v.literal("Awareness"),
      v.literal("Consideration"),
      v.literal("Decision"),
      v.literal("Action"),
      v.literal("Retention")
    ),

    // Keyword-Verknüpfung (Array von Keyword-IDs)
    targetKeywords: v.optional(v.array(v.id("keywords"))),
    primaryKeyword: v.optional(v.id("keywords")),

    // Kampagnen-Verknüpfung
    campaignId: v.optional(v.id("campaigns")),

    // Team & Workflow
    assignee: v.optional(v.string()),
    author: v.optional(v.string()),

    // Performance (nach Veröffentlichung)
    views: v.optional(v.number()),
    conversions: v.optional(v.number()),

    // Meta
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_publishDate", ["publishDate"])
    .index("by_status", ["status"])
    .index("by_channel", ["channel"])
    .index("by_contentType", ["contentType"])
    .index("by_pillarId", ["pillarId"])
    .index("by_journeyPhase", ["journeyPhase"])
    .index("by_campaignId", ["campaignId"])
    .index("by_primaryKeyword", ["primaryKeyword"])
    .searchIndex("search_content", {
      searchField: "title",
      filterFields: ["status", "channel", "contentType", "journeyPhase"],
    }),

  // ============ KEYWORDS ============
  keywords: defineTable({
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
    // hasContent wird automatisch berechnet basierend auf contentPieces
    notes: v.optional(v.string()),
  })
    .index("by_cluster", ["cluster"])
    .index("by_journeyPhase", ["journeyPhase"])
    .index("by_priorityScore", ["priorityScore"])
    .searchIndex("search_keyword", {
      searchField: "keyword",
      filterFields: ["cluster", "journeyPhase"],
    }),

  // ============ CONTENT PILLARS ============
  contentPillars: defineTable({
    title: v.string(),
    description: v.string(),
    color: v.string(),
    priority: v.union(v.literal("HOCH"), v.literal("MITTEL"), v.literal("NIEDRIG")),
    // Ziel-Anzahl für Content Pieces
    targetCount: v.number(),
  }),

  // ============ KAMPAGNEN ============
  campaigns: defineTable({
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
  })
    .index("by_status", ["status"])
    .index("by_startDate", ["startDate"]),

  // ============ KPIs & ANALYTICS ============
  monthlyKPIs: defineTable({
    month: v.string(),
    year: v.number(),
    revenue: v.number(),
    target: v.number(),
    conversions: v.number(),
    usvShare: v.number(),
    roas: v.number(),
    organicTraffic: v.number(),
    paidTraffic: v.number(),
  })
    .index("by_year_month", ["year", "month"]),

  channelAttribution: defineTable({
    name: v.string(),
    value: v.number(),
    percentage: v.number(),
    color: v.string(),
    year: v.number(),
  }),
});
