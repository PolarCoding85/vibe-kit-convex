// components/pages/admin/settings/organization/organization-details-form.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, ControllerRenderProps } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { Check, Loader2, Upload } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(3, 'Organization name must be at least 3 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  description: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

interface OrganizationDetailsFormProps {
  organizationName: string
  organizationSlug: string
  organizationImageUrl: string
  organizationId: string
  createdAt: number
  updatedAt: number
  creatorEmail: string
}

export function OrganizationDetailsForm({
  organizationName,
  organizationSlug,
  organizationImageUrl,
  organizationId,
  createdAt,
  updatedAt,
  creatorEmail
}: OrganizationDetailsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with current values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: organizationName,
      slug: organizationSlug,
      description: '' // Defaulting to empty as we don't have description in our props
    }
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // In a real implementation, we would call a server action or API to update the organization
      // For now we'll simulate a successful update
      console.log('Updating organization with data:', data)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Organization details updated', {
        description:
          'Your organization details have been successfully updated.',
        icon: <Check className='h-4 w-4' />
      })

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error updating organization:', error)
      toast.error('Failed to update organization', {
        description:
          'There was an error updating your organization details. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>
          Update your organization's profile information
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='space-y-8'>
            {/* Organization Image */}
            <div className='flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6'>
              <div className='relative'>
                <Avatar className='border-border h-24 w-24 border-2'>
                  <AvatarImage
                    src={organizationImageUrl}
                    alt={organizationName}
                  />
                  <AvatarFallback className='text-xl font-semibold'>
                    {organizationName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className='text-center sm:text-left'>
                <h3 className='font-medium'>Organization Logo</h3>
                <p className='text-muted-foreground text-sm'>
                  Upload your organization logo or avatar
                </p>
                <div className='mt-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='text-xs'
                    onClick={() => {
                      // In a real implementation, this would trigger a file upload dialog
                      alert(
                        'This would open an image upload dialog in a real implementation'
                      )
                    }}
                  >
                    <Upload className='mr-2 h-3 w-3' /> Upload Image
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className='grid gap-6 md:grid-cols-2'>
              {/* Read-only Organization ID */}
              <div>
                <label className='text-sm font-medium'>Organization ID</label>
                <div className='border-input bg-muted/50 text-muted-foreground mt-1 rounded-md border px-3 py-2 text-sm'>
                  {organizationId}
                </div>
              </div>

              {/* Read-only Created By */}
              <div>
                <label className='text-sm font-medium'>Owner Email</label>
                <div className='border-input bg-muted/50 text-muted-foreground mt-1 rounded-md border px-3 py-2 text-sm'>
                  {creatorEmail}
                </div>
              </div>

              {/* Read-only Created Date */}
              <div>
                <label className='text-sm font-medium'>Created Date</label>
                <div className='border-input bg-muted/50 text-muted-foreground mt-1 rounded-md border px-3 py-2 text-sm'>
                  {format(new Date(createdAt), 'PPP')}
                </div>
              </div>

              {/* Read-only Last Updated */}
              <div>
                <label className='text-sm font-medium'>Last Updated</label>
                <div className='border-input bg-muted/50 text-muted-foreground mt-1 rounded-md border px-3 py-2 text-sm'>
                  {format(new Date(updatedAt), 'PPP')}
                </div>
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({
                  field
                }: {
                  field: ControllerRenderProps<FormValues, 'name'>
                }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Acme Inc.' {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your organization as it will appear
                      everywhere.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({
                  field
                }: {
                  field: ControllerRenderProps<FormValues, 'slug'>
                }) => (
                  <FormItem>
                    <FormLabel>Organization Slug</FormLabel>
                    <FormControl>
                      <Input placeholder='acme' {...field} />
                    </FormControl>
                    <FormDescription>
                      Used in URLs and API requests. Lowercase letters, numbers
                      and hyphens only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({
                field
              }: {
                field: ControllerRenderProps<FormValues, 'description'>
              }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell us about your organization...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of your organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className='flex justify-end space-x-4'>
            <Button
              variant='outline'
              type='button'
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
