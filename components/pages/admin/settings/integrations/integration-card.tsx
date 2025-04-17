'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Integration } from '@/types/integrations'

interface IntegrationCardProps {
  integration: Integration
  onToggleConnection: (id: string) => void
}

export function IntegrationCard({ integration, onToggleConnection }: IntegrationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 flex items-center justify-center rounded">
            {/* For the MVP, we'll use a simple colored div as a placeholder */}
            <div 
              className="h-10 w-10 rounded flex items-center justify-center bg-primary/10 text-primary"
              aria-label={`${integration.name} logo`}
            >
              {integration.name.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">{integration.name}</h3>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">Details</Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
        </div>
        <Switch
          checked={integration.connected}
          onCheckedChange={() => onToggleConnection(integration.id)}
        />
      </CardFooter>
    </Card>
  )
}
