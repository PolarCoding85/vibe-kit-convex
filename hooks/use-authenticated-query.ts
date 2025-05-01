// hooks/use-authenticated-query.ts

import { useConvexAuth } from "convex/react";
import { FunctionReference } from "convex/server";
import { 
  OptionalRestArgsOrSkip, 
  PaginatedQueryArgs,
  PaginatedQueryReference,
  usePaginatedQuery,
  useQuery
} from "convex/react";

/**
 * Custom hook that wraps useQuery with additional status information
 */
export function useQueryWithStatus<Query extends FunctionReference<"query">>(  
  query: Query,
  args: OptionalRestArgsOrSkip<Query>[0] | "skip"
) {
  const result = useQuery(query, args);
  const status = {
    isLoading: result === undefined,
    isSuccess: result !== undefined,
    isError: false,
    error: null,
    data: result
  };
  
  return status;
}

/**
 * A wrapper around useQueryWithStatus that automatically checks authentication state.
 * If the user is not authenticated, the query is skipped.
 * 
 * @param query The Convex query function to execute
 * @param args Arguments to pass to the query, or 'skip' to not run the query
 * @returns Query result with status information
 */
export function useAuthenticatedQueryWithStatus<
  Query extends FunctionReference<"query">
>(query: Query, args: OptionalRestArgsOrSkip<Query>[0] | "skip") {
  const { isAuthenticated } = useConvexAuth();
  return useQueryWithStatus(query, isAuthenticated ? args : "skip");
}

/**
 * A wrapper around useQuery that automatically checks authentication state.
 * If the user is not authenticated, the query is skipped.
 * 
 * @param query The Convex query function to execute
 * @param args Arguments to pass to the query, or 'skip' to not run the query
 * @returns Query result
 */
export function useAuthenticatedQuery<
  Query extends FunctionReference<"query">
>(query: Query, args: OptionalRestArgsOrSkip<Query>[0] | "skip") {
  const { isAuthenticated } = useConvexAuth();
  return useQuery(query, isAuthenticated ? args : "skip");
}

/**
 * A wrapper around usePaginatedQuery that automatically checks authentication state.
 * If the user is not authenticated, the query is skipped.
 * 
 * @param query The Convex paginated query function to execute
 * @param args Arguments to pass to the query, or 'skip' to not run the query
 * @param options Pagination options
 * @returns Paginated query result
 */
export function useAuthenticatedPaginatedQuery<
  Query extends PaginatedQueryReference
>(
  query: Query,
  args: PaginatedQueryArgs<Query> | "skip",
  options: { initialNumItems: number }
) {
  const { isAuthenticated } = useConvexAuth();
  return usePaginatedQuery(query, isAuthenticated ? args : "skip", options);
}
