// components/pages/marketing/landing/feature-section.tsx

import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  CreditCard,
  UserCheck,
  Database,
  Sparkles,
  Shield,
  Zap,
  Mail,
  CheckCircle,
  PackageOpen
} from 'lucide-react'

const features = [
  {
    icon: (
      <LayoutDashboard className='text-primary h-6 w-6' />
    ),
    title: 'Complete Dashboard',
    description:
      'Fully functional dashboard with analytics, settings, and user management.',
    badge: 'Core'
  },
  {
    icon: (
      <UserCheck className='text-primary h-6 w-6' />
    ),
    title: 'Authentication',
    description:
      'Secure authentication with Clerk including social logins, MFA, and more.',
    badge: 'Auth'
  },
  {
    icon: (
      <CreditCard className='text-primary h-6 w-6' />
    ),
    title: 'Subscription Payments',
    description:
      'Ready-to-go Stripe integration with subscription plans and checkout.',
    badge: 'Payments'
  },
  {
    icon: (
      <Database className='text-primary h-6 w-6' />
    ),
    title: 'Convex Database',
    description:
      'Real-time database with automatic syncing and offline capabilities.',
    badge: 'Database'
  },
  {
    icon: (
      <Mail className='text-primary h-6 w-6' />
    ),
    title: 'Email Integration',
    description:
      "Easily send transactional emails using Resend's powerful email API.",
    badge: 'Email'
  },
  {
    icon: (
      <Sparkles className='text-primary h-6 w-6' />
    ),
    title: 'Ready for AI',
    description:
      'Set up for AI integrations with API routes and example implementations.',
    badge: 'AI'
  },
  {
    icon: (
      <Shield className='text-primary h-6 w-6' />
    ),
    title: 'Type Safety',
    description:
      'End-to-end type safety with TypeScript and Zod form validations.',
    badge: 'DX'
  },
  {
    icon: (
      <Zap className='text-primary h-6 w-6' />
    ),
    title: 'Performance Optimized',
    description:
      'Optimized for Core Web Vitals with best practices for SEO and loading speed.',
    badge: 'Performance'
  }
]

export const FeaturesSection = () => {
  return (
    <section
      id='features'
      className='relative overflow-hidden py-20'
    >
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <Badge
            variant='outline'
            className='border-primary/40 text-primary mb-3'
          >
            Everything You Need
          </Badge>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Complete SaaS foundation
            with{' '}
            <span className='from-primary dark:from-primary dark:to-primary/60 bg-gradient-to-r to-green-300 bg-clip-text text-transparent'>
              all the features
            </span>{' '}
            you need
          </h2>
          <p className='text-muted-foreground text-lg'>
            Stop wasting time setting up
            boilerplate. Get a
            ready-to-go SaaS foundation
            with all the essential
            features built in.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
          {features.map(
            (feature, index) => (
              <div
                key={index}
                className='dark:hover:border-primary/50 bg-primary/5 hover:border-primary group rounded-lg border p-6 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:bg-gray-900/60'
              >
                <div className='bg-primary/10 group-hover:bg-primary/20 mb-5 flex h-12 w-12 items-center justify-center rounded-lg transition-colors'>
                  {feature.icon}
                </div>

                <div className='mb-2 flex items-center gap-2'>
                  <h3 className='text-xl font-semibold'>
                    {feature.title}
                  </h3>
                  <Badge
                    variant='secondary'
                    className='ml-auto bg-gray-800 text-xs text-white dark:text-gray-300'
                  >
                    {feature.badge}
                  </Badge>
                </div>

                <p className='text-muted-foreground'>
                  {feature.description}
                </p>
              </div>
            )
          )}
        </div>

        <div className='bg-primary/5 hover:border-primary dark:hover:border-primary/50 mx-auto mt-16 max-w-4xl rounded-lg border p-8 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:bg-gray-900/60'>
          <h3 className='mb-4 flex items-center text-xl font-semibold'>
            <PackageOpen className='text-primary mr-2 h-5 w-5' />
            What else is included
          </h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
            {[
              'Email templates',
              'Dark mode',
              'Marketing pages',
              'SEO optimization',
              'Mobile responsive',
              'Form validation',
              'API routes',
              'Error handling',
              'Rate limiting',
              'Analytics',
              'Webhooks',
              'Logging'
            ].map((item, i) => (
              <div
                key={i}
                className='flex items-center'
              >
                <CheckCircle className='text-primary mr-2 h-4 w-4 shrink-0' />
                <span className='text-muted-foreground dark:text-gray-300'>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
