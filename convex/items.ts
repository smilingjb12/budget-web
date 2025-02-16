import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createItemHandler, getItemsHandler } from "./handlers/items";
import { requireAuthentication } from "./lib/helpers";

export const getItems = query({
  args: {
    auctionId: v.id("auctions"),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getItemsHandler(ctx, args);
  },
});

export const createItem = mutation({
  args: {
    auctionId: v.id("auctions"),
    lotNo: v.number(),
    description: v.string(),
    initialPrice: v.number(),
    billedOn: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await createItemHandler(ctx, args);
  },
});
