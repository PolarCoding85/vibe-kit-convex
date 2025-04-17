// types/integrations.ts

import { INTEGRATION_CATEGORY_ID } from '@/lib/constants/integrations'

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
}

export interface IntegrationCategory {
  id: INTEGRATION_CATEGORY_ID
  title: string
  description: string
  integrations: Integration[]
}
