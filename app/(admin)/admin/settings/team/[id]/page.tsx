// components/pages/admin/settings/team/[id]/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Protect, useAuth, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { organizationRoles } from '@/lib/constants/organizations-roles'
import { AdminPageHeader } from '@/components/layout/admin/admin-page-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function TeamMemberSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const { userId: currentUserId } = useAuth()
  const { user } = useUser()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [memberRole, setMemberRole] = useState('')
  const [memberStatus, setMemberStatus] = useState<'active' | 'inactive'>(
    '' as 'active' | 'inactive'
  )
  const [memberData, setMemberData] = useState<{
    id: string
    firstName?: string
    lastName?: string
    emailAddress?: string
    imageUrl?: string
    lastSignIn?: string
    notes?: string
  } | null>(null)

  const memberId = params?.id as string
  const isSelf = memberId === currentUserId

  useEffect(() => {
    // In a real implementation, you would fetch the member data from your backend/Clerk
    // This is just mocked for demonstration purposes
    const fetchMemberData = async () => {
      try {
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000))

        // For demo, use the current user data if viewing self
        if (isSelf && user) {
          setMemberData({
            id: user.id,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            emailAddress: user.primaryEmailAddress?.emailAddress,
            imageUrl: user.imageUrl,
            lastSignIn: new Date().toISOString(),
            notes: ''
          })
          // In a real app, we would get the exact role from Clerk API
          // For demo purposes, simulate fetching the user's actual role
          // We'll randomly assign one for demonstration
          const userRoles = organizationRoles.map(r => r.value)
          const randomRole =
            userRoles[Math.floor(Math.random() * userRoles.length)]
          setMemberRole(randomRole)

          // Set status (most users are active)
          setMemberStatus(Math.random() < 0.9 ? 'active' : 'inactive')
        } else {
          // Mock data for other users
          setMemberData({
            id: memberId,
            firstName: 'Team',
            lastName: 'Member',
            emailAddress: 'member@example.com',
            lastSignIn: new Date().toISOString(),
            notes: ''
          })
          // For demo purposes, simulate fetching another user's role
          // Let's pick a different role than the current user
          const userRoles = organizationRoles.map(r => r.value)
          // Pick a random role that's likely different from current user's role
          const randomRole =
            userRoles[Math.floor(Math.random() * userRoles.length)]
          setMemberRole(randomRole)

          // Set status (most users are active, but some might be inactive)
          setMemberStatus(Math.random() < 0.8 ? 'active' : 'inactive')
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching member data:', error)
        toast.error('Failed to load member data')
        setLoading(false)
      }
    }

    fetchMemberData()
  }, [memberId, isSelf, user])

  const handleUpdateMember = async () => {
    if (!memberData) return

    setSaving(true)
    try {
      // In a real implementation, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Just a mock success for now
      toast.success('Member updated successfully')
    } catch (error) {
      console.error('Error updating member:', error)
      toast.error('Failed to update member')
    } finally {
      setSaving(false)
    }
  }

  const handleBackToTeam = () => {
    router.push('/admin/settings/team')
  }

  if (loading) {
    return (
      <div className='flex h-[50vh] w-full items-center justify-center'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (!memberData) {
    return (
      <div className='container p-8'>
        <div className='mx-auto max-w-4xl'>
          <AdminPageHeader
            title='Member Not Found'
            description="The team member you're looking for doesn't exist or you don't have permission to view them."
          />

          <Button variant='outline' onClick={handleBackToTeam} className='mt-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Team
          </Button>
        </div>
      </div>
    )
  }

  const fullName =
    [memberData.firstName, memberData.lastName].filter(Boolean).join(' ') ||
    'Team Member'

  return (
    <div className='container p-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6 flex items-center space-x-2'>
          <Button variant='outline' size='icon' onClick={handleBackToTeam}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <AdminPageHeader
            title={`${fullName}'s Settings`}
            description="View and manage this team member's details"
          />
        </div>

        <div className='grid gap-6 md:grid-cols-5'>
          {/* Member Profile Card */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Member information</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col items-center space-y-4'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src={memberData.imageUrl} alt={fullName} />
                <AvatarFallback className='text-xl'>
                  {memberData.firstName?.[0]}
                  {memberData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className='mt-2 text-center'>
                <h3 className='text-xl font-medium'>{fullName}</h3>
                <p className='text-muted-foreground'>
                  {memberData.emailAddress}
                </p>
              </div>

              <div className='w-full space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>ID</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(memberData.id)
                      toast.success('User ID copied to clipboard')
                    }}
                    className='bg-muted hover:bg-muted/80 active:bg-muted/90 group flex transform cursor-pointer items-center space-x-1 rounded px-2 py-1 transition-all duration-200 ease-in-out active:scale-95'
                  >
                    <code className='group-hover:text-primary font-mono text-xs font-thin transition-colors'>
                      {memberData.id}
                    </code>
                  </button>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>Status</span>
                  <div className='flex items-center'>
                    <div
                      className={`mr-2 h-2 w-2 rounded-full ${memberStatus === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className='text-sm font-medium'>
                      {memberStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Last Sign In
                  </span>
                  <span className='text-sm'>
                    {memberData.lastSignIn
                      ? new Date(memberData.lastSignIn).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Settings Card */}
          <Card className='md:col-span-3'>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage team member access</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='role'>Role</Label>
                <Protect
                  permission='org:team_settings:edit'
                  fallback={
                    <div className='text-muted-foreground rounded-md border px-4 py-3 text-sm'>
                      <p>{memberRole}</p>
                      <p className='mt-1 text-xs'>
                        Requires Super Admin permission to change
                      </p>
                    </div>
                  }
                >
                  <Select value={memberRole} onValueChange={setMemberRole}>
                    <SelectTrigger id='role'>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationRoles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isSelf && (
                    <p className='text-muted-foreground text-sm'>
                      You cannot change your own role.
                    </p>
                  )}
                </Protect>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Protect
                  permission='org:team_settings:edit'
                  fallback={
                    <div className='text-muted-foreground rounded-md border px-4 py-3 text-sm'>
                      <div className='flex items-center'>
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${memberStatus === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}
                        />
                        <span>
                          {memberStatus === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className='mt-1 text-xs'>
                        Requires Super Admin permission to change
                      </p>
                    </div>
                  }
                >
                  <Select
                    value={memberStatus}
                    onValueChange={value =>
                      setMemberStatus(value as 'active' | 'inactive')
                    }
                  >
                    <SelectTrigger id='status'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>
                        <div className='flex items-center'>
                          <div className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value='inactive'>
                        <div className='flex items-center'>
                          <div className='mr-2 h-2 w-2 rounded-full bg-gray-300' />
                          Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {isSelf && (
                    <p className='text-muted-foreground text-sm'>
                      You cannot deactivate your own account.
                    </p>
                  )}
                </Protect>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='notes'>Notes</Label>
                <Textarea
                  id='notes'
                  placeholder='Private notes about this team member'
                  value={memberData.notes || ''}
                  onChange={e =>
                    setMemberData({ ...memberData, notes: e.target.value })
                  }
                />
              </div>

              <div className='flex justify-end space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleBackToTeam}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateMember} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
