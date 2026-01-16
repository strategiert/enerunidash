import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Keywords für SEO/Content-Planung
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
    hasContent: v.boolean(),
    contentType: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_cluster", ["cluster"])
    .index("by_journeyPhase", ["journeyPhase"])
    .index("by_priorityScore", ["priorityScore"])
    .searchIndex("search_keyword", {
      searchField: "keyword",
      filterFields: ["cluster", "journeyPhase"],
    }),

  // Kalender-Events für Jahresplanung
  calendarEvents: defineTable({
    title: v.string(),
    date: v.string(), // ISO date string
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
  })
    .index("by_date", ["date"])
    .index("by_type", ["type"])
    .index("by_status", ["status"]),

  // Content-Items für die Content-Strategie
  contentItems: defineTable({
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
  })
    .index("by_pillarId", ["pillarId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // Content Pillars (Strategische Säulen)
  contentPillars: defineTable({
    title: v.string(),
    description: v.string(),
    color: v.string(),
    priority: v.union(v.literal("HOCH"), v.literal("MITTEL"), v.literal("NIEDRIG")),
    targetKeywords: v.number(),
    completedKeywords: v.number(),
  }),

  // Marketing-Kampagnen
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

  // Monatliche KPIs
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

  // Kanal-Attribution
  channelAttribution: defineTable({
    name: v.string(),
    value: v.number(),
    percentage: v.number(),
    color: v.string(),
    year: v.number(),
  }),

  // Infografiken-Plan
  infographics: defineTable({
    month: v.string(),
    title: v.string(),
    status: v.union(v.literal("Planned"), v.literal("In Progress"), v.literal("Published")),
    year: v.number(),
  }),
});
