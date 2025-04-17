'use client'

import { IntegrationCategory } from '@/types/integrations'
import { IntegrationCard } from './integration-card'

interface IntegrationCategorySectionProps {
  category: IntegrationCategory
  onToggleConnection: (id: string) => void
}

export function IntegrationCategorySection({ 
  category, 
  onToggleConnection 
}: IntegrationCategorySectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{category.title}</h2>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onToggleConnection={onToggleConnection}
          />
        ))}
      </div>
    </div>
  )
}
