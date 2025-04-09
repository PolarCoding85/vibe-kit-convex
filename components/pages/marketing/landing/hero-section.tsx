// components/pages/marketing/landing/hero-section.tsx

import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Code,
  Github
} from 'lucide-react'
import Link from 'next/link'

export const HeroSection = () => {
  return (
    <section className='relative overflow-hidden pt-32 pb-20'>
      {/* Background pattern */}
      <div className='bg-hero-pattern absolute inset-0 opacity-5'></div>

      {/* Gradient overlay */}
      <div className='from-background absolute right-0 bottom-0 left-0 h-1/3 bg-gradient-to-t to-transparent'></div>

      <div className='relative z-10 container mx-auto px-4'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='border-primary/30 bg-primary/10 text-primary mb-6 inline-flex items-center rounded-full border px-3 py-1'>
            <Code className='mr-2 h-4 w-4' />
            <span className='text-sm font-medium'>
              The Ultimate SaaS
              Development Kit
            </span>
          </div>

          <h1 className='mb-6 text-4xl leading-tight font-bold md:text-6xl'>
            Build your next
            <span className='from-primary dark:from-primary dark:to-primary/60 bg-gradient-to-r to-green-300 bg-clip-text text-transparent'>
              {' '}
              Vibe SaaS{' '}
            </span>
            in half the time
          </h1>

          <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
            A production-ready starter
            kit with everything you need
            to launch your SaaS fast.
            Next.js, TypeScript,
            Tailwind CSS, Clerk, Stripe,
            and more.
          </p>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button className='h-12 rounded-xl px-6 text-base'>
              Get Started
              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Button>
            <Button
              variant='outline'
              className='h-12 rounded-xl px-6 text-base'
            >
              <Github className='mr-2 h-5 w-5' />
              Star on GitHub
            </Button>
          </div>

          <div className='text-muted-foreground mt-12 flex flex-wrap justify-center gap-8 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://nextjs.org'
                className='hover:text-primary transition-colors'
              >
                Next.js 14
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://www.typescriptlang.org/'
                className='hover:text-primary transition-colors'
              >
                TypeScript
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://tailwindcss.com/'
                className='hover:text-primary transition-colors'
              >
                Tailwind CSS
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://ui.shadcn.com/'
                className='hover:text-primary transition-colors'
              >
                Shadcn UI
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://clerk.dev/'
                className='hover:text-primary transition-colors'
              >
                Clerk
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://stripe.com/'
                className='hover:text-primary transition-colors'
              >
                Stripe
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://convex.dev/'
                className='hover:text-primary transition-colors'
              >
                Convex
              </Link>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative h-3 w-3'>
                <div className='absolute -inset-[2px] animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-green-500/50'></div>
                <div className='absolute inset-0 rounded-full bg-green-500'></div>
              </div>
              <Link
                href='https://resend.com/'
                className='hover:text-primary transition-colors'
              >
                Resend
              </Link>
            </div>
          </div>
        </div>

        {/* Code preview mockup */}
        <div className='mx-auto mt-16 max-w-4xl overflow-hidden rounded-lg border border-gray-800 bg-gray-200 shadow-2xl dark:bg-gray-800'>
          <div className='flex items-center gap-2 border-b border-gray-800 p-3'>
            <div className='h-3 w-3 rounded-full bg-red-500'></div>
            <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
            <div className='h-3 w-3 rounded-full bg-green-500'></div>
            <span className='text-muted-foreground ml-2 text-xs'>
              app/dashboard/page.tsx
            </span>
          </div>
          <div className='dark:bg-background overflow-x-auto bg-gray-800 p-6 font-mono text-sm'>
            <pre className='text-gray-300'>
              <span className='text-blue-400'>
                import
              </span>{' '}
              <span className='text-yellow-300'>
                {'{ DashboardHeader }'}
              </span>{' '}
              <span className='text-blue-400'>
                from
              </span>{' '}
              <span className='text-green-300'>
                "@/components/dashboard/header"
              </span>
              ;<br />
              <span className='text-blue-400'>
                import
              </span>{' '}
              <span className='text-yellow-300'>
                {'{ DashboardShell }'}
              </span>{' '}
              <span className='text-blue-400'>
                from
              </span>{' '}
              <span className='text-green-300'>
                "@/components/dashboard/shell"
              </span>
              ;<br />
              <span className='text-blue-400'>
                import
              </span>{' '}
              <span className='text-yellow-300'>
                {'{ Card }'}
              </span>{' '}
              <span className='text-blue-400'>
                from
              </span>{' '}
              <span className='text-green-300'>
                "@/components/ui/card"
              </span>
              ;
              <br />
              <br />
              <span className='text-blue-400'>
                export default function
              </span>{' '}
              <span className='text-yellow-300'>
                DashboardPage
              </span>
              () {'{'}
              <br />
              <span className='ml-4'>
                return (
              </span>
              <br />
              <span className='ml-8'>
                <span className='text-gray-500'>
                  {'<'}
                </span>
                <span className='text-blue-300'>
                  DashboardShell
                </span>
                <span className='text-gray-500'>
                  {'>'}
                </span>
              </span>
              <br />
              <span className='ml-12'>
                <span className='text-gray-500'>
                  {'<'}
                </span>
                <span className='text-blue-300'>
                  DashboardHeader
                </span>
              </span>
              <br />
              <span className='ml-16'>
                heading
                <span className='text-gray-500'>
                  =
                </span>
                <span className='text-green-300'>
                  "Dashboard"
                </span>
              </span>
              <br />
              <span className='ml-16'>
                description
                <span className='text-gray-500'>
                  =
                </span>
                <span className='text-green-300'>
                  "Overview of your
                  account."
                </span>
              </span>
              <br />
              <span className='ml-12'>
                <span className='text-gray-500'>
                  {'/>'}
                </span>
              </span>
              <br />
              <span className='ml-12'>
                <span className='text-gray-500'>
                  {'<'}
                </span>
                <span className='text-blue-300'>
                  div
                </span>{' '}
                className
                <span className='text-gray-500'>
                  =
                </span>
                <span className='text-green-300'>
                  "grid gap-4
                  md:grid-cols-2
                  lg:grid-cols-4"
                </span>
                <span className='text-gray-500'>
                  {'>'}
                </span>
              </span>
              <br />
              <span className='ml-16'>
                <span className='text-gray-500'>
                  {'<'}
                </span>
                <span className='text-blue-300'>
                  Card
                </span>
                <span className='text-gray-500'>
                  {'>'}
                </span>
                <span className='text-primary'>
                  // Your cards and
                  dashboard content here
                </span>
                <span className='text-gray-500'>
                  {'</'}
                </span>
                <span className='text-blue-300'>
                  Card
                </span>
                <span className='text-gray-500'>
                  {'>'}
                </span>
              </span>
              <br />
              <span className='ml-12'>
                <span className='text-gray-500'>
                  {'</'}
                </span>
                <span className='text-blue-300'>
                  div
                </span>
                <span className='text-gray-500'>
                  {'>'}
                </span>
              </span>
              <br />
              <span className='ml-8'>
                <span className='text-gray-500'>
                  {'</'}
                </span>
                <span className='text-blue-300'>
                  DashboardShell
                </span>
                <span className='text-gray-500'>
                  {'>'}
                </span>
              </span>
              <br />
              <span className='ml-4'>
                );
              </span>
              <br />
              {'}'}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
