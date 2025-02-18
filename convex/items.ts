import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  createItemHandler,
  getBidderItemsHandler,
  getItemsHandler,
  updateItemHandler,
} from "./handlers/items";
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

export const updateItem = mutation({
  args: {
    itemId: v.id("items"),
    updates: v.object({
      description: v.optional(v.string()),
      lotNo: v.optional(v.number()),
      hammerPriceInEuros: v.optional(v.number()),
      billedOn: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await updateItemHandler(ctx, args);
  },
});

export const getBidderItems = query({
  args: {
    auctionId: v.id("auctions"),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getBidderItemsHandler(ctx, args);
  },
});
