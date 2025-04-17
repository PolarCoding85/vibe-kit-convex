// app/(admin)/admin/settings/integrations/page.tsx

'use client'

import { useAuth } from '@clerk/nextjs'

export default function IntegrationsSettingsPage() {
  const { userId, sessionId, has } = useAuth()

  // Debug logs
  console.log('User ID:', userId)
  console.log('Session ID:', sessionId)
  console.log('Is Admin:', has?.({ role: 'org:admin' }))

  return (
    <div className='container mx-auto p-8'>
      <h1 className='mb-6 text-2xl font-bold'>Integrations Settings</h1>
    </div>
  )
}
