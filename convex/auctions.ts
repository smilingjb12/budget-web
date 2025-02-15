import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getMeHandler } from "./handlers/users";
import {
  createAuctionHandler,
  getAuctionsHandler,
  getAuctionsSummaryHandler,
} from "./handlers/auctions";
import { requireAuthentication } from "./lib/helpers";

export const getAuctions = query({
  args: {},
  handler: async (ctx) => {
    await requireAuthentication(ctx);
    return await getAuctionsHandler(ctx);
  },
});

export const createAuction = mutation({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await createAuctionHandler(ctx, args);
  },
});

export const getAuctionsSummary = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getAuctionsSummaryHandler(ctx, args);
  },
});
