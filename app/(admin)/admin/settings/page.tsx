// app/(admin)/admin/settings/page.tsx
// This page implements a view/edit pattern for team settings
// - All users with access can view the settings
// - Only users with 'org:team_settings:edit' permission can edit

'use client'

import { Protect, useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Edit } from 'lucide-react'

export default function SettingsForm() {
  const { userId, sessionId, has } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [teamName, setTeamName] = useState('Demo Team') // Pre-populated for demo
  const [teamDescription, setTeamDescription] = useState(
    'This is a demo team description'
  ) // Pre-populated for demo

  // Debug logs
  console.log('User ID:', userId)
  console.log('Session ID:', sessionId)
  console.log('Is Admin:', has?.({ role: 'org:admin' }))
  console.log(
    'Can Edit Team Settings:',
    has?.({ permission: 'org:team_settings:edit' })
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement team settings update logic
    console.log('Team settings updated:', { teamName, teamDescription })
    setIsEditing(false)
  }

  return (
    <div className='container p-8'>
      <Card className='mx-auto max-w-4xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Team Settings</CardTitle>
            <CardDescription>Manage your team settings</CardDescription>
          </div>

          {/* Edit button - only shown to users with edit permission */}
          <Protect permission='org:team_settings:edit' fallback={null}>
            {!isEditing && (
              <Button
                variant='outline'
                onClick={() => setIsEditing(true)}
                className='ml-4'
              >
                <Edit className='mr-2 size-4' />
                Edit Settings
              </Button>
            )}
          </Protect>
        </CardHeader>

        <CardContent>
          {/* View-only content - shown to all users with page access */}
          {!isEditing && (
            <div className='space-y-4'>
              <div>
                <Label
                  htmlFor='teamName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Team Name
                </Label>
                <Input
                  type='text'
                  id='teamName'
                  value={teamName}
                  disabled
                  className='focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm'
                />
              </div>
              <div>
                <Label
                  htmlFor='teamDescription'
                  className='block text-sm font-medium text-gray-700'
                >
                  Team Description
                </Label>
                <Textarea
                  id='teamDescription'
                  value={teamDescription}
                  disabled
                  rows={3}
                  className='focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm'
                />
              </div>
            </div>
          )}

          {/* Edit form - only shown to users with edit permission when editing */}
          <Protect permission='org:team_settings:edit' fallback={null}>
            {isEditing && (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label
                    htmlFor='teamName'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Team Name
                  </Label>
                  <Input
                    type='text'
                    id='teamName'
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className='focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200'
                  />
                </div>
                <div>
                  <Label
                    htmlFor='teamDescription'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Team Description
                  </Label>
                  <Textarea
                    id='teamDescription'
                    value={teamDescription}
                    onChange={e => setTeamDescription(e.target.value)}
                    rows={3}
                    className='focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200'
                  />
                </div>
                <div className='flex space-x-2'>
                  <Button type='submit'>Save Changes</Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Protect>
        </CardContent>
      </Card>
    </div>
  )
}
