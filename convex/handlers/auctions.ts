import { ConvexError } from "convex/values";
import { api, internal } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

export const getAuctionsHandler = async (ctx: QueryCtx) => {
  return await ctx.db.query("auctions").collect();
};
