// app/(admin)/admin/page.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function AdminPage() {
  const { has, userId, orgId, sessionId } = useAuth()
  const router = useRouter()

  console.log('User ID:', userId)
  console.log('Organization ID:', orgId)
  console.log('Session ID:', sessionId)
  console.log('Is Admin:', has?.({ role: 'org:admin' }))

  useEffect(() => {
    if (has?.({ role: 'org:admin' })) {
      router.push('/admin/dashboard')
    }
  }, [has, router])

  if (!userId) {
    throw new Error('You must be signed in to add a verified domain')
  }

  if (!orgId) {
    throw new Error(
      'No active organization found. Set one as active or create/join one'
    )
  }

  return <p>Checking permissions...</p>
}
