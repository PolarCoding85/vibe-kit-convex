// providers/convex-client-provider.tsx

'use client'

import { ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

// Create the Convex client with optimized configuration
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

if (!convexUrl) {
  throw new Error(
    'NEXT_PUBLIC_CONVEX_URL is not defined. Please check your environment variables.'
  )
}

const convex = new ConvexReactClient(convexUrl, {
  // Enable warning when there are unsaved changes
  unsavedChangesWarning: true
})

/**
 * Provides Convex client with Clerk authentication integration.
 * This component ensures all Convex queries have access to the
 * current auth state and automatically refreshes tokens as needed.
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
