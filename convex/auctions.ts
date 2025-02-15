import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { getMeHandler } from "./handlers/users";
import { getAuctionsHandler } from "./handlers/auctions";

export const getAuctions = query({
  args: {},
  handler: async (ctx) => {
    return await getAuctionsHandler(ctx);
  },
});
