import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { getMeHandler } from "./handlers/users";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    return await getMeHandler(ctx);
  },
});
