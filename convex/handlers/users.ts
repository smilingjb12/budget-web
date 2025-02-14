import { ConvexError } from "convex/values";
import { api, internal } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

export const getCurrentUserHandler = async (ctx: QueryCtx) => {
  const userIdentity = await ctx.auth.getUserIdentity();
  return await ctx.runQuery(internal.users.getByUserId, {
    userId: userIdentity!.subject,
  });
};

export const createSignedInUserHandler = async (
  ctx: MutationCtx,
  args: { userId: string; email: string }
) => {
  return await ctx.db.insert("users", {
    userId: args.userId,
    email: args.email,
  });
};

export const getByUserIdHandler = async (
  ctx: QueryCtx,
  args: { userId: string }
) => {
  const user = await ctx.db
    .query("users")
    .withIndex("user_id", (q) => q.eq("userId", args.userId))
    .first();

  return user;
};
