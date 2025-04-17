// app/(admin)/admin/settings/integrations/page.tsx

'use client'

import { ChevronsUpDown, Plus, Search, X } from 'lucide-react'
import { useState, useCallback } from 'react'

import {
  sampleIntegrationCategories,
  INTEGRATION_CATEGORIES,
  INTEGRATION_CATEGORY_ID
} from '@/lib/constants/integrations'
import { IntegrationCategory } from '@/types/integrations'
import { AdminPageHeader } from '@/components/layout/admin/admin-page-header'
import { IntegrationCategorySection } from '@/components/pages/admin/settings/integrations/integration-category-section'
import { AddIntegrationForm } from '@/components/pages/admin/settings/integrations/add-integration-form'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export default function IntegrationsSettingsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<
    INTEGRATION_CATEGORY_ID[]
  >([])

  // Filter integrations based on active tab, search query and selected categories
  const filteredCategories = sampleIntegrationCategories
    .map((category: IntegrationCategory) => {
      // Check if category is selected in filter (or if no categories are selected)
      const categoryVisible =
        selectedCategories.length === 0 ||
        selectedCategories.includes(category.id as INTEGRATION_CATEGORY_ID)

      // If category isn't selected in filter, don't include it
      if (!categoryVisible) return { ...category, integrations: [] }

      const filteredIntegrations = category.integrations.filter(integration => {
        const matchesTab =
          activeTab === 'all' ||
          (activeTab === 'connected' && integration.connected) ||
          (activeTab === 'disconnected' && !integration.connected)

        const matchesSearch =
          integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          integration.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())

        return matchesTab && matchesSearch
      })

      return {
        ...category,
        integrations: filteredIntegrations
      }
    })
    .filter((category: IntegrationCategory) => category.integrations.length > 0)

  // Handle connection toggle
  const handleConnectionToggle = (integrationId: string) => {
    // In a real app, this would make an API call to connect/disconnect
    console.log(`Toggling connection for integration: ${integrationId}`)
  }

  // Handle new integration added
  const handleIntegrationAdded = () => {
    // In a real app, this would refresh the list of integrations from the database
    console.log('Integration added successfully')
  }

  // Handle category filter toggle
  const toggleCategoryFilter = useCallback(
    (categoryId: INTEGRATION_CATEGORY_ID) => {
      setSelectedCategories(prev => {
        if (prev.includes(categoryId)) {
          return prev.filter(id => id !== categoryId)
        } else {
          return [...prev, categoryId]
        }
      })
    },
    []
  )

  // Handle clearing all category filters
  const clearCategoryFilters = useCallback(() => {
    setSelectedCategories([])
  }, [])

  return (
    <div className='container mx-auto px-4 py-6 md:px-6 md:py-8'>
      <AdminPageHeader
        title='Integrations'
        description='Connect your favorite tools and services to enhance your workflow.'
      />

      <div className='flex flex-col space-y-6'>
        {/* Control Bar */}
        <div className='bg-card flex flex-col space-y-4 rounded-lg border p-4'>
          {/* Top row with tabs, filter, search and add button */}
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex flex-wrap items-center gap-2'>
              <Tabs
                defaultValue='all'
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-auto'
              >
                <TabsList className='grid w-auto grid-cols-3'>
                  <TabsTrigger value='all'>All Applications</TabsTrigger>
                  <TabsTrigger value='connected'>Connected</TabsTrigger>
                  <TabsTrigger value='disconnected'>Disconnected</TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex h-9 items-center gap-1'
                  >
                    Categories
                    <ChevronsUpDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                  <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.values(INTEGRATION_CATEGORIES).map(category => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategoryFilter(category.id)}
                    >
                      <span className='flex items-center'>
                        {category.title}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
                <Input
                  type='search'
                  placeholder='Search integrations...'
                  className='h-9 w-[200px] pl-8 md:w-[250px]'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                variant='default'
                size='sm'
                className='h-9 bg-green-500 text-white hover:bg-green-600'
                onClick={() => setShowAddForm(true)}
              >
                <Plus className='mr-1 h-4 w-4' /> Add Integration
              </Button>
            </div>
          </div>

          {/* Filter chips row */}
          {selectedCategories.length > 0 && (
            <div className='flex items-center gap-2 pt-1'>
              <span className='text-muted-foreground text-sm'>
                Filtering by:
              </span>
              <div className='flex flex-wrap gap-2'>
                {selectedCategories.map(categoryId => (
                  <div
                    key={categoryId}
                    className='bg-secondary text-secondary-foreground flex items-center gap-1 rounded-md px-2 py-1 text-xs'
                  >
                    {INTEGRATION_CATEGORIES[categoryId].title}
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-4 w-4 p-0'
                      onClick={() => toggleCategoryFilter(categoryId)}
                    >
                      <span className='sr-only'>Remove filter</span>
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                ))}
                <Button
                  variant='link'
                  size='sm'
                  className='h-6 p-0 text-xs'
                  onClick={clearCategoryFilters}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {filteredCategories.map((category: IntegrationCategory) => (
          <IntegrationCategorySection
            key={category.title}
            category={category}
            onToggleConnection={handleConnectionToggle}
          />
        ))}

        {/* Add Integration Form Dialog */}
        <AddIntegrationForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
          onIntegrationAdded={handleIntegrationAdded}
        />
      </div>
    </div>
  )
}
