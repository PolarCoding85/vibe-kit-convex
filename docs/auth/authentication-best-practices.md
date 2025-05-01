# Authentication Best Practices: Convex, Clerk and Next.js

## Authentication Best Practices: Convex, Clerk and NextJs

Authentication is the backbone of any full-stack application, but it’s also one
of the easiest places to introduce subtle, hard-to-debug security flaws. As
developers, we aim to build secure, reliable systems, but scaling an app to a
global audience presents unique challenges—especially regarding authentication.

At ClarityText, where we use Convex in production, we ran into unexpected
authentication issues that affected a significant number of users. The problem
stemmed from how we handled authentication checks in our client-side
application.

Our app relies on the useConvexAuth() hook to verify user sessions on the
client. The `useConvexAuth()` hook returns a promise that needs to be
awaited—meaning other React hooks, including Convex queries, can start running
before authentication is fully validated. The problem arose from the
unpredictability of whether authentication would complete before a Convex query
executed. This introduced a race condition where unauthenticated requests could
slip through, causing security risks and a frustrating user experience.

In this post, I’ll share what we learned about Convex authentication, how it
integrates with Clerk, and best practices for handling authentication
effectively. We’ll break down race conditions—what they are, why they happen,
and the risks they pose. Then, I’ll introduce three key rules to help you
prevent these issues when using Convex and Clerk. To wrap things up, I’ll
provide custom hooks that you can easily implement to create safer, more
reliable authentication flows in your applications.

## Where Does Authentication Belong in Your Application?

Authentication isn’t just about verifying users—it’s about ensuring security at
every layer of your application. When building with Convex, Next.js, and Clerk
(or similar tools), authentication needs to be considered at three key levels:

1. **Server-side Authentication** – Traditionally, authentication is handled at
   the backend using middleware. In frameworks like Next.js, middleware runs
   before API requests are processed, allowing authentication checks to happen
   early. Clerk, for example, uses middleware to validate user sessions before
   they reach API routes.
2. **Client-side Authentication** – Many web apps require real-time
   interactions, meaning authentication must also be handled by the client.
   React hooks like `useAuth()` from Clerk help verify user sessions in the
   browser, but client-side authentication alone isn’t secure since frontend
   code can be manipulated. It’s useful for UI state but shouldn’t be solely
   relied on for access control.
3. **Database Authentication (Convex)** – In a typical backend setup,
   authentication checks happen at the API level before interacting with a
   database. But with Convex, your backend is a database and public API. That
   means authentication checks must be enforced within Convex functions to
   ensure unauthorized users can’t read or write data.

Each of these layers plays a crucial role in securing your application. Failing
to authenticate users at any of them can lead to vulnerabilities, especially in
real-time applications where database queries might execute before
authentication is fully validated.

## Implementing Authentication Correctly

When working with authentication, it’s easy to assume that once a user is
authenticated at one layer of the application, they’re secure everywhere. But
with Next.js and Convex, authentication needs to be explicitly handled at
multiple points—especially in applications that mix server and client
components.

### The Hidden Authentication Risk in Next.js

Next.js makes it easy to secure API routes and server components using
middleware. However, if a server component renders a client component that
doesn’t properly handle authentication, it can expose parts of your app to
unauthorized users.

Consider this example:

Server.tsx

```tsx
import { ClientComponent } from './client-component'

export const ServerComponent = () => {
  const user_session = { userId: 'user_123' } // fetch this data from convex or a nextjs cookie

  return <ClientComponent session={user_session} />
}

export default ServerComponent
```

Client.tsx

```tsx
'use client'

import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'

interface Props {
  session: {
    userId: string
  }
}

export const ClientComponent = ({ session }: Props) => {
  const user = useQuery(api.users.get, { userId: session.userId })

  return <div>{user.password}</div>
}

export default ClientComponent
```

At first glance, this looks fine—middleware ensures the user is authenticated
before the server component runs. However, authentication must still be handled
explicitly in client components. If the client-side logic assumes authentication
has already been verified, it could mistakenly expose data or trigger
unauthorized Convex queries.

## Convex is a Public API by Default.

Unlike traditional databases where queries run directly on your backend server,
Convex operates as a public API, meaning queries are executed over the network.
This makes it easy to call Convex functions from client components, but it also
means authentication checks must happen at multiple layers—once on the client
and again within Convex’s backend functions. Since your Next.js server is
separate from the Convex backend, securing one doesn’t automatically secure the
other.

### Use Internal Functions for Increased Security

While public functions are accessible to client-side code, Convex also supports
internal functions that can only be called by other functions within your Convex
project. These are useful for protecting sensitive logic that shouldn't be
directly accessible from the client. By using internal functions, you can
minimize the public surface area of your application, reducing the risk of
exposing vulnerable operations to malicious users.

Internal functions are ideal for situations where you need to run more secure,
sensitive logic—such as handling authentication, processing payments, or
updating user data—without risking direct client access. They can be invoked
within actions, cron jobs, or other internal logic flows, ensuring that your
sensitive operations are kept behind the security of your backend. However,
remember that even with internal functions, you should still validate user
permissions and data integrity to safeguard against potential security flaws.

## Ensuring Authentication in Server Components

When using React Server Components, authentication can be enforced entirely on
the server, eliminating the need for client-side checks. This approach ensures
that sensitive data is never exposed to the client before authentication is
verified. It also allows us to fetch user-specific data more efficiently,
similar to traditional server-side rendering (SSR).

In a Next.js application, middleware can be used to enforce authentication
across all server components, ensuring that only authorized users access certain
pages.

### Securing Routes with Middleware

Next.js middleware runs before a request reaches a page, allowing us to validate
authentication and modify requests. Using Clerk, we can protect all
authenticated routes by checking the user's session and redirecting them if they
are not logged in.

Example from Clerk Nextjs docs

```tsx
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  if (!userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting

    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|wo==ff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
```

With this middleware in place, any request to `/dashboard` or `/forum` will
require authentication. If a user is not logged in, they will be redirected to
the sign-in page automatically.

### Fetching User Data in a Server Component

Once authentication is enforced through middleware, we can safely fetch user
data within a server component without worrying about unauthorized access. You
should still check authentication within your convex functions.

Example: Next.js Middleware for Authentication

```tsx
import { api } from '@convex/_generated/api'
import { auth } from '@clerk/nextjs/server'
import { fetchQuery } from 'convex/nextjs'

export const ServerComponent = async () => {
  const { userId } = await auth()

  const user = await fetchQuery(api.users.get, { userId })

  return <div>Hello, {user.name}!</div>
}

export default ServerComponent
```

### Why This Approach Works?

- **Middleware handles authentication upfront**, ensuring that only
  authenticated requests reach protected pages.
- **Server components fetch data securely** without exposing queries to the
  client.
- **No client-side authentication checks are required**, reducing frontend
  complexity and reducing chance of race conditions.

### Consider Other Frameworks and Security Risks

While this example focuses on Next.js, authentication practices vary between
frameworks. If you're using Vue, Svelte, or another React meta-framework (e.g.,
Remix, Gatsby), you should research how authentication and data-fetching work in
that ecosystem. Some frameworks may have different security risks or best
practices for handling authentication, session management, and data validation.
Understanding how your framework manages authentication will help you implement
the most secure and efficient approach for your Convex app.

## Ensuring Authentication in Client Components

While we’ve secured our server components, client-side authentication is just as
important when handling user interactions and front-end data fetching. Client
components in Next.js can directly interact with Convex, but we must ensure that
queries are only executed when the user is authenticated. This prevents
unauthorized requests and protects sensitive user data.

Convex provides the `useConvexAuth()` hook to manage authentication state within
React components. This hook allows us to track whether the user is authenticated
before making any queries or displaying protected content.

### Understanding `useConvexAuth()`

The `useConvexAuth()` hook provides two key values:

- `isLoading` – A boolean indicating whether the authentication state is still
  being determined. This helps prevent flashing unauthorized content before
  authentication is confirmed.
- `isAuthenticated` – A boolean that indicates whether the user is signed in. If
  true, you can safely proceed with rendering user-specific content and making
  database queries.

Example: Checking Authentication in a Client Component

```tsx
'use client'

import { api } from '@convex/_generated/api'
import { useConvexAuth, useQuery } from 'convex/react'

export const ClientComponent = () => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not allowed!</div>

  return <div>Welcome, user!</div>
}
```

### Setting Up the Convex Authentication Provider

To use `useConvexAuth()`, you need to ensure that the authentication state is
properly managed and passed down through a provider. In a Next.js app using
Clerk, this is handled by the `ConvexProviderWithClerk`.

Example: Wrapping the App with an Authentication Provider

```tsx
'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({
  children
}: {
  children: ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
```

By wrapping the entire application with `ConvexClientProvider`, authentication
data is available throughout the component tree. This ensures that the
authentication state is correctly passed down to all client components.

### Skipping Queries When the User is Not Authenticated

Even with proper authentication checks in the UI, we must ensure that Convex
queries do not execute before the user’s authentication state is confirmed on
the client side. A common mistake is triggering queries before checking
authentication, which can lead to unnecessary backend calls or even security
vulnerabilities.

Convex allows queries to be conditionally skipped using `"skip"`, preventing
them from running until authentication is established.

Example: Skipping Queries Until Authentication is Confirmed

```tsx
'use client'

import { api } from '@convex/_generated/api'
import { useConvexAuth, useQuery } from 'convex/react'

export const ClientComponent = ({ session }: { session: any }) => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  const user = useQuery(
    api.users.get,
    isAuthenticated ? { userId: session.userId } : 'skip'
  )

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not allowed!</div>

  return <div>{user?.password}</div>
}
```

Why This Matters

- **Prevents unauthorized queries** – Requests are only sent when the user is
  authenticated.
- **Optimizes performance** – Skipping queries reduces unnecessary backend
  calls.
- **Avoids race conditions** – Ensures authentication is fully resolved before
  fetching data.

## Securing Your Convex Backend

While securing authentication on the client and server is crucial, the final
layer of security lies in your Convex backend functions. Even if a user bypasses
frontend checks, your backend must enforce strict authorization to protect your
data.

Convex provides built-in authentication methods that allow you to validate user
identity before processing any database operations. By correctly implementing
these checks, you can ensure that only authenticated users can access or modify
data.

### Enforcing Authentication in Convex Functions

Every Convex function—queries, mutations, and actions—receives a context (`ctx`)
object that contains an `auth` property. This allows you to verify the
authenticated user before executing any logic.

Example: Restricting Access to Authenticated Users

```tsx
import { mutation } from './_generated/server'
import { v, ConvexError } from 'convex/values'

export const myMutation = mutation({
  args: {
    someData: v.any()
  },
  handler: async (ctx, { someData }) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError('Unauthenticated call to mutation')
    }

    // Proceed with database operations only for authenticated users...
  }
})
```

### \*\*Working with User Identity Fields

When `getUserIdentity()` is called, it returns a `UserIdentity` object
containing important authentication details. At a minimum, it will always
include:

- `tokenIdentifier` – A unique identifier for the user across authentication
  providers.
- `subject` – The user’s unique ID from the provider.
- `issuer` – The authentication provider that issued the token.

For users authenticated through Clerk or Auth0, additional fields like name,
email, and pictureUrl may be available.

### Enforcing Authorization with User Records

Authentication alone isn't enough—you also need to verify whether the user has
permission to access certain data. A common approach is to store user records in
your database and check their roles or permissions.

Example: Looking Up a User in the Database

```tsx
export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx)
  if (!userRecord) throw new ConvexError("Can't get current user")
  return userRecord
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null
  return await userByTokenIdentifier(ctx, identity.tokenIdentifier)
}

export async function userByTokenIdentifier(
  ctx: QueryCtx,
  tokenIdentifier: string
) {
  return await ctx.db
    .query('users')
    .withIndex('by_token', q => q.eq('tokenIdentifier', tokenIdentifier))
    .unique()
}
```

This function retrieves the authenticated user’s record from the database. If no
record is found, access is denied.

### Best Practices for Backend Security

- Always validate `ctx.auth.getUserIdentity()` before performing database
  operations.
- Restrict access by role or permissions when necessary.
- Log authentication failures to detect unauthorized access attempts.

### Considerations for Other Frameworks

If you’re using a different authentication provider or another framework like
Vue or Svelte, be sure to understand how the user state is managed. Different
frameworks may expose authentication details differently, and security risks can
vary based on implementation. Always review your authentication provider’s
documentation to ensure best practices.

## Simplifying Development with Custom Hooks and Utility Functions

When working with Convex, writing safe, reusable utilities is essential for
making backend logic easier to implement and reducing the risk of misusing
complex functions. By creating secure wrappers around common database operations
and React hooks, developers can avoid redundant code while ensuring consistent
authentication and error handling.

### Custom Backend Utilities: Queries, Mutations, and Actions

Convex allows you to define backend functions like queries, mutations, and
actions. To ensure these operations enforce authentication consistently, we can
wrap them in custom utility functions.

Example: Secure Convex Functions with Authentication

```tsx
import { action, mutation, query } from '../_generated/server'
import {
  customAction,
  customCtx,
  customMutation,
  customQuery
} from 'convex-helpers/server/customFunctions'
import { AuthenticationRequired } from '../users/utils'

/** Custom query that requires authentication */
export const authQuery = customQuery(
  query,
  customCtx(async ctx => {
    await AuthenticationRequired({ ctx })
    return {}
  })
)

/** Custom mutation that requires authentication */
export const authMutation = customMutation(
  mutation,
  customCtx(async ctx => {
    await AuthenticationRequired({ ctx })
    return {}
  })
)

/** Custom action that requires authentication */
export const authAction = customAction(
  action,
  customCtx(async ctx => {
    await AuthenticationRequired({ ctx })
    return {}
  })
)

/** Checks if the current user is authenticated. Throws if not */
export async function AuthenticationRequired({
  ctx
}: {
  ctx: QueryCtx | MutationCtx | ActionCtx
}) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    throw new ConvexError('Not authenticated!')
  }
}
```

One of the major benefits of extending Convex's base functions is the ability to
modify and extend the context. This allows you to inject additional data or
logic before a `query`, `mutation`, or `action` executes. If you have further
questions, I recommend joining the Convex Discord server for community support
and discussions.

At a high level, a custom function wraps and calls the base function internally.
This provides an opportunity to execute additional logic before the function
runs. In the example above, the `return {}` statement passes an empty object,
meaning Convex will retain its default context values. However, you can modify
this to return additional data, such as a user object, which would allow all
your database queries to access user data without redundant queries.

By structuring your custom functions this way, they become **drop-in
replacements** for your existing queries and mutations while maintaining full
compatibility with Convex's default behavior.

## Making React Querying Easier with Custom Hooks

When working with Convex in React, fetching data can become repetitive. To
improve developer experience, we can use custom hooks to abstract complex logic,
making queries easier to implement while enforcing authentication.

### Using `useQueryWithStatus` for Enhanced Query Information

The `convex-helpers` package provides `makeUseQueryWithStatus`, a utility that
extends Convex’s `useQuery` to include additional metadata such as:

- `status`: `'pending' | 'error' | 'success'`
- `isPending`: Whether the request is still in progress
- `isSuccess`: Whether the request was successful
- `isError`: Whether an error occurred
- `error`: The error object
- `data`: The data returned from the convex function

### Example: Importing and Using `useQueryWithStatus`

```tsx
import { makeUseQueryWithStatus } from 'convex-helpers/react'
import { useQueries } from 'convex-helpers/react/cache/hooks'

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries)
```

This utility makes working with queries more intuitive by giving immediate
feedback about their status.

## Authenticated Query Hooks: Simplifying Authentication Logic

Instead of manually checking if a user is authenticated before running a query
in every component, we can create custom hooks that automatically handle
authentication for us.

`useAuthenticatedQueryWithStatus` – **Handling Authentication Automatically**

```tsx
import { FunctionReference } from 'convex/server'
import {
  OptionalRestArgsOrSkip,
  useConvexAuth,
  useQueryWithStatus
} from 'convex/react'

/**
 * A wrapper around useQueryWithStatus that automatically checks authentication state.
 * If the user is not authenticated, the query is skipped.
 */
export function useAuthenticatedQueryWithStatus<
  Query extends FunctionReference<'query'>
>(query: Query, args: OptionalRestArgsOrSkip<Query>[0] | 'skip') {
  const { isAuthenticated } = useConvexAuth()
  return useQueryWithStatus(query, isAuthenticated ? args : 'skip')
}
```

## Paginated Query Hook: Handling Pagination Securely

For paginated queries, we can extend the same authentication logic:

```tsx
import {
  PaginatedQueryArgs,
  PaginatedQueryReference,
  useConvexAuth,
  usePaginatedQuery
} from 'convex/react'

/**
 * A wrapper around usePaginatedQuery that automatically handles authentication state.
 * If the user is not authenticated, the query is skipped.
 */
export function useAuthenticatedPaginatedQuery<
  Query extends PaginatedQueryReference
>(
  query: Query,
  args: PaginatedQueryArgs<Query> | 'skip',
  options: { initialNumItems: number }
) {
  const { isAuthenticated } = useConvexAuth()
  return usePaginatedQuery(query, isAuthenticated ? args : 'skip', options)
}
```

## Why Use Custom Hooks and Utility Functions?

Good API design and well-structured utility functions are crucial in production
environments. They simplify complex logic, improve maintainability, and make
debugging easier—especially when working in a team. Here’s why investing in
custom hooks and utilities pays off:

1. **Encapsulate Complex Logic** – Developers don’t need to understand every
   failure mode or edge case; they just call a function that "just works"
   without needing to dive into internal details.
2. **Enforce Security by Default** – Authentication and permission checks happen
   in a centralized place, ensuring every function follows security best
   practices and reducing the risk of human error.
3. **Reduce Boilerplate Code** – Avoid copy-pasting authentication and
   error-handling logic into every function. Instead, these checks happen
   automatically, keeping code **clean and DRY**.
4. **Improve Team Collaboration** – A well-designed API allows other developers
   to use your functions without needing deep knowledge of how they work. This
   makes onboarding easier and speeds up development.
5. **Simplify Debugging and Logging** – Wrapping key operations in utilities
   makes it easier to log errors consistently, trace issues, and update logic in
   one place without refactoring multiple files.

### Flexible And Secure Development

In production, good API design isn’t just about convenience—it’s about
preventing costly mistakes and improving long-term maintainability. Investing in
structured, reusable utilities will save time, reduce bugs, and keep your
application secure in the long run.

## One Last Commit Before We Ship

At the end of the day, good API design isn’t just about making life easier—it’s
about making sure you don’t wake up at 2 AM because someone forgot an
authentication check. By structuring your backend utilities and React hooks
properly, you’re not just writing code—you’re writing code that others will
thank you for.

A well-designed API keeps things predictable, maintainable, and secure, making
collaboration smoother and debugging less of a nightmare. It’s the difference
between confidently shipping a feature and spending hours in a Slack thread
trying to figure out why that one function call only works on Bob’s machine.

And remember: race conditions aren’t just a problem in concurrent programming.
They also happen in real life—like when two developers both deploy a fix at the
same time and accidentally roll back the one that actually worked.

So take your time, build smart utilities, and design APIs that make everyone’s
job easier. Your future self (and your teammates) will thank you. 🚀
