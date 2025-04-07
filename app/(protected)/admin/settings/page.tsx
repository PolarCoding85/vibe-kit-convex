// app/(protected)/admin/settings/page.tsx

'use client'

import { OrganizationSwitcher, Protect, useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsForm() {
const { userId, sessionId, has } = useAuth()
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')

  console.log('User ID:', userId)
  console.log('Session ID:', sessionId)
  console.log('Is Admin:', has?.({ role: 'org:admin' }))
  console.log('Can Manage Team Settings:', has?.({ role: 'org:team_settings:manage' }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement team settings update logic
    console.log('Team settings updated:', { teamName, teamDescription })
  }

  return (
    <div className="container p-8">
    <OrganizationSwitcher />
    <Protect
    condition={(has) => has({ role: 'org:admin' }) || has({ role: 'org:team_settings:manage' })}
      fallback={<p>You are not allowed to see this section.</p>}
    >

        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Team Settings</CardTitle>
                <CardDescription>Manage your team settings</CardDescription>
            </CardHeader>
            <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="teamName" className="block text-sm font-medium text-gray-700">Team Name</Label>
          <Input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <Label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700">Team Description</Label>
          <Textarea
            id="teamDescription"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <Button type="submit">Update Team Settings</Button>
      </form>  
            </CardContent>
        </Card>
      
    </Protect>
    </div>
  )
}