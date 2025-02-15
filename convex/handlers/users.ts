import { ConvexError } from "convex/values";
import { api, internal } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";
import { Id } from "../_generated/dataModel";

export const getMeHandler = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const userId = identity.subject.split("|")[0];
  const user = await ctx.db
    .query("users")
    .withIndex("by_id", (q) => q.eq("_id", userId as Id<"users">))
    .first();

  return user;
};
