// components/pages/marketing/changelog/changelog-section.tsx

import { GitMerge, Twitter } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'

export const ChangeLog = () => {
  const releases = [
    {
      version: 'v1.5.0',
      date: 'April 8, 2024',
      title: 'VibeKits Pro (Beta)',
      description: 'VibeKits Pro (Beta)',
      image: '/images/rocket-bg.jpeg',
      changes: [
        'VibeKits Pro is now available in beta!',
        'VibeKits Pro takes 1x user prompt credits on every message and 1x flow action credits on each tool call',
        'Enhanced UI with better dark mode support',
        'Real-time collaboration features added'
      ]
    },
    {
      version: 'v1.4.0',
      date: 'March 15, 2024',
      title: 'Integration Update',
      description: 'New API integrations and developer tools',
      changes: [
        'Added Slack integration',
        'New developer documentation',
        'Improved error handling',
        'Enhanced security features'
      ]
    },
    {
      version: 'v1.3.0',
      date: 'January 22, 2024',
      title: 'UI Enhancement',
      description: 'Major UI improvements and bug fixes',
      changes: [
        'Redesigned navigation system',
        'Added dark mode support',
        'Fixed authentication edge cases',
        'Improved accessibility across all components'
      ]
    },
    {
      version: 'v1.2.0',
      date: 'October 12, 2023',
      title: 'Feature Update',
      description: 'Added new features and improved performance',
      changes: [
        'Added custom theming options',
        'Improved dashboard performance',
        'New data visualization components',
        'Enhanced mobile responsiveness'
      ]
    },
    {
      version: 'v1.1.0',
      date: 'August 3, 2023',
      title: 'Initial Release',
      description: 'First public release of VibeKit',
      changes: [
        'Core functionality implemented',
        'Basic UI components added',
        'Dashboard with analytics overview',
        'User authentication system'
      ]
    }
  ]

  return (
    <section className='flex flex-col'>
      <div className='flex-grow pt-24 pb-16'>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-4xl'>
            <h1 className='mb-6 text-center text-5xl font-bold'>
              VibeKits Changelogs
            </h1>

            <div className='text-vibe mb-10 flex items-center justify-center gap-4'>
              <Link
                href='/docs'
                className='flex items-center gap-1 hover:underline'
              >
                View Docs
              </Link>
              <span className='text-gray-500'>•</span>
              <a href='#' className='flex items-center gap-1 hover:underline'>
                Follow us on <Twitter className='h-4 w-4' />
              </a>
            </div>

            <div className='hover:text-vibe mb-12 flex items-center gap-2 text-gray-400 transition-colors'>
              <span>VibeKits Next Changelogs</span>
              <GitMerge className='h-4 w-4' />
            </div>

            <div className='space-y-16'>
              {releases.map((release, index) => (
                <div key={index} className='space-y-6'>
                  <div className='flex items-start gap-6'>
                    <div className='flex flex-col items-start'>
                      <span className='mb-2 rounded-md bg-gray-800 px-3 py-1 text-sm text-white'>
                        {release.version}
                      </span>
                      <span className='text-sm text-gray-400'>
                        {release.date}
                      </span>
                    </div>

                    <div className='flex-1 space-y-6'>
                      <h2 className='text-2xl font-bold'>{release.title}</h2>

                      {release.image && (
                        <div className='overflow-hidden rounded-lg border border-gray-800'>
                          <Image
                            width={500}
                            height={300}
                            src={release.image}
                            alt={release.title}
                            className='w-full object-cover'
                          />
                        </div>
                      )}

                      <h3 className='text-xl font-semibold'>
                        {release.description}
                      </h3>

                      <ul className='space-y-2'>
                        {release.changes.map((change, idx) => (
                          <li key={idx} className='flex items-start gap-2'>
                            <span className='bg-vibe mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full' />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {index < releases.length - 1 && (
                    <Separator className='bg-gray-800/60' />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
