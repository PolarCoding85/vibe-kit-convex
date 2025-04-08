// app/(public)/unauthorized/page.tsx

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnauthorizedPage() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            You do not have permission to access this page.
          </p>
          <Button asChild className='w-full'>
            <Link href='/'>Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
