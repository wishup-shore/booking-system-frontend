import { ref, computed } from 'vue'
import { useClientsStore } from '../stores/clients'
import { useToast } from 'vue-toastification'
import type { Client, ClientCreate, ClientUpdate, ClientStats } from '../types/client'

export function useClientManagement() {
  const clientsStore = useClientsStore()
  const toast = useToast()
  
  // State
  const selectedClients = ref<number[]>([])
  const currentClient = ref<Client | null>(null)
  const clientStats = ref<ClientStats | null>(null)
  const showModal = ref(false)
  const showStatsModal = ref(false)
  const editMode = ref(false)
  
  // Computed
  const clients = computed(() => clientsStore.clients)
  const loading = computed(() => clientsStore.loading)
  const hasSelectedClients = computed(() => selectedClients.value.length > 0)
  const selectedClientsCount = computed(() => selectedClients.value.length)
  
  const searchQuery = computed({
    get: () => clientsStore.searchQuery,
    set: (value: string) => clientsStore.updateSearch(value)
  })
  
  const totalClients = computed(() => clientsStore.total)
  const currentPage = computed(() => clientsStore.currentPage)
  const totalPages = computed(() => clientsStore.totalPages)
  
  // Methods
  const loadClients = async () => {
    const result = await clientsStore.fetchClients()
    if (!result.success) {
      toast.error(result.error || 'Failed to load clients')
    }
    return result
  }
  
  const loadClient = async (id: number) => {
    const result = await clientsStore.fetchClient(id)
    if (result.success) {
      currentClient.value = result.data || null
    } else {
      toast.error(result.error || 'Failed to load client')
    }
    return result
  }
  
  const createClient = async (data: ClientCreate) => {
    const result = await clientsStore.createClient(data)
    if (result.success) {
      toast.success('Client created successfully')
      closeModal()
    } else {
      toast.error(result.error || 'Failed to create client')
      if (result.validationErrors) {
        // Handle validation errors
        console.error('Validation errors:', result.validationErrors)
      }
    }
    return result
  }
  
  const updateClient = async (id: number, data: ClientUpdate) => {
    const result = await clientsStore.updateClient(id, data)
    if (result.success) {
      toast.success('Client updated successfully')
      closeModal()
    } else {
      toast.error(result.error || 'Failed to update client')
      if (result.validationErrors) {
        // Handle validation errors
        console.error('Validation errors:', result.validationErrors)
      }
    }
    return result
  }
  
  const deleteClient = async (id: number) => {
    const result = await clientsStore.deleteClient(id)
    if (result.success) {
      toast.success('Client deleted successfully')
      // Remove from selection if it was selected
      selectedClients.value = selectedClients.value.filter(clientId => clientId !== id)
    } else {
      toast.error(result.error || 'Failed to delete client')
    }
    return result
  }
  
  const loadClientStats = async (id: number) => {
    const result = await clientsStore.fetchClientStats(id)
    if (result.success) {
      clientStats.value = result.data || null
    } else {
      toast.error(result.error || 'Failed to load client statistics')
    }
    return result
  }
  
  const bulkDeleteClients = async () => {
    if (selectedClients.value.length === 0) {
      toast.warning('No clients selected')
      return { success: false, error: 'No clients selected' }
    }
    
    const result = await clientsStore.bulkDeleteClients()
    if (result.success) {
      toast.success(`${selectedClients.value.length} clients deleted successfully`)
      clearSelection()
    } else {
      toast.error(result.error || 'Failed to delete clients')
    }
    return result
  }
  
  // Selection methods
  const toggleClientSelection = (clientId: number) => {
    const index = selectedClients.value.indexOf(clientId)
    if (index >= 0) {
      selectedClients.value.splice(index, 1)
    } else {
      selectedClients.value.push(clientId)
    }
  }
  
  const selectAllClients = () => {
    selectedClients.value = clients.value.map(client => client.id)
  }
  
  const clearSelection = () => {
    selectedClients.value = []
  }
  
  const isClientSelected = (clientId: number) => {
    return selectedClients.value.includes(clientId)
  }
  
  // Modal methods
  const openCreateModal = () => {
    currentClient.value = null
    editMode.value = false
    showModal.value = true
  }
  
  const openEditModal = (client: Client) => {
    currentClient.value = client
    editMode.value = true
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    currentClient.value = null
    editMode.value = false
  }
  
  const openStatsModal = async (client: Client) => {
    currentClient.value = client
    showStatsModal.value = true
    await loadClientStats(client.id)
  }
  
  const closeStatsModal = () => {
    showStatsModal.value = false
    currentClient.value = null
    clientStats.value = null
  }
  
  // Search and pagination
  const search = (query: string) => {
    searchQuery.value = query
  }
  
  const clearSearch = () => {
    clientsStore.clearSearch()
  }
  
  const goToPage = (page: number) => {
    clientsStore.setPage(page)
  }
  
  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      clientsStore.setPage(currentPage.value - 1)
    }
  }
  
  const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
      clientsStore.setPage(currentPage.value + 1)
    }
  }
  
  // Utility methods
  const getClientInitials = (client: Client) => {
    return `${client.first_name.charAt(0)}${client.last_name.charAt(0)}`.toUpperCase()
  }
  
  const getClientFullName = (client: Client) => {
    return `${client.first_name} ${client.last_name}`
  }
  
  const formatClientContact = (client: Client) => {
    const contact = []
    if (client.phone) contact.push(client.phone)
    if (client.email) contact.push(client.email)
    return contact.join(' • ')
  }
  
  const getClientRatingStars = (rating?: number) => {
    if (!rating) return '☆☆☆☆☆'
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars)
  }
  
  const sortClientsByName = (ascending = true) => {
    return [...clients.value].sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase()
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase()
      return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    })
  }
  
  const filterClientsByRating = (minRating: number) => {
    return clients.value.filter(client => 
      client.rating && client.rating >= minRating
    )
  }
  
  const getClientsWithRecentBookings = (days = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    // Note: This would need to be implemented based on actual booking data
    // For now, return empty array as Client type doesn't have last_booking_date
    return []
  }
  
  // Initialize
  const initialize = async () => {
    await loadClients()
  }
  
  return {
    // State
    selectedClients,
    currentClient,
    clientStats,
    showModal,
    showStatsModal,
    editMode,
    
    // Computed
    clients,
    loading,
    hasSelectedClients,
    selectedClientsCount,
    searchQuery,
    totalClients,
    currentPage,
    totalPages,
    
    // Methods
    loadClients,
    loadClient,
    createClient,
    updateClient,
    deleteClient,
    loadClientStats,
    bulkDeleteClients,
    
    // Selection
    toggleClientSelection,
    selectAllClients,
    clearSelection,
    isClientSelected,
    
    // Modals
    openCreateModal,
    openEditModal,
    closeModal,
    openStatsModal,
    closeStatsModal,
    
    // Search and pagination
    search,
    clearSearch,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    
    // Utilities
    getClientInitials,
    getClientFullName,
    formatClientContact,
    getClientRatingStars,
    sortClientsByName,
    filterClientsByRating,
    getClientsWithRecentBookings,
    initialize,
  }
}