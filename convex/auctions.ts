import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  createAuctionHandler,
  deleteAuctionHandler,
  getAuctionByIdHandler,
  getAuctionsHandler,
  getAuctionsSummaryHandler,
  getAuctionSummaryHandler,
} from "./handlers/auctions";
import { requireAuthentication } from "./lib/helpers";

export const getAuctions = query({
  args: {
    year: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getAuctionsHandler(ctx, args);
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

export const deleteAuction = mutation({
  args: {
    id: v.id("auctions"),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await deleteAuctionHandler(ctx, args);
  },
});

export const getAuctionsSummary = query({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getAuctionsSummaryHandler(ctx, args);
  },
});

export const getAuctionSummary = query({
  args: { auctionId: v.id("auctions") },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getAuctionSummaryHandler(ctx, args);
  },
});

export const getAuctionById = query({
  args: {
    id: v.id("auctions"),
  },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getAuctionByIdHandler(ctx, args);
  },
});
