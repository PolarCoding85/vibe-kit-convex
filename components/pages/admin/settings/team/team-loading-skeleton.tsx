// components/pages/admin/settings/team/team-loading-skeleton.tsx

import React from 'react'

export function TeamLoadingSkeleton() {
  return (
    <div className='container p-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6'>
          <div className='dark:bg-card h-6 w-40 animate-pulse rounded bg-gray-200'></div>
        </div>
        <div className='dark:bg-card mb-8 h-8 w-48 animate-pulse rounded-xl bg-gray-200'></div>
        <div className='dark:bg-card h-[500px] animate-pulse rounded-xl bg-gray-200'></div>
      </div>
    </div>
  )
}
