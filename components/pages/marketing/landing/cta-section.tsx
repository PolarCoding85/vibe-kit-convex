// components/pages/marketing/landing/cta-section.tsx

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const CTASection = () => {
  return (
    <section className='relative overflow-hidden py-20'>
      <div className='from-primary/10 to-background absolute inset-0 z-0 bg-gradient-to-b'></div>

      <div className='relative z-10 container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mb-6 text-3xl leading-tight font-bold md:text-5xl'>
            Start Building Your{' '}
            <span className='from-primary dark:from-primary dark:to-primary/60 bg-gradient-to-r to-green-300 bg-clip-text text-transparent'>
              Next SaaS
            </span>{' '}
            Today
          </h2>

          <p className='mx-auto mb-8 max-w-2xl text-xl text-gray-400'>
            Join hundreds of developers who are shipping faster with VibeKits.
            Your complete SaaS foundation is just one click away.
          </p>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button className='bg-primary hover:bg-primary/90 group h-12 rounded-xl px-6 text-base'>
              Get VibeKit Now
              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Button>
            <Button
              variant='outline'
              className='h-12 rounded-xl px-6 text-base'
            >
              Learn More
            </Button>
          </div>

          <div className='mx-auto mt-12 max-w-md rounded-lg border border-gray-800 bg-gray-900/50 p-6'>
            <p className='text-sm text-gray-400'>
              &quot;VibeKit saved me weeks of setup time and helped me launch my
              SaaS in record time. The code quality and structure made it a
              dream to customize.&quot;
            </p>
            <div className='mt-4'>
              <p className='font-medium'>Alex Chen</p>
              <p className='text-sm text-gray-500'>Founder, DevFlow</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
