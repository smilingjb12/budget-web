import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { centsToDecimal } from "../lib/helpers";
import { AuctionDto, AuctionSummaryDto } from "../lib/types";

export const getAuctionsByYearHandler = async (
  ctx: QueryCtx,
  args: { year: number }
): Promise<AuctionDto[]> => {
  const auctions = await ctx.db
    .query("auctions")
    .withIndex("year", (q) => q.eq("year", args.year))
    .collect();

  return auctions.map(mapAuctionToDto);
};

export const createAuctionHandler = async (
  ctx: MutationCtx,
  args: { date: string }
) => {
  const date = new Date(args.date);
  const dateTimestamp = date.getTime();
  return await ctx.db.insert("auctions", {
    dateTimestamp,
    status: "active",
    soldItems: 0,
    unsoldItems: 0,
    auctionFeeInCents: 0,
    commissionsInCents: 0,
    netReceiptsInCents: 0,
    year: date.getFullYear(),
    salesInCents: 0,
  });
};

export const getAuctionsSummaryHandler = async (
  ctx: QueryCtx,
  args: { year: number }
): Promise<AuctionSummaryDto> => {
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
    salesInEuros: centsToDecimal(
      auctions.reduce((acc, auction) => acc + auction.salesInCents, 0)
    ),
    auctionFeesInEuros: centsToDecimal(
      auctions.reduce((acc, auction) => acc + auction.auctionFeeInCents, 0)
    ),
    commissionsInEuros: centsToDecimal(
      auctions.reduce((acc, auction) => acc + auction.commissionsInCents, 0)
    ),
    netReceiptsInEuros: centsToDecimal(
      auctions.reduce((acc, auction) => acc + auction.netReceiptsInCents, 0)
    ),
  };
  return stats;
};

export const getAuctionSummaryHandler = async (
  ctx: QueryCtx,
  args: { auctionId: Id<"auctions"> }
): Promise<AuctionSummaryDto | null> => {
  const auction = await ctx.db.get(args.auctionId);
  return mapAuctionToSummaryDto(auction!);
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
): Promise<AuctionDto | null> => {
  const auction = await ctx.db.get(args.id);
  if (!auction) {
    return null;
  }
  return mapAuctionToDto(auction);
};

function mapAuctionToDto(auction: Doc<"auctions">): AuctionDto {
  return {
    id: auction._id,
    year: auction.year,
    dateTimestamp: auction.dateTimestamp,
    soldItems: auction.soldItems,
    salesInEuros: centsToDecimal(auction.salesInCents),
    unsoldItems: auction.unsoldItems,
    auctionFeesInEuros: centsToDecimal(auction.auctionFeeInCents),
    commissionsInEuros: centsToDecimal(auction.commissionsInCents),
    netReceiptsInEuros: centsToDecimal(auction.netReceiptsInCents),
  };
}

function mapAuctionToSummaryDto(auction: Doc<"auctions">): AuctionSummaryDto {
  return {
    year: auction.year,
    soldItems: auction.soldItems,
    unsoldItems: auction.unsoldItems,
    salesInEuros: centsToDecimal(auction.salesInCents),
    auctionFeesInEuros: centsToDecimal(auction.auctionFeeInCents),
    commissionsInEuros: centsToDecimal(auction.commissionsInCents),
    netReceiptsInEuros: centsToDecimal(auction.netReceiptsInCents),
  };
}
