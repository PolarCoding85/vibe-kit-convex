// app/(public)/my-organizations/page.tsx

'use client'

import { OrganizationList, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MyOrganizationsPage() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in')
    }
  }, [isLoaded, userId, router])

  if (!isLoaded || !userId) {
    return null
  }

  return (
    <section>
      <OrganizationList
        afterCreateOrganizationUrl='/dashboard'
        afterSelectOrganizationUrl='/dashboard'
        hidePersonal
      />
    </section>
  )
}
