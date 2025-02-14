import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";

export default defineSchema({
  ...rateLimitTables,
  users: defineTable({
    userId: v.string(),
    email: v.string(),
  }).index("user_id", ["userId"]),
  auctions: defineTable({
    name: v.string(),
    status: v.union(v.literal("active"), v.literal("completed")),
  }).index("status", ["status"]),
  items: defineTable({
    name: v.string(),
    topBidder: v.string(),
    topBid: v.number(),
  }),
});
