import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...rateLimitTables,
  ...authTables,
  auctions: defineTable({
    name: v.string(),
    status: v.union(v.literal("active"), v.literal("completed")),
    soldItems: v.number(),
    unsoldItems: v.number(),
    auctionFee: v.number(),
    commissions: v.number(),
    netReceipts: v.number(),
  }).index("status", ["status"]),
  items: defineTable({
    name: v.string(),
    topBidder: v.string(),
    topBid: v.number(),
  }),
});
