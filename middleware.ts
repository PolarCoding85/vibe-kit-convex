// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isApiRoute = createRouteMatcher(['/api/(.*)'])

// Helper to check if a user has system admin access via claims
const hasSystemAdminAccess = (sessionClaims: any) => {
  if (!sessionClaims) return false
  
  // Check for our custom claims that would be set via a JWT template in Clerk
  return (
    sessionClaims.isSuperAdmin === true || 
    sessionClaims.isSuperUser === true
  )
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, orgRole, has, sessionClaims } = await auth()
  
  // API routes need authentication but no redirects
  if (isApiRoute(req)) {
    await auth.protect()
    // Continue to the API route
    return NextResponse.next()
  }
  
  // Check for admin routes first
  if (isAdminRoute(req)) {
    // If no authentication at all, redirect to sign-in
    if (!userId) {
      const signIn = new URL('/sign-in', req.url)
      return NextResponse.redirect(signIn)
    }
    
    // Check if user has system admin access via custom claims
    const hasAdminAccess = hasSystemAdminAccess(sessionClaims)
    
    if (!hasAdminAccess) {
      // User doesn't have required permissions
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Protect the route with basic authentication
    await auth.protect()
    
    // Continue to the admin route
    return NextResponse.next()
  }

  // For protected routes, check org membership
  if (isProtectedRoute(req)) {
    // If not authenticated, redirect to sign-in
    if (!userId) {
      const signIn = new URL('/sign-in', req.url)
      return NextResponse.redirect(signIn)
    }
    
    await auth.protect()

    if (!orgId) {
      const orgSelection = new URL('/my-organizations', req.url)
      return NextResponse.redirect(orgSelection)
    }
    
    // Continue to the protected route
    return NextResponse.next()
  }
  
  // Default: continue to the requested page
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
