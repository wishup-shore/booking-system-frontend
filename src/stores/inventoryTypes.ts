import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { InventoryTypeService } from '../services/inventoryService'
import type {
  InventoryType,
  InventoryTypeCreate,
  InventoryTypeUpdate,
  InventoryTypeFilters,
  InventoryTypeSortOptions,
  InventoryTypesSearchParams,
} from '../types/inventory'

export const useInventoryTypesStore = defineStore('inventoryTypes', () => {
  // State
  const inventoryTypes = ref<InventoryType[]>([])
  const currentInventoryType = ref<InventoryType | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const total = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  
  // Filters and sorting
  const filters = ref<InventoryTypeFilters>({
    search: '',
    is_active: undefined,
  })
  
  const sortOptions = ref<InventoryTypeSortOptions>({
    field: 'name',
    order: 'asc',
  })
  
  // Selected items for bulk operations
  const selectedInventoryTypeIds = ref<number[]>([])

  // Computed
  const hasSelectedInventoryTypes = computed(() => selectedInventoryTypeIds.value.length > 0)
  
  const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))
  
  const activeInventoryTypes = computed(() => 
    inventoryTypes.value.filter(type => type.is_active)
  )

  // Actions
  const fetchInventoryTypes = async (resetPagination = false) => {
    try {
      loading.value = true
      error.value = null
      
      if (resetPagination) {
        currentPage.value = 1
      }
      
      const params: InventoryTypesSearchParams = {
        search: filters.value.search || undefined,
        is_active: filters.value.is_active,
        skip: (currentPage.value - 1) * itemsPerPage.value,
        limit: itemsPerPage.value,
        sort_by: sortOptions.value.field,
        sort_order: sortOptions.value.order,
      }
      
      const data = await InventoryTypeService.getInventoryTypes(params)
      inventoryTypes.value = Array.isArray(data) ? data : data.inventory_types || []
      total.value = data.total || inventoryTypes.value.length
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch inventory types'
      inventoryTypes.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchInventoryType = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      currentInventoryType.value = await InventoryTypeService.getInventoryType(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch inventory type'
      currentInventoryType.value = null
    } finally {
      loading.value = false
    }
  }

  const createInventoryType = async (data: InventoryTypeCreate) => {
    try {
      loading.value = true
      error.value = null
      const inventoryType = await InventoryTypeService.createInventoryType(data)
      await fetchInventoryTypes() // Refresh list
      return { success: true, data: inventoryType }
    } catch (err: any) {
      error.value = err.message || 'Failed to create inventory type'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateInventoryType = async (id: number, data: InventoryTypeUpdate) => {
    try {
      loading.value = true
      error.value = null
      const inventoryType = await InventoryTypeService.updateInventoryType(id, data)
      
      // Update current inventory type if it's the one being edited
      if (currentInventoryType.value?.id === id) {
        currentInventoryType.value = inventoryType
      }
      
      // Update in the list
      const index = inventoryTypes.value.findIndex(type => type.id === id)
      if (index !== -1) {
        inventoryTypes.value[index] = inventoryType
      }
      
      return { success: true, data: inventoryType }
    } catch (err: any) {
      error.value = err.message || 'Failed to update inventory type'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteInventoryType = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await InventoryTypeService.deleteInventoryType(id)
      
      // Remove from list
      inventoryTypes.value = inventoryTypes.value.filter(type => type.id !== id)
      total.value = Math.max(0, total.value - 1)
      
      // Clear current inventory type if it was deleted
      if (currentInventoryType.value?.id === id) {
        currentInventoryType.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete inventory type'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Filter and sorting helpers
  const updateFilters = (newFilters: Partial<InventoryTypeFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchInventoryTypes(true) // Reset pagination when filtering
  }

  const updateSort = (field: InventoryTypeSortOptions['field'], order?: InventoryTypeSortOptions['order']) => {
    // Toggle order if same field is clicked
    if (sortOptions.value.field === field && !order) {
      order = sortOptions.value.order === 'asc' ? 'desc' : 'asc'
    }
    
    sortOptions.value = {
      field,
      order: order || 'asc',
    }
    
    fetchInventoryTypes(true)
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      is_active: undefined,
    }
    fetchInventoryTypes(true)
  }

  // Pagination
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchInventoryTypes()
    }
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1
    fetchInventoryTypes()
  }

  // Selection management
  const toggleInventoryTypeSelection = (id: number) => {
    const index = selectedInventoryTypeIds.value.indexOf(id)
    if (index >= 0) {
      selectedInventoryTypeIds.value.splice(index, 1)
    } else {
      selectedInventoryTypeIds.value.push(id)
    }
  }

  const selectAllInventoryTypes = () => {
    selectedInventoryTypeIds.value = inventoryTypes.value.map(type => type.id)
  }

  const clearSelection = () => {
    selectedInventoryTypeIds.value = []
  }

  // Bulk operations
  const bulkDelete = async () => {
    if (selectedInventoryTypeIds.value.length === 0) return { success: false, error: 'No inventory types selected' }
    
    try {
      loading.value = true
      error.value = null
      
      // Delete each selected inventory type
      await Promise.all(
        selectedInventoryTypeIds.value.map(id => InventoryTypeService.deleteInventoryType(id))
      )
      
      await fetchInventoryTypes()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete inventory types'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkToggleActive = async (isActive: boolean) => {
    if (selectedInventoryTypeIds.value.length === 0) return { success: false, error: 'No inventory types selected' }
    
    try {
      loading.value = true
      error.value = null
      
      // Update each selected inventory type
      await Promise.all(
        selectedInventoryTypeIds.value.map(id => 
          InventoryTypeService.updateInventoryType(id, { is_active: isActive })
        )
      )
      
      await fetchInventoryTypes()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to update inventory types'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Utility methods
  const getInventoryTypesList = async (activeOnly = true) => {
    try {
      return await InventoryTypeService.getInventoryTypesList(activeOnly)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch inventory types list'
      return []
    }
  }

  // Reset store
  const reset = () => {
    inventoryTypes.value = []
    currentInventoryType.value = null
    loading.value = false
    error.value = null
    total.value = 0
    currentPage.value = 1
    clearSelection()
    clearFilters()
  }

  return {
    // State
    inventoryTypes,
    currentInventoryType,
    loading,
    error,
    total,
    currentPage,
    itemsPerPage,
    filters,
    sortOptions,
    selectedInventoryTypeIds,
    
    // Computed
    hasSelectedInventoryTypes,
    totalPages,
    activeInventoryTypes,
    
    // Actions
    fetchInventoryTypes,
    fetchInventoryType,
    createInventoryType,
    updateInventoryType,
    deleteInventoryType,
    updateFilters,
    updateSort,
    clearFilters,
    setPage,
    setItemsPerPage,
    toggleInventoryTypeSelection,
    selectAllInventoryTypes,
    clearSelection,
    bulkDelete,
    bulkToggleActive,
    getInventoryTypesList,
    reset,
  }
})