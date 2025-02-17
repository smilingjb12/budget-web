import { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import { QueryCtx } from "../_generated/server";

export async function requireAuthentication(
  ctx: QueryCtx
): Promise<UserIdentity> {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) {
    throw new ConvexError("Unauthorized");
  }

  return userIdentity;
}

export function decimalToCents(value: number): number {
  return Math.round(value * 100);
}

export function centsToDecimal(value: number): number {
  return value / 100;
}
