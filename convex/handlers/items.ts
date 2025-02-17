import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { centsToDecimal, decimalToCents } from "../lib/helpers";
import { ItemDto } from "../lib/types";

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
