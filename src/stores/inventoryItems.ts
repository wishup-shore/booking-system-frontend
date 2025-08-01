import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { InventoryItemService } from '../services/inventoryService'
import { InventoryCondition } from '../types/inventory'
import type {
  InventoryItem,
  InventoryItemWithType,
  InventoryItemCreate,
  InventoryItemUpdate,
  InventoryItemFilters,
  InventoryItemSortOptions,
  InventoryItemsSearchParams,
} from '../types/inventory'

export const useInventoryItemsStore = defineStore('inventoryItems', () => {
  // State
  const inventoryItems = ref<InventoryItemWithType[]>([])
  const currentInventoryItem = ref<InventoryItemWithType | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const total = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  
  // Filters and sorting
  const filters = ref<InventoryItemFilters>({
    search: '',
    type_id: undefined,
    condition: [],
    is_active: undefined,
  })
  
  const sortOptions = ref<InventoryItemSortOptions>({
    field: 'number',
    order: 'asc',
  })
  
  // Selected items for bulk operations
  const selectedInventoryItemIds = ref<number[]>([])

  // Computed
  const hasSelectedInventoryItems = computed(() => selectedInventoryItemIds.value.length > 0)
  
  const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))
  
  const activeInventoryItems = computed(() => 
    inventoryItems.value.filter(item => item.is_active)
  )
  
  const itemsByCondition = computed(() => {
    const counts = {
      ok: 0,
      minor: 0,
      critical: 0,
    }
    
    inventoryItems.value.forEach(item => {
      if (item.is_active) {
        if (item.condition === InventoryCondition.OK) {
          counts.ok++
        } else if (item.condition === InventoryCondition.MINOR_ISSUE) {
          counts.minor++
        } else if (item.condition === InventoryCondition.CRITICAL) {
          counts.critical++
        }
      }
    })
    
    return counts
  })

  // Actions
  const fetchInventoryItems = async (resetPagination = false) => {
    try {
      loading.value = true
      error.value = null
      
      if (resetPagination) {
        currentPage.value = 1
      }
      
      const params: InventoryItemsSearchParams = {
        search: filters.value.search || undefined,
        type_id: filters.value.type_id,
        condition: filters.value.condition && filters.value.condition.length ? filters.value.condition : undefined,
        is_active: filters.value.is_active,
        skip: (currentPage.value - 1) * itemsPerPage.value,
        limit: itemsPerPage.value,
        sort_by: sortOptions.value.field,
        sort_order: sortOptions.value.order,
      }
      
      const data = await InventoryItemService.getInventoryItems(params)
      inventoryItems.value = Array.isArray(data) ? data : data.inventory_items || []
      total.value = data.total || inventoryItems.value.length
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch inventory items'
      inventoryItems.value = []
      
      // If API is not available, show a more helpful error message
      if (err.code === 'ECONNREFUSED' || err.response?.status === 404) {
        error.value = 'Backend API is not available. Please make sure the backend server is running.'
      }
    } finally {
      loading.value = false
    }
  }

  const fetchInventoryItem = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      currentInventoryItem.value = await InventoryItemService.getInventoryItem(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch inventory item'
      currentInventoryItem.value = null
    } finally {
      loading.value = false
    }
  }

  const createInventoryItem = async (data: InventoryItemCreate) => {
    try {
      loading.value = true
      error.value = null
      const inventoryItem = await InventoryItemService.createInventoryItem(data)
      await fetchInventoryItems() // Refresh list
      return { success: true, data: inventoryItem }
    } catch (err: any) {
      error.value = err.message || 'Failed to create inventory item'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateInventoryItem = async (id: number, data: InventoryItemUpdate) => {
    try {
      loading.value = true
      error.value = null
      const inventoryItem = await InventoryItemService.updateInventoryItem(id, data)
      
      // Update current inventory item if it's the one being edited
      if (currentInventoryItem.value?.id === id) {
        await fetchInventoryItem(id) // Fetch full details with relationships
      }
      
      // Update in the list - need to fetch full details
      const index = inventoryItems.value.findIndex(item => item.id === id)
      if (index !== -1) {
        // For now, just update basic fields - in a real app, you'd want to fetch the full item
        inventoryItems.value[index] = {
          ...inventoryItems.value[index],
          number: inventoryItem.number,
          condition: inventoryItem.condition,
          notes: inventoryItem.notes,
          is_active: inventoryItem.is_active,
          type_id: inventoryItem.type_id,
        }
      }
      
      return { success: true, data: inventoryItem }
    } catch (err: any) {
      error.value = err.message || 'Failed to update inventory item'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteInventoryItem = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await InventoryItemService.deleteInventoryItem(id)
      
      // Remove from list
      inventoryItems.value = inventoryItems.value.filter(item => item.id !== id)
      total.value = Math.max(0, total.value - 1)
      
      // Clear current inventory item if it was deleted
      if (currentInventoryItem.value?.id === id) {
        currentInventoryItem.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete inventory item'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Specialized methods
  const getItemsByType = async (inventoryTypeId: number, activeOnly = true) => {
    try {
      return await InventoryItemService.getItemsByType(inventoryTypeId, activeOnly)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch items by type'
      return []
    }
  }

  const getAvailableItems = async (inventoryTypeId?: number, startDate?: string, endDate?: string) => {
    try {
      return await InventoryItemService.getAvailableItems(inventoryTypeId, startDate, endDate)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch available items'
      return []
    }
  }

  // Booking integration methods
  const getAvailableItemsByType = async (typeId: number, startDate?: string, endDate?: string) => {
    try {
      return await InventoryItemService.getAvailableItemsByType(typeId, startDate, endDate)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch available items by type'
      return []
    }
  }

  const checkItemsAvailability = async (itemIds: number[], startDate: string, endDate: string) => {
    try {
      return await InventoryItemService.checkItemsAvailability(itemIds, startDate, endDate)
    } catch (err: any) {
      error.value = err.message || 'Failed to check items availability'
      return {}
    }
  }

  // Booking-specific inventory selection state
  const selectedForBooking = ref<{ itemId: number; quantity: number; notes?: string }[]>([])
  
  const addItemToBookingSelection = (itemId: number, quantity = 1, notes?: string) => {
    const existingIndex = selectedForBooking.value.findIndex(item => item.itemId === itemId)
    if (existingIndex >= 0) {
      selectedForBooking.value[existingIndex] = { itemId, quantity, notes }
    } else {
      selectedForBooking.value.push({ itemId, quantity, notes })
    }
  }

  const removeItemFromBookingSelection = (itemId: number) => {
    selectedForBooking.value = selectedForBooking.value.filter(item => item.itemId !== itemId)
  }

  const clearBookingSelection = () => {
    selectedForBooking.value = []
  }

  const getBookingSelection = computed(() => selectedForBooking.value)

  const hasBookingSelection = computed(() => selectedForBooking.value.length > 0)

  // Filter and sorting helpers
  const updateFilters = (newFilters: Partial<InventoryItemFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchInventoryItems(true) // Reset pagination when filtering
  }

  const updateSort = (field: InventoryItemSortOptions['field'], order?: InventoryItemSortOptions['order']) => {
    // Toggle order if same field is clicked
    if (sortOptions.value.field === field && !order) {
      order = sortOptions.value.order === 'asc' ? 'desc' : 'asc'
    }
    
    sortOptions.value = {
      field,
      order: order || 'asc',
    }
    
    fetchInventoryItems(true)
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      type_id: undefined,
      condition: [],
      is_active: undefined,
    }
    fetchInventoryItems(true)
  }

  // Pagination
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchInventoryItems()
    }
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1
    fetchInventoryItems()
  }

  // Selection management
  const toggleInventoryItemSelection = (id: number) => {
    const index = selectedInventoryItemIds.value.indexOf(id)
    if (index >= 0) {
      selectedInventoryItemIds.value.splice(index, 1)
    } else {
      selectedInventoryItemIds.value.push(id)
    }
  }

  const selectAllInventoryItems = () => {
    selectedInventoryItemIds.value = inventoryItems.value.map(item => item.id)
  }

  const clearSelection = () => {
    selectedInventoryItemIds.value = []
  }

  // Bulk operations
  const bulkDelete = async () => {
    if (selectedInventoryItemIds.value.length === 0) return { success: false, error: 'No inventory items selected' }
    
    try {
      loading.value = true
      error.value = null
      
      // Delete each selected inventory item
      await Promise.all(
        selectedInventoryItemIds.value.map(id => InventoryItemService.deleteInventoryItem(id))
      )
      
      await fetchInventoryItems()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete inventory items'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkToggleActive = async (isActive: boolean) => {
    if (selectedInventoryItemIds.value.length === 0) return { success: false, error: 'No inventory items selected' }
    
    try {
      loading.value = true
      error.value = null
      
      // Update each selected inventory item
      await Promise.all(
        selectedInventoryItemIds.value.map(id => 
          InventoryItemService.updateInventoryItem(id, { is_active: isActive })
        )
      )
      
      await fetchInventoryItems()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to update inventory items'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkUpdateCondition = async (condition: InventoryCondition) => {
    if (selectedInventoryItemIds.value.length === 0) return { success: false, error: 'No inventory items selected' }
    
    try {
      loading.value = true
      error.value = null
      
      // Update each selected inventory item
      await Promise.all(
        selectedInventoryItemIds.value.map(id => 
          InventoryItemService.updateInventoryItem(id, { condition })
        )
      )
      
      await fetchInventoryItems()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to update inventory items condition'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Reset store
  const reset = () => {
    inventoryItems.value = []
    currentInventoryItem.value = null
    loading.value = false
    error.value = null
    total.value = 0
    currentPage.value = 1
    clearSelection()
    clearFilters()
    clearBookingSelection()
  }

  return {
    // State
    inventoryItems,
    currentInventoryItem,
    loading,
    error,
    total,
    currentPage,
    itemsPerPage,
    filters,
    sortOptions,
    selectedInventoryItemIds,
    
    // Computed
    hasSelectedInventoryItems,
    totalPages,
    activeInventoryItems,
    itemsByCondition,
    
    // Actions
    fetchInventoryItems,
    fetchInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getItemsByType,
    getAvailableItems,
    getAvailableItemsByType,
    checkItemsAvailability,
    updateFilters,
    updateSort,
    clearFilters,
    setPage,
    setItemsPerPage,
    toggleInventoryItemSelection,
    selectAllInventoryItems,
    clearSelection,
    bulkDelete,
    bulkToggleActive,
    bulkUpdateCondition,
    
    // Booking integration
    selectedForBooking,
    getBookingSelection,
    hasBookingSelection,
    addItemToBookingSelection,
    removeItemFromBookingSelection,
    clearBookingSelection,
    reset,
  }
})