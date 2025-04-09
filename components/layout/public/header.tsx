// components/layout/public/header.tsx

'use client'

import { Button } from '@/components/ui/button'
import {
  Github,
  HeartHandshakeIcon
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  useEffect,
  useState
} from 'react'
import { ModeToggle } from '../../ui/mode-toggle'

const isLinkActive = (
  pathname: string,
  href: string,
  activeSection: string | null
): boolean => {
  if (href.startsWith('/#')) {
    return (
      pathname === '/' &&
      activeSection ===
        href.substring(2)
    ) // Check if we're in the specific section
  }
  return pathname === href
}

const useActiveSection = () => {
  const [
    activeSection,
    setActiveSection
  ] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'features',
        'benefits',
        'pricing',
        'faq'
      ]

      for (const section of sections) {
        const element =
          document.getElementById(
            section
          )
        if (element) {
          const rect =
            element.getBoundingClientRect()
          // Check if the section is in view (with some buffer for better UX)
          if (
            rect.top <= 100 &&
            rect.bottom >= 100
          ) {
            setActiveSection(section)
            return
          }
        }
      }

      setActiveSection(null)
    }

    window.addEventListener(
      'scroll',
      handleScroll
    )
    handleScroll() // Check initial position

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      )
  }, [])

  return activeSection
}

export const Header = () => {
  const pathname = usePathname()
  const activeSection =
    useActiveSection()
  return (
    <header className='bg-background/80 fixed top-0 right-0 left-0 z-50 backdrop-blur-md dark:border-b dark:border-gray-800/40'>
      <div className='container mx-auto flex items-center justify-between px-4 py-4'>
        {/* Logo */}
        <Link
          href='/'
          className='flex items-center gap-2'
        >
          <div className='from-background animate-pulse-slow flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br to-green-400 shadow-md'>
            <HeartHandshakeIcon className='h-6 w-6' />
          </div>
          <span className='text-xl font-bold'>
            VibeKits
          </span>
        </Link>

        {/* Navigation */}
        <nav className='hidden items-center gap-8 md:flex'>
          <Link
            href='/#features'
            className={`hover:text-primary transition-colors ${isLinkActive(pathname, '/#features', activeSection) ? 'text-primary font-semibold' : ''}`}
          >
            Features
          </Link>
          <Link
            href='/#benefits'
            className={`hover:text-primary transition-colors ${isLinkActive(pathname, '/#benefits', activeSection) ? 'text-primary font-semibold' : ''}`}
          >
            Benefits
          </Link>
          <Link
            href='/#pricing'
            className={`hover:text-primary transition-colors ${isLinkActive(pathname, '/#pricing', activeSection) ? 'text-primary font-semibold' : ''}`}
          >
            Pricing
          </Link>
          <Link
            href='/#faq'
            className={`hover:text-primary transition-colors ${isLinkActive(pathname, '/#faq', activeSection) ? 'text-primary font-semibold' : ''}`}
          >
            FAQ
          </Link>
          <Link
            href='/docs'
            className={`hover:text-primary transition-colors ${isLinkActive(pathname, '/docs', activeSection) ? 'text-primary font-semibold' : ''}`}
          >
            Docs
          </Link>
          <Link
            href='/changelog'
            className={`hover:text-primary transition-colors ${isLinkActive(pathname, '/changelog', activeSection) ? 'text-primary font-semibold' : ''}`}
          >
            Changelog
          </Link>
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <Button
            variant='outline'
            size='sm'
            className='hidden items-center gap-2 sm:flex'
          >
            <Github className='h-4 w-4' />
            <span>GitHub</span>
          </Button>
          <Button className='bg-primary hover:bg-primary/90'>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
