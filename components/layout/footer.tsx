// components/layout/footer.tsx

import {
  Github,
  Facebook,
  HeartHandshakeIcon
} from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className='bg-dark-200 border-t border-gray-800'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div className='col-span-1 md:col-span-2'>
            <div className='mb-4 flex items-center gap-2'>
              <div className='from-background animate-pulse-slow flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br to-green-400'>
                <HeartHandshakeIcon className='h-6 w-6' />
              </div>
              <span className='text-xl font-bold'>
                VibeKits
              </span>
            </div>
            <p className='mb-4 text-gray-400'>
              The ultimate starter kit
              for building your next
              SaaS product with modern
              technologies and best
              practices.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='#'
                className='text-gray-400 transition-colors hover:text-white'
              >
                <Github className='h-5 w-5' />
              </Link>
              <Link
                href='#'
                className='text-gray-400 transition-colors hover:text-white'
              >
                <Facebook className='h-5 w-5' />
              </Link>
            </div>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>
              Product
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#features'
                  className='text-gray-400 transition-colors hover:text-white'
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='#pricing'
                  className='text-gray-400 transition-colors hover:text-white'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition-colors hover:text-white'
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition-colors hover:text-white'
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>
              Company
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition-colors hover:text-white'
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition-colors hover:text-white'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row'>
          <p className='mb-4 text-sm text-gray-500 md:mb-0'>
            ©{' '}
            {new Date().getFullYear()}{' '}
            VibeKits.dev. All rights
            reserved.
            <span className='ml-2'>
              Built by{' '}
              <Link
                href='https://craftrhub.com'
                target='_blank'
                rel='noopener noreferrer'
                className='underline transition-colors hover:text-white'
              >
                craftrHUB
              </Link>
            </span>
          </p>
          <div className='flex space-x-6'>
            <Link
              href='#'
              className='text-sm text-gray-500 transition-colors hover:text-white'
            >
              Privacy Policy
            </Link>
            <Link
              href='#'
              className='text-sm text-gray-500 transition-colors hover:text-white'
            >
              Terms of Service
            </Link>
            <Link
              href='#'
              className='text-sm text-gray-500 transition-colors hover:text-white'
            >
              License
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
