// components/pages/marketing/landing/benefits-section.tsx

import {
  ArrowRight,
  Clock,
  Code,
  Repeat,
  Rocket,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
  {
    icon: (
      <Clock className='text-primary mb-4 h-10 w-10' />
    ),
    title: 'Save Weeks of Development',
    description:
      "Don't reinvent the wheel. Start with a foundation that would take weeks to build from scratch."
  },
  {
    icon: (
      <Code className='text-primary mb-4 h-10 w-10' />
    ),
    title: 'Best Practices Built In',
    description:
      'Built with modern best practices for performance, security, and developer experience.'
  },
  {
    icon: (
      <Rocket className='text-primary mb-4 h-10 w-10' />
    ),
    title: 'Launch Faster',
    description:
      'Focus on your unique features and go to market faster with the essentials already in place.'
  },
  {
    icon: (
      <Repeat className='text-primary mb-4 h-10 w-10' />
    ),
    title: 'Reusable for Every Project',
    description:
      'One purchase, unlimited projects. Use VibeKit as your starting point for all your SaaS ideas.'
  },
  {
    icon: (
      <Zap className='text-primary mb-4 h-10 w-10' />
    ),
    title: 'Perfect for Vibe Coding',
    description:
      'Optimized for AI-assisted development with clean architecture and well-documented code.'
  }
]

export const BenefitsSection = () => {
  return (
    <section
      id='benefits'
      className='dark:from-background dark:to-primary/10 py-20 dark:bg-gradient-to-b'
    >
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Why Vibe Coders{' '}
            <span className='from-primary dark:from-primary dark:to-primary/60 bg-gradient-to-r to-green-300 bg-clip-text text-transparent'>
              Love VibeKits
            </span>
          </h2>
          <p className='text-muted-foreground text-lg'>
            Built specifically for
            developers who want to
            leverage AI and modern tools
            to build SaaS products
            faster.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {benefits
            .slice(0, 3)
            .map((benefit, index) => (
              <div
                key={index}
                className='hover:border-primary hover:bg-primary/5 dark:hover:border-primary/40 rounded-lg border p-6 transition-all dark:border-gray-800 dark:bg-gray-900/50'
              >
                {benefit.icon}
                <h3 className='mb-2 text-xl font-semibold'>
                  {benefit.title}
                </h3>
                <p className='text-muted-foreground'>
                  {benefit.description}
                </p>
              </div>
            ))}
        </div>

        <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2'>
          {benefits
            .slice(3)
            .map((benefit, index) => (
              <div
                key={index}
                className='hover:border-primary hover:bg-primary/5 dark:hover:border-primary/40 rounded-lg border p-6 transition-all dark:border-gray-800 dark:bg-gray-900/50'
              >
                {benefit.icon}
                <h3 className='mb-2 text-xl font-semibold'>
                  {benefit.title}
                </h3>
                <p className='text-muted-foreground'>
                  {benefit.description}
                </p>
              </div>
            ))}
        </div>

        <div className='mx-auto mt-16 max-w-xl text-center'>
          <h3 className='mb-4 text-2xl font-bold'>
            Ready to supercharge your
            next project?
          </h3>
          <Button className='group h-auto rounded-xl px-6 py-6 text-base'>
            Get VibeKits Today
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Button>
        </div>
      </div>
    </section>
  )
}
