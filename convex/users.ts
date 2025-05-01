// convex/users.ts

import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator, ConvexError } from "convex/values";
import { authQuery } from "./util/customFunctions";

/**
 * Get the currently authenticated user
 */
export const current = authQuery({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    // Even though authQuery has already verified identity, TypeScript needs reassurance
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }
    return await userByExternalId(ctx, identity.subject);
  },
});

/**
 * Get a user by ID (requires authentication)
 */
export const getById = authQuery({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    const user = await ctx.db.get(id);
    if (!user) {
      throw new ConvexError("User not found");
    }
    return user;
  },
});

/**
 * Create or update a user from Clerk webhook data
 */
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      return await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
      return user._id;
    }
  },
});

/**
 * Delete a user based on Clerk webhook data
 */
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
      return { success: true };
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
      return { success: false, reason: "user_not_found" };
    }
  },
});

/**
 * Get the current user or throw an error if not found
 * @deprecated Use auth utilities from util/auth.ts instead
 */
export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new ConvexError("Can't get current user");
  return userRecord;
}

/**
 * Get the current user based on authentication information
 * @deprecated Use auth utilities from util/auth.ts instead
 */
export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

/**
 * Find a user by their external Clerk ID
 */
export async function userByExternalId(ctx: QueryCtx | MutationCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q: any) => q.eq("externalId", externalId))
    .unique();
}
