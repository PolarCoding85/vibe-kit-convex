// app/(auth)/sign-up/[...sign-up]/page.tsx

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <section>
      {/* Clerk Sign Up Component */}
      {/* Note: Clerk handles the "Login" title, fields, button, and links */}
      <SignUp />
    </section>
  )
}
