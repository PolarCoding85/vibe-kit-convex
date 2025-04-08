// app/(auth)/layout.tsx

import { HeartHandshake } from 'lucide-react'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden p-4'>
      {/* Gradient Glows */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div
          className='bg-primary/15 absolute top-0 left-1/2 aspect-square w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]'
          aria-hidden='true'
        />
      </div>
      <div className='relative'>
        {/* Content */}
        {/* Logo */}
        <div className='mb-8 flex items-center justify-center gap-2'>
          <HeartHandshake className='text-primary h-8 w-8' />
          <span className='text-2xl font-bold'>VibeKits</span>
        </div>

        {/* Page Content */}
        {children}

        {/* Custom Footer Links Below Clerk Component */}
        <div className='mt-8 text-center'>
          <p className='mb-2 text-xs text-gray-500'>
            Copyright © 2025 VibeKits, LLC. VibeKits™ is a trademark of
            VibeKits, LLC.
          </p>
          <div className='flex justify-center space-x-4'>
            <a
              href='/terms'
              className='text-xs text-gray-500 hover:text-gray-700'
            >
              Terms of Service
            </a>
            <span className='text-xs text-gray-400'>|</span>
            <a
              href='/privacy'
              className='text-xs text-gray-500 hover:text-gray-700'
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
