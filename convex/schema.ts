import { authTables } from "@convex-dev/auth/server";
import { rateLimitTables } from "convex-helpers/server/rateLimit";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...rateLimitTables,
  ...authTables,
  auctions: defineTable({
    dateTimestamp: v.number(),
    status: v.union(v.literal("active"), v.literal("completed")),
    soldItems: v.number(),
    sales: v.number(),
    unsoldItems: v.number(),
    auctionFee: v.number(),
    commissions: v.number(),
    netReceipts: v.number(),
    year: v.number(),
  })
    .index("status", ["status"])
    .index("year", ["year"]),
  items: defineTable({
    auctionId: v.id("auctions"),
    description: v.string(),
    lotNo: v.number(),
    hammerPrice: v.number(),
    billedOn: v.optional(v.string()),
    initialPrice: v.number(),
    status: v.optional(v.union(v.literal("withheld"))),
  }).index("auctionId", ["auctionId"]),
});
