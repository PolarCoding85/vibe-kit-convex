'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { INTEGRATION_CATEGORIES, INTEGRATION_CATEGORY_ID } from '@/lib/constants/integrations'

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Integration name must be at least 2 characters.'
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  }),
  categoryId: z.nativeEnum(INTEGRATION_CATEGORY_ID, {
    message: 'Please select a valid category.'
  }),
  apiKey: z.string().optional(),
  apiUrl: z.string().url({
    message: 'Please enter a valid URL.'
  }).optional().or(z.literal(''))
})

// Typescript type for our form values
type FormValues = z.infer<typeof formSchema>

// Default form values
const defaultValues: Partial<FormValues> = {
  name: '',
  description: '',
  apiKey: '',
  apiUrl: ''
}

interface AddIntegrationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onIntegrationAdded?: () => void
}

export function AddIntegrationForm({ 
  open, 
  onOpenChange, 
  onIntegrationAdded 
}: AddIntegrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange'
  })

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    
    try {
      // In a real app, this would be an API call to save the new integration
      console.log('Integration form values:', values)
      
      // Success toast notification
      toast.success('Integration added successfully')
      
      // Reset form and close dialog
      form.reset(defaultValues)
      onOpenChange(false)
      
      // Callback for parent component
      if (onIntegrationAdded) {
        onIntegrationAdded()
      }
    } catch (error) {
      console.error('Error adding integration:', error)
      toast.error('Failed to add integration')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Integration</DialogTitle>
          <DialogDescription>
            Connect a new tool or service to enhance your workflow.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Slack, HubSpot" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the service you want to integrate with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(INTEGRATION_CATEGORIES).map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id}
                        >
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category that best fits this integration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this integration does and how it will be used..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key (Optional)</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    The API key for authentication with this service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The endpoint URL for this integration, if required.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Integration'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
