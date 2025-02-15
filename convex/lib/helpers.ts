import { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import { api } from "../_generated/api";
import { QueryCtx } from "../_generated/server";
import { convexEnv } from "./convexEnv";

export async function requireAuthentication(
  ctx: QueryCtx
): Promise<UserIdentity> {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) {
    throw new ConvexError("Unauthorized");
  }

  return userIdentity;
}
