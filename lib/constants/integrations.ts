// lib/constants/integrations.ts

export enum INTEGRATION_CATEGORY_ID {
  SALES_MARKETING = 'sales_marketing',
  COMMUNICATION_COLLABORATION = 'communication_collaboration',
  PRODUCTIVITY = 'productivity',
  ANALYTICS = 'analytics',
  AI = 'ai',
  CUSTOMER_SUPPORT = 'customer_support'
}

export interface IntegrationCategoryDefinition {
  id: INTEGRATION_CATEGORY_ID
  title: string
  description: string
}

export const INTEGRATION_CATEGORIES: Record<
  INTEGRATION_CATEGORY_ID,
  IntegrationCategoryDefinition
> = {
  [INTEGRATION_CATEGORY_ID.SALES_MARKETING]: {
    id: INTEGRATION_CATEGORY_ID.SALES_MARKETING,
    title: 'Sales & Marketing Tools',
    description:
      'Enhancing the efficiency and effectiveness of your sales and marketing activities'
  },
  [INTEGRATION_CATEGORY_ID.COMMUNICATION_COLLABORATION]: {
    id: INTEGRATION_CATEGORY_ID.COMMUNICATION_COLLABORATION,
    title: 'Communication & Collaboration',
    description:
      'Enhancing the efficiency and effectiveness of team interactions and workflows'
  },
  [INTEGRATION_CATEGORY_ID.PRODUCTIVITY]: {
    id: INTEGRATION_CATEGORY_ID.PRODUCTIVITY,
    title: 'Productivity Tools',
    description: "Boost your team's productivity with seamless integrations"
  },
  [INTEGRATION_CATEGORY_ID.ANALYTICS]: {
    id: INTEGRATION_CATEGORY_ID.ANALYTICS,
    title: 'Analytics & Reporting',
    description: 'Gain insights and make data-driven decisions'
  },
  [INTEGRATION_CATEGORY_ID.CUSTOMER_SUPPORT]: {
    id: INTEGRATION_CATEGORY_ID.CUSTOMER_SUPPORT,
    title: 'Customer Support',
    description: 'Provide exceptional customer service with these integrations'
  },
  [INTEGRATION_CATEGORY_ID.AI]: {
    id: INTEGRATION_CATEGORY_ID.AI,
    title: 'AI & Automation',
    description: 'Integrate AI and automation tools to improve efficiency'
  }
}

// Sample integration data for development - will be replaced by database
export const sampleIntegrationCategories = [
  {
    ...INTEGRATION_CATEGORIES[INTEGRATION_CATEGORY_ID.SALES_MARKETING],
    integrations: [
      {
        id: 'hubspot',
        name: 'HubSpot',
        description:
          'Offers tools for lead generation, email marketing, and customer service.',
        icon: '/images/integrations/hubspot.svg',
        connected: true
      }
    ]
  },
  {
    ...INTEGRATION_CATEGORIES[
      INTEGRATION_CATEGORY_ID.COMMUNICATION_COLLABORATION
    ],
    integrations: [
      {
        id: 'slack',
        name: 'Slack',
        description:
          'Enables real-time collaboration and updates on CRM activities',
        icon: '/images/integrations/slack.svg',
        connected: true
      }
    ]
  },
  {
    ...INTEGRATION_CATEGORIES[INTEGRATION_CATEGORY_ID.PRODUCTIVITY],
    integrations: [
      {
        id: 'trello',
        name: 'Trello',
        description: 'Helps manage tasks and projects with visual boards',
        icon: '/images/integrations/trello.svg',
        connected: true
      }
    ]
  },
  {
    ...INTEGRATION_CATEGORIES[INTEGRATION_CATEGORY_ID.ANALYTICS],
    integrations: [
      {
        id: 'google-analytics',
        name: 'Google Analytics',
        description: 'Tracks website traffic and user behavior',
        icon: '/images/integrations/google.svg',
        connected: true
      }
    ]
  },
  {
    ...INTEGRATION_CATEGORIES[INTEGRATION_CATEGORY_ID.CUSTOMER_SUPPORT],
    integrations: [
      {
        id: 'zendesk',
        name: 'Zendesk',
        description: 'Tracks and manages customer support activities',
        icon: '/images/integrations/zendesk.svg',
        connected: true
      }
    ]
  },
  {
    ...INTEGRATION_CATEGORIES[INTEGRATION_CATEGORY_ID.AI],
    integrations: [
      {
        id: 'chatbot',
        name: 'Chatbot',
        description: 'Integrates AI-powered chatbots for customer support',
        icon: '/images/integrations/chatbot.svg',
        connected: true
      }
    ]
  }
]
