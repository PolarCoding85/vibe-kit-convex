/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as memberships from "../memberships.js";
import type * as organizations from "../organizations.js";
import type * as permissions from "../permissions.js";
import type * as roles from "../roles.js";
import type * as sessions from "../sessions.js";
import type * as users from "../users.js";
import type * as util_auth from "../util/auth.js";
import type * as util_customFunctions from "../util/customFunctions.js";
import type * as util_orgAuth from "../util/orgAuth.js";
import type * as webhookEvents from "../webhookEvents.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  http: typeof http;
  invitations: typeof invitations;
  memberships: typeof memberships;
  organizations: typeof organizations;
  permissions: typeof permissions;
  roles: typeof roles;
  sessions: typeof sessions;
  users: typeof users;
  "util/auth": typeof util_auth;
  "util/customFunctions": typeof util_customFunctions;
  "util/orgAuth": typeof util_orgAuth;
  webhookEvents: typeof webhookEvents;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
