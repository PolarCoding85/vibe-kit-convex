// hooks/use-auth-status.ts

import { useConvexAuth } from "convex/react";

/**
 * Custom hook that provides authentication status with additional
 * helper properties for common auth states to simplify UI conditionals.
 * 
 * @returns Authentication status states
 */
export function useAuthStatus() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return {
    // Direct states from useConvexAuth
    isLoading,
    isAuthenticated,
    
    // Derived states for easier UI conditionals
    isUnauthenticated: !isLoading && !isAuthenticated,
    isAuthenticating: isLoading,
    isReady: !isLoading
  };
}

/**
 * Utility to generate a message based on authentication status.
 * Useful for debugging or informing users about their auth state.
 * 
 * @param status Auth status object from useAuthStatus
 * @returns A human-readable status message
 */
export function getAuthStatusMessage(status: ReturnType<typeof useAuthStatus>): string {
  if (status.isLoading) return "Checking authentication...";
  if (status.isAuthenticated) return "Authenticated";
  return "Not authenticated";
}
