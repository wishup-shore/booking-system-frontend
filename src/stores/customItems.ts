import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CustomItemService } from '../services/customItemService'
import type {
  CustomItem,
  CustomItemCreate,
  CustomItemUpdate,
  CustomItemFilters,
  CustomItemSortOptions,
  CustomItemsSearchParams,
} from '../types/inventory'

export const useCustomItemsStore = defineStore('customItems', () => {
  // State
  const customItems = ref<CustomItem[]>([])
  const currentCustomItem = ref<CustomItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const total = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  
  // Filters and sorting
  const filters = ref<CustomItemFilters>({
    search: '',
    is_active: undefined,
  })
  
  const sortOptions = ref<CustomItemSortOptions>({
    field: 'name',
    order: 'asc',
  })
  
  // Selected items for bulk operations
  const selectedCustomItemIds = ref<number[]>([])

  // Computed
  const hasSelectedCustomItems = computed(() => selectedCustomItemIds.value.length > 0)
  
  const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))
  
  const activeCustomItems = computed(() => 
    customItems.value.filter(item => item.is_active)
  )

  // Actions
  const fetchCustomItems = async (resetPagination = false) => {
    try {
      loading.value = true
      error.value = null
      
      if (resetPagination) {
        currentPage.value = 1
      }
      
      const params: CustomItemsSearchParams = {
        search: filters.value.search || undefined,
        is_active: filters.value.is_active,
        skip: (currentPage.value - 1) * itemsPerPage.value,
        limit: itemsPerPage.value,
        sort_by: sortOptions.value.field,
        sort_order: sortOptions.value.order,
      }
      
      const data = await CustomItemService.getCustomItems(params)
      customItems.value = Array.isArray(data) ? data : data.custom_items || []
      total.value = data.total || customItems.value.length
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch custom items'
      customItems.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchCustomItem = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      currentCustomItem.value = await CustomItemService.getCustomItem(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch custom item'
      currentCustomItem.value = null
    } finally {
      loading.value = false
    }
  }

  const createCustomItem = async (data: CustomItemCreate) => {
    try {
      loading.value = true
      error.value = null
      const customItem = await CustomItemService.createCustomItem(data)
      await fetchCustomItems() // Refresh list
      return { success: true, data: customItem }
    } catch (err: any) {
      error.value = err.message || 'Failed to create custom item'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateCustomItem = async (id: number, data: CustomItemUpdate) => {
    try {
      loading.value = true
      error.value = null
      const customItem = await CustomItemService.updateCustomItem(id, data)
      
      // Update current custom item if it's the one being edited
      if (currentCustomItem.value?.id === id) {
        currentCustomItem.value = customItem
      }
      
      // Update in the list
      const index = customItems.value.findIndex(item => item.id === id)
      if (index !== -1) {
        customItems.value[index] = customItem
      }
      
      return { success: true, data: customItem }
    } catch (err: any) {
      error.value = err.message || 'Failed to update custom item'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteCustomItem = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await CustomItemService.deleteCustomItem(id)
      
      // Remove from list
      customItems.value = customItems.value.filter(item => item.id !== id)
      total.value = Math.max(0, total.value - 1)
      
      // Clear current custom item if it was deleted
      if (currentCustomItem.value?.id === id) {
        currentCustomItem.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete custom item'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Filter and sorting helpers
  const updateFilters = (newFilters: Partial<CustomItemFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchCustomItems(true) // Reset pagination when filtering
  }

  const updateSort = (field: CustomItemSortOptions['field'], order?: CustomItemSortOptions['order']) => {
    // Toggle order if same field is clicked
    if (sortOptions.value.field === field && !order) {
      order = sortOptions.value.order === 'asc' ? 'desc' : 'asc'
    }
    
    sortOptions.value = {
      field,
      order: order || 'asc',
    }
    
    fetchCustomItems(true)
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      is_active: undefined,
    }
    fetchCustomItems(true)
  }

  // Pagination
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchCustomItems()
    }
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1
    fetchCustomItems()
  }

  // Selection management
  const toggleCustomItemSelection = (id: number) => {
    const index = selectedCustomItemIds.value.indexOf(id)
    if (index >= 0) {
      selectedCustomItemIds.value.splice(index, 1)
    } else {
      selectedCustomItemIds.value.push(id)
    }
  }

  const selectAllCustomItems = () => {
    selectedCustomItemIds.value = customItems.value.map(item => item.id)
  }

  const clearSelection = () => {
    selectedCustomItemIds.value = []
  }

  // Bulk operations
  const bulkDelete = async () => {
    if (selectedCustomItemIds.value.length === 0) return { success: false, error: 'No custom items selected' }
    
    try {
      loading.value = true
      error.value = null
      
      // Delete each selected custom item
      await Promise.all(
        selectedCustomItemIds.value.map(id => CustomItemService.deleteCustomItem(id))
      )
      
      await fetchCustomItems()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete custom items'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkToggleActive = async (isActive: boolean) => {
    if (selectedCustomItemIds.value.length === 0) return { success: false, error: 'No custom items selected' }
    
    try {
      loading.value = true
      error.value = null
      
      // Update each selected custom item
      await Promise.all(
        selectedCustomItemIds.value.map(id => 
          CustomItemService.updateCustomItem(id, { is_active: isActive })
        )
      )
      
      await fetchCustomItems()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to update custom items'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Utility methods
  const getCustomItemsList = async (activeOnly = true) => {
    try {
      return await CustomItemService.getCustomItemsList(activeOnly)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch custom items list'
      return []
    }
  }

  // Booking integration methods
  const selectedForBooking = ref<{ itemId: number; quantity: number; unitPrice?: number; notes?: string }[]>([])
  
  const addItemToBookingSelection = (itemId: number, quantity = 1, unitPrice?: number, notes?: string) => {
    const existingIndex = selectedForBooking.value.findIndex(item => item.itemId === itemId)
    if (existingIndex >= 0) {
      selectedForBooking.value[existingIndex] = { itemId, quantity, unitPrice, notes }
    } else {
      selectedForBooking.value.push({ itemId, quantity, unitPrice, notes })
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

  const getBookingSelectionTotal = computed(() => {
    return selectedForBooking.value.reduce((total, item) => {
      const customItem = customItems.value.find(ci => ci.id === item.itemId)
      const price = item.unitPrice ?? customItem?.price ?? 0
      return total + (price * item.quantity)
    }, 0)
  })

  // Reset store
  const reset = () => {
    customItems.value = []
    currentCustomItem.value = null
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
    customItems,
    currentCustomItem,
    loading,
    error,
    total,
    currentPage,
    itemsPerPage,
    filters,
    sortOptions,
    selectedCustomItemIds,
    
    // Computed
    hasSelectedCustomItems,
    totalPages,
    activeCustomItems,
    
    // Actions
    fetchCustomItems,
    fetchCustomItem,
    createCustomItem,
    updateCustomItem,
    deleteCustomItem,
    updateFilters,
    updateSort,
    clearFilters,
    setPage,
    setItemsPerPage,
    toggleCustomItemSelection,
    selectAllCustomItems,
    clearSelection,
    bulkDelete,
    bulkToggleActive,
    getCustomItemsList,
    
    // Booking integration
    selectedForBooking,
    getBookingSelection,
    hasBookingSelection,
    getBookingSelectionTotal,
    addItemToBookingSelection,
    removeItemFromBookingSelection,
    clearBookingSelection,
    reset,
  }
})