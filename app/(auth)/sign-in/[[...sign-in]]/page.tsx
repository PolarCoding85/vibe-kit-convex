// app/(auth)/sign-in/[...sign-in]/page.tsx

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <section>
      {/* Clerk Sign In Component */}
      {/* Note: Clerk handles the "Login" title, fields, button, and links */}
      <SignIn />
    </section>
  )
}
