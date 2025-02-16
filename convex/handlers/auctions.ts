import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

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
  console.log("CREATE A:", args.date, date);
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

export const getAuctionSummaryHandler = async (
  ctx: QueryCtx,
  args: { auctionId: Id<"auctions"> }
) => {
  const auction = await ctx.db.get(args.auctionId);
  if (!auction) {
    return {
      year: 0,
      soldItems: 0,
      unsoldItems: 0,
      sales: 0,
      auctionFees: 0,
      commissions: 0,
      netReceipts: 0,
    };
  }

  const stats = {
    year: auction.year,
    soldItems: auction.soldItems,
    unsoldItems: auction.unsoldItems,
    sales: auction.sales,
    auctionFees: auction.auctionFee,
    commissions: auction.commissions,
    netReceipts: auction.netReceipts,
  };
  return stats;
};

export const deleteAuctionHandler = async (
  ctx: MutationCtx,
  args: { id: Id<"auctions"> }
) => {
  await ctx.db.delete(args.id);
};

export const getAuctionByIdHandler = async (
  ctx: QueryCtx,
  args: { id: Id<"auctions"> }
) => {
  return await ctx.db.get(args.id);
};
