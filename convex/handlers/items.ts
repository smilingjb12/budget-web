import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export const getItemsHandler = async (
  ctx: QueryCtx,
  args: { auctionId: Id<"auctions"> }
) => {
  const items = await ctx.db
    .query("items")
    .withIndex("auctionId", (q) => q.eq("auctionId", args.auctionId))
    .order("desc")
    .collect();

  return items;
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
    initialPrice: args.initialPrice,
    billedOn: args.billedOn,
    hammerPrice: 0,
  });
};
