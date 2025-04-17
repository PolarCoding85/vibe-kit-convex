// app/(admin)/admin/settings/page.tsx
// This page shows settings cards with appropriate permissions

'use client'

import { Protect, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { User, Building, Users, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export default function SettingsForm() {
  const { userId, sessionId, has } = useAuth()

  // Debug logs
  console.log('User ID:', userId)
  console.log('Session ID:', sessionId)
  console.log('Is Admin:', has?.({ role: 'org:admin' }))

  return (
    <div className='container mx-auto p-8'>
      <h1 className='mb-6 text-2xl font-bold'>Admin Settings</h1>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {/* Profile Settings Card - No permissions required */}
        <Card className='transition-shadow duration-300 hover:shadow-md'>
          <CardHeader className='flex flex-row items-center gap-4'>
            <User className='text-primary size-8' />
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal profile settings
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Update your profile information, preferences, and account
              settings.
            </p>
          </CardContent>
          <CardFooter>
            <Link href='/admin/settings/profile'>
              <Button>Manage Profile</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Organization Settings Card - Requires org:sys_profile:manage permission */}
        <Protect permission='org:sys_profile:manage' fallback={null}>
          <Card className='transition-shadow duration-300 hover:shadow-md'>
            <CardHeader className='flex flex-row items-center gap-4'>
              <Building className='text-primary size-8' />
              <div>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                  Manage your organization settings
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Configure organization details, branding, and global
                preferences.
              </p>
            </CardContent>
            <CardFooter>
              <Link href='/admin/settings/organization'>
                <Button>Manage Organization</Button>
              </Link>
            </CardFooter>
          </Card>
        </Protect>

        {/* Team Settings Card - Requires org:team_settings:manage permission */}
        <Protect permission='org:team_settings:manage' fallback={null}>
          <Card className='transition-shadow duration-300 hover:shadow-md'>
            <CardHeader className='flex flex-row items-center gap-4'>
              <Users className='text-primary size-8' />
              <div>
                <CardTitle>Team Settings</CardTitle>
                <CardDescription>Manage your team settings</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Manage team members, roles, permissions, and team-specific
                configurations.
              </p>
            </CardContent>
            <CardFooter>
              <Link href='/admin/settings/team'>
                <Button>Manage Team</Button>
              </Link>
            </CardFooter>
          </Card>
        </Protect>

        {/* Integrations Settings Card - Requires org:integrations_settings:manage permission */}
        <Protect permission='org:integration_settings:manage' fallback={null}>
          <Card className='transition-shadow duration-300 hover:shadow-md'>
            <CardHeader className='flex flex-row items-center gap-4'>
              <LinkIcon className='text-primary size-8' />
              <div>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Manage your integrations</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Configure third-party integrations, APIs, and connected
                services.
              </p>
            </CardContent>
            <CardFooter>
              <Link href='/admin/settings/integrations'>
                <Button>Manage Integrations</Button>
              </Link>
            </CardFooter>
          </Card>
        </Protect>
      </div>
    </div>
  )
}
