// app/(admin)/admin/page.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminPage() {
  const { has, userId, orgId, sessionId } = useAuth()
  const router = useRouter()

  // Move authentication logic to useEffect to avoid errors during build time
  useEffect(() => {
    console.log('User ID:', userId)
    console.log('Organization ID:', orgId)
    console.log('Session ID:', sessionId)
    console.log('Is Admin:', has?.({ role: 'org:super_admin' }))

    if (!userId) {
      // Show error message or redirect to login instead of throwing
      router.push('/login')
      return
    }

    if (!orgId) {
      // Show error message or handle this case appropriately
      router.push('/my-organizations')
      return
    }

    if (has?.({ role: 'org:super_admin' })) {
      router.push('/admin/dashboard')
    }
  }, [userId, orgId, has, router, sessionId])

  // Enhanced loading UI that doesn't require authentication data during build
  return (
    <div className='flex min-h-[70vh] items-center justify-center'>
      <Card className='w-[350px] shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Loader2 className='text-primary h-5 w-5 animate-spin' />
            <span>Admin Portal</span>
          </CardTitle>
          <CardDescription>Verifying your credentials...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
