// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, has } = await auth()

  // Check for admin routes first
  if (isAdminRoute(req)) {
    // If no organization, redirect to org selection
    if (!orgId) {
      const orgSelection = new URL('/my-organizations', req.url)
      return NextResponse.redirect(orgSelection)
    }

    // Check if user has admin role
    const isAdmin = has({ role: 'org:super_admin' })
    if (!isAdmin) {
      // Use the same URL construction pattern as org selection
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // If has org and is admin, protect the route
    await auth.protect({ role: 'org:super_admin' })
  }

  // For protected routes, check org membership
  if (isProtectedRoute(req)) {
    await auth.protect()

    if (!orgId) {
      const orgSelection = new URL('/my-organizations', req.url)
      return NextResponse.redirect(orgSelection)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
