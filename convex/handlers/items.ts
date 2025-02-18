import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { centsToDecimal, decimalToCents } from "../lib/helpers";
import { BidderItemsDto, ItemDto } from "../lib/types";

export const updateItemHandler = async (
  ctx: MutationCtx,
  args: {
    itemId: Id<"items">;
    updates: {
      description?: string;
      lotNo?: number;
      hammerPriceInEuros?: number;
      billedOn?: string;
    };
  }
) => {
  const definedUpdates = Object.fromEntries(
    Object.entries(args.updates)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) =>
        key === "hammerPriceInEuros"
          ? ["hammerPriceInCents", decimalToCents(value as number)]
          : [key, value]
      )
  );

  await ctx.db.patch(args.itemId, definedUpdates);
};

export const getItemsHandler = async (
  ctx: QueryCtx,
  args: { auctionId: Id<"auctions"> }
): Promise<ItemDto[]> => {
  const items = await ctx.db
    .query("items")
    .withIndex("auctionId", (q) => q.eq("auctionId", args.auctionId))
    .order("desc")
    .collect();

  return items.map((i) => ({
    id: i._id,
    auctionId: i.auctionId,
    description: i.description,
    lotNo: i.lotNo,
    hammerPriceInEuros: centsToDecimal(i.hammerPriceInCents),
    billedOn: i.billedOn,
    initialPriceInEuros: centsToDecimal(i.initialPriceInCents),
    status: i.status,
    creationTimestamp: i._creationTime,
  }));
};

export const createItemHandler = async (
  ctx: MutationCtx,
  args: {
    auctionId: Id<"auctions">;
    lotNo: number;
    description: string;
    initialPrice: number;
    billedOn?: string;
  }
) => {
  const auction = await ctx.db.get(args.auctionId);
  await ctx.db.patch(args.auctionId, {
    unsoldItems: auction!.unsoldItems + 1,
  });
  await ctx.db.insert("items", {
    auctionId: args.auctionId,
    lotNo: args.lotNo,
    description: args.description,
    initialPriceInCents: decimalToCents(args.initialPrice),
    billedOn: args.billedOn,
    hammerPriceInCents: decimalToCents(0),
  });
};

export const getBidderItemsHandler = async (
  ctx: QueryCtx,
  args: { auctionId: Id<"auctions"> }
): Promise<BidderItemsDto[]> => {
  const items = await ctx.db
    .query("items")
    .withIndex("auctionId", (q) => q.eq("auctionId", args.auctionId))
    .collect();

  const itemsByBidder = new Map<string, typeof items>();
  items
    .filter((i) => Boolean(i.billedOn))
    .forEach((item) => {
      const billedOn = item.billedOn!;
      const bidderItems = itemsByBidder.get(billedOn) || [];
      bidderItems.push(item);
      itemsByBidder.set(billedOn, bidderItems);
    });

  return Array.from(itemsByBidder.entries()).map(([bidder, items]) => ({
    bidder,
    items: items.map((item) => {
      const hammerPrice = centsToDecimal(item.hammerPriceInCents);
      const auctionFee = hammerPrice * 0.2;
      return {
        itemId: item._id,
        description: item.description,
        lotNumber: String(item.lotNo),
        hammerPriceInEuros: centsToDecimal(item.hammerPriceInCents),
        auctionFeeInEuros: centsToDecimal(auctionFee),
        amountInEuros: centsToDecimal(hammerPrice + auctionFee),
      };
    }),
  }));
};
