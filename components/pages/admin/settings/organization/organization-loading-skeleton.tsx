// components/pages/admin/settings/organization/organization-loading-skeleton.tsx

import React from 'react'

export function OrganizationLoadingSkeleton() {
  return (
    <div className='container p-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6 flex items-center space-x-4'>
          <div className='dark:bg-card h-20 w-20 animate-pulse rounded-full bg-gray-200'></div>
          <div className='space-y-2'>
            <div className='dark:bg-card h-6 w-40 animate-pulse rounded bg-gray-200'></div>
            <div className='dark:bg-card h-4 w-60 animate-pulse rounded bg-gray-200'></div>
          </div>
        </div>
        <div className='dark:bg-card mb-8 h-8 w-48 animate-pulse rounded-xl bg-gray-200'></div>
        <div className='dark:bg-card h-[500px] animate-pulse rounded-xl bg-gray-200'></div>
      </div>
    </div>
  )
}
