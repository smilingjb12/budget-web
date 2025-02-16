import { ConvexError } from "convex/values";
import { api, internal } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";
import { Id } from "../_generated/dataModel";

export const getAuctionsHandler = async (
  ctx: QueryCtx,
  args: { year: number }
) => {
  return await ctx.db
    .query("auctions")
    .withIndex("year", (q) => q.eq("year", args.year))
    .order("desc")
    .collect();
};

export const createAuctionHandler = async (
  ctx: MutationCtx,
  args: { date: string }
) => {
  const date = new Date(args.date);
  const dateTimestamp = date.getTime();
  await ctx.db.insert("auctions", {
    dateTimestamp,
    status: "active",
    soldItems: 0,
    unsoldItems: 0,
    auctionFee: 0,
    commissions: 0,
    netReceipts: 0,
    year: date.getFullYear(),
    sales: 0,
  });
};

export const getAuctionsSummaryHandler = async (
  ctx: QueryCtx,
  args: { year: number }
) => {
  const auctions = await ctx.db
    .query("auctions")
    .withIndex("year", (q) => q.eq("year", args.year))
    .collect();

  const stats = {
    year: args.year,
    soldItems: auctions.reduce((acc, auction) => acc + auction.soldItems, 0),
    unsoldItems: auctions.reduce(
      (acc, auction) => acc + auction.unsoldItems,
      0
    ),
    sales: auctions.reduce((acc, auction) => acc + auction.sales, 0),
    auctionFees: auctions.reduce((acc, auction) => acc + auction.auctionFee, 0),
    commissions: auctions.reduce(
      (acc, auction) => acc + auction.commissions,
      0
    ),
    netReceipts: auctions.reduce(
      (acc, auction) => acc + auction.netReceipts,
      0
    ),
  };
  return stats;
};

export const deleteAuctionHandler = async (
  ctx: MutationCtx,
  args: { id: Id<"auctions"> }
) => {
  await ctx.db.delete(args.id);
};

