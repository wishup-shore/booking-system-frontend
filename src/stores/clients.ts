import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ClientService } from '../services/clientService'
import type {
  Client,
  ClientCreate,
  ClientUpdate,
  ClientStats,
  ClientGroup,
  ClientGroupCreate,
  ClientGroupUpdate,
  ClientGroupDetail,
  ClientsSearchParams,
} from '../types/client'
import { useErrorHandler } from '../composables/useErrorHandler'

export const useClientsStore = defineStore('clients', () => {
  const { handleError, clearError } = useErrorHandler()
  
  // State
  const clients = ref<Client[]>([])
  const currentClient = ref<Client | null>(null)
  const clientStats = ref<ClientStats | null>(null)
  const clientGroups = ref<ClientGroup[]>([])
  const currentGroup = ref<ClientGroupDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const total = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  
  // Search
  const searchQuery = ref('')
  
  // Selected items for bulk operations
  const selectedClientIds = ref<number[]>([])

  // Computed
  const hasSelectedClients = computed(() => selectedClientIds.value.length > 0)
  const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))
  const filteredClientsCount = computed(() => clients.value.length)

  // Client Actions
  const fetchClients = async (resetPagination = false) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      if (resetPagination) {
        currentPage.value = 1
      }
      
      const params: ClientsSearchParams = {
        search: searchQuery.value || undefined,
        skip: (currentPage.value - 1) * itemsPerPage.value,
        limit: itemsPerPage.value,
      }
      
      const response = await ClientService.getClients(params)
      clients.value = response.clients
      total.value = response.total
      
      return { success: true, data: response }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchClients')
      error.value = apiError.getUserMessage()
      clients.value = []
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchClient = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      currentClient.value = await ClientService.getClient(id)
      return { success: true, data: currentClient.value }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchClient')
      error.value = apiError.getUserMessage()
      currentClient.value = null
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createClient = async (data: ClientCreate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const client = await ClientService.createClient(data)
      await fetchClients() // Refresh list
      return { success: true, data: client }
    } catch (err: any) {
      const apiError = handleError(err, 'createClient')
      error.value = apiError.getUserMessage()
      return { 
        success: false, 
        error: error.value,
        validationErrors: apiError.getValidationMessages()
      }
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (id: number, data: ClientUpdate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const client = await ClientService.updateClient(id, data)
      
      // Update current client if it's the one being edited
      if (currentClient.value?.id === id) {
        currentClient.value = client
      }
      
      // Update in the list
      const index = clients.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clients.value[index] = client
      }
      
      return { success: true, data: client }
    } catch (err: any) {
      const apiError = handleError(err, 'updateClient')
      error.value = apiError.getUserMessage()
      return { 
        success: false, 
        error: error.value,
        validationErrors: apiError.getValidationMessages()
      }
    } finally {
      loading.value = false
    }
  }

  const deleteClient = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      await ClientService.deleteClient(id)
      
      // Remove from list
      clients.value = clients.value.filter(c => c.id !== id)
      total.value = Math.max(0, total.value - 1)
      
      // Clear current client if it was deleted
      if (currentClient.value?.id === id) {
        currentClient.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'deleteClient')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchClientStats = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      clientStats.value = await ClientService.getClientStats(id)
      return { success: true, data: clientStats.value }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchClientStats')
      error.value = apiError.getUserMessage()
      clientStats.value = null
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Client Group Actions
  const fetchClientGroups = async () => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const response = await ClientService.getClientGroups()
      clientGroups.value = response.groups
      return { success: true, data: response }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchClientGroups')
      error.value = apiError.getUserMessage()
      clientGroups.value = []
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchClientGroup = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      currentGroup.value = await ClientService.getClientGroup(id)
      return { success: true, data: currentGroup.value }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchClientGroup')
      error.value = apiError.getUserMessage()
      currentGroup.value = null
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createClientGroup = async (data: ClientGroupCreate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const group = await ClientService.createClientGroup(data)
      await fetchClientGroups() // Refresh list
      return { success: true, data: group }
    } catch (err: any) {
      const apiError = handleError(err, 'createClientGroup')
      error.value = apiError.getUserMessage()
      return { 
        success: false, 
        error: error.value,
        validationErrors: apiError.getValidationMessages()
      }
    } finally {
      loading.value = false
    }
  }

  const updateClientGroup = async (id: number, data: ClientGroupUpdate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const group = await ClientService.updateClientGroup(id, data)
      
      // Update in the list
      const index = clientGroups.value.findIndex(g => g.id === id)
      if (index !== -1) {
        clientGroups.value[index] = group
      }
      
      return { success: true, data: group }
    } catch (err: any) {
      const apiError = handleError(err, 'updateClientGroup')
      error.value = apiError.getUserMessage()
      return { 
        success: false, 
        error: error.value,
        validationErrors: apiError.getValidationMessages()
      }
    } finally {
      loading.value = false
    }
  }

  const deleteClientGroup = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      await ClientService.deleteClientGroup(id)
      
      // Remove from list
      clientGroups.value = clientGroups.value.filter(g => g.id !== id)
      
      // Clear current group if it was deleted
      if (currentGroup.value?.id === id) {
        currentGroup.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'deleteClientGroup')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const addClientToGroup = async (groupId: number, clientId: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      await ClientService.addClientToGroup(groupId, clientId)
      
      // Refresh group details if currently viewing this group
      if (currentGroup.value?.id === groupId) {
        await fetchClientGroup(groupId)
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'addClientToGroup')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const removeClientFromGroup = async (groupId: number, clientId: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      await ClientService.removeClientFromGroup(groupId, clientId)
      
      // Refresh group details if currently viewing this group
      if (currentGroup.value?.id === groupId) {
        await fetchClientGroup(groupId)
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'removeClientFromGroup')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Search and Filter helpers
  const updateSearch = (query: string) => {
    searchQuery.value = query
    fetchClients(true) // Reset pagination when searching
  }

  const clearSearch = () => {
    searchQuery.value = ''
    fetchClients(true)
  }

  // Pagination
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchClients()
    }
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1
    fetchClients()
  }

  // Selection management
  const toggleClientSelection = (id: number) => {
    const index = selectedClientIds.value.indexOf(id)
    if (index >= 0) {
      selectedClientIds.value.splice(index, 1)
    } else {
      selectedClientIds.value.push(id)
    }
  }

  const selectAllClients = () => {
    selectedClientIds.value = clients.value.map(c => c.id)
  }

  const clearSelection = () => {
    selectedClientIds.value = []
  }

  // Bulk operations
  const bulkDeleteClients = async () => {
    if (selectedClientIds.value.length === 0) {
      return { success: false, error: 'No clients selected' }
    }
    
    try {
      loading.value = true
      error.value = null
      clearError()
      
      // Delete clients one by one (no bulk API endpoint)
      const promises = selectedClientIds.value.map(id => ClientService.deleteClient(id))
      await Promise.all(promises)
      
      await fetchClients()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'bulkDeleteClients')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Reset store
  const reset = () => {
    clients.value = []
    currentClient.value = null
    clientStats.value = null
    clientGroups.value = []
    currentGroup.value = null
    loading.value = false
    error.value = null
    total.value = 0
    currentPage.value = 1
    searchQuery.value = ''
    clearSelection()
    clearError()
  }

  return {
    // State
    clients,
    currentClient,
    clientStats,
    clientGroups,
    currentGroup,
    loading,
    error,
    total,
    currentPage,
    itemsPerPage,
    searchQuery,
    selectedClientIds,
    
    // Computed
    hasSelectedClients,
    totalPages,
    filteredClientsCount,
    
    // Client Actions
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    fetchClientStats,
    
    // Group Actions
    fetchClientGroups,
    fetchClientGroup,
    createClientGroup,
    updateClientGroup,
    deleteClientGroup,
    addClientToGroup,
    removeClientFromGroup,
    
    // Helpers
    updateSearch,
    clearSearch,
    setPage,
    setItemsPerPage,
    toggleClientSelection,
    selectAllClients,
    clearSelection,
    bulkDeleteClients,
    reset,
  }
})