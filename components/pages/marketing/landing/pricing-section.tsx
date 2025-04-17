// components/pages/marketing/landing/pricing-section.tsx

import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '$79',
    description: 'Perfect for your first SaaS project',
    features: [
      'Complete SaaS Starter Kit',
      'Clerk Authentication',
      'Stripe Integration',
      'Convex Database',
      'Single Project License',
      '6 Months Support',
      'Private GitHub Access',
      'Regular Updates'
    ],
    highlighted: false,
    buttonText: 'Get Started'
  },
  {
    name: 'Pro',
    price: '$149',
    description: 'For serious SaaS builders',
    features: [
      'Everything in Starter',
      'Unlimited Projects',
      'Premium Components',
      'Advanced Analytics',
      'AI Integration Examples',
      'Email Marketing Setup',
      '1 Year Priority Support',
      'Private Discord Access'
    ],
    highlighted: true,
    buttonText: 'Get Pro'
  },
  {
    name: 'Agency',
    price: '$299',
    description: 'Build for multiple clients',
    features: [
      'Everything in Pro',
      'Client-Ready License',
      'White-Label Option',
      'Team Collaboration Tools',
      'Custom Branding',
      'Lifetime Updates',
      'Premium Support',
      '1-hour Consultation Call'
    ],
    highlighted: false,
    buttonText: 'Contact Us'
  }
]

export const PricingSection = () => {
  return (
    <section id='pricing' className='relative overflow-hidden py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Simple,{' '}
            <span className='from-primary dark:from-primary dark:to-primary/60 bg-gradient-to-r to-green-300 bg-clip-text text-transparent'>
              Transparent Pricing
            </span>
          </h2>
          <p className='text-muted-foreground text-lg'>
            Choose the plan that fits your needs. One-time payment, no
            subscriptions.
          </p>
        </div>

        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3'>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-lg border ${
                plan.highlighted
                  ? 'border-primary/50 from-primary/20 relative bg-gradient-to-b to-transparent'
                  : 'border-gray-800 bg-gray-900/30'
              }`}
            >
              {plan.highlighted && (
                <div className='bg-primary absolute top-0 left-1/2 -translate-x-1/2 transform rounded-b-md px-3 py-1 text-xs font-medium text-white'>
                  Most Popular
                </div>
              )}

              <div className='p-6'>
                <h3 className='mb-2 text-xl font-semibold'>{plan.name}</h3>
                <div className='mb-4'>
                  <span className='text-3xl font-bold'>{plan.price}</span>
                  <span className='ml-1 text-gray-400'>one-time</span>
                </div>
                <p className='mb-6 text-gray-400'>{plan.description}</p>

                <Button
                  className={`w-full rounded-xl ${
                    plan.highlighted
                      ? 'bg-primary hover:bg-primary/90 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>

              <div className='border-t border-gray-800 p-6'>
                <p className='mb-4 font-medium'>What&apos;s included:</p>
                <ul className='space-y-3'>
                  {plan.features.map((feature, i) => (
                    <li key={i} className='flex items-start'>
                      <CheckCircle className='text-primary mt-0.5 mr-3 h-5 w-5 shrink-0' />
                      <span className='text-gray-300'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className='mx-auto mt-16 max-w-2xl rounded-lg border border-gray-800 bg-gray-900/30 p-6 text-center'>
          <h3 className='mb-2 text-xl font-semibold'>Need something custom?</h3>
          <p className='mb-4 text-gray-400'>
            We offer custom development and integration services for teams with
            specific requirements.
          </p>
          <Button variant='outline' className='rounded-xl' asChild>
            <Link href='/contact'>Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
