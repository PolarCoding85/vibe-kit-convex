// components/layout/admin/admin-page-header.tsx

import React from 'react'

interface AdminPageHeaderProps {
  title: string
  description?: string
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col space-y-1.5 mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
