import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";
import { authTables } from "@convex-dev/auth/server";

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
    name: v.string(),
    topBidder: v.string(),
    topBid: v.number(),
  }),
});
