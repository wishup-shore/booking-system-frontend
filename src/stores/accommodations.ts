import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AccommodationService } from '../services/accommodationService'
import { AvailabilityService } from '../services/availabilityService'
import type {
  AccommodationType,
  AccommodationTypeCreate,
  AccommodationTypeUpdate,
  Accommodation,
  AccommodationCreate,
  AccommodationUpdate,
} from '../types/accommodation'
import type {
  AvailableAccommodation,
  AccommodationAvailabilityResponse,
} from '../services/availabilityService'
import { useErrorHandler } from '../composables/useErrorHandler'

export const useAccommodationsStore = defineStore('accommodations', () => {
  const { handleError, clearError } = useErrorHandler()
  
  // State
  const accommodations = ref<Accommodation[]>([])
  const accommodationTypes = ref<AccommodationType[]>([])
  const currentAccommodation = ref<Accommodation | null>(null)
  const currentAccommodationType = ref<AccommodationType | null>(null)
  const availableAccommodations = ref<AvailableAccommodation[]>([])
  const availabilityResults = ref<AccommodationAvailabilityResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Selected items for bulk operations
  const selectedAccommodationIds = ref<number[]>([])
  const selectedTypeIds = ref<number[]>([])

  // Computed
  const hasSelectedAccommodations = computed(() => selectedAccommodationIds.value.length > 0)
  const hasSelectedTypes = computed(() => selectedTypeIds.value.length > 0)
  
  const accommodationsByType = computed(() => {
    const grouped: Record<number, Accommodation[]> = {}
    accommodations.value.forEach(acc => {
      const typeId = acc.type.id
      if (!grouped[typeId]) {
        grouped[typeId] = []
      }
      grouped[typeId].push(acc)
    })
    return grouped
  })
  
  const availableAccommodationsCount = computed(() => 
    accommodations.value.filter(acc => acc.status === 'available').length
  )
  
  const occupiedAccommodationsCount = computed(() => 
    accommodations.value.filter(acc => acc.status === 'occupied').length
  )
  
  const maintenanceAccommodationsCount = computed(() => 
    accommodations.value.filter(acc => acc.status === 'maintenance').length
  )

  // Accommodation Type Actions
  const fetchAccommodationTypes = async () => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      accommodationTypes.value = await AccommodationService.getAccommodationTypes()
      return { success: true, data: accommodationTypes.value }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchAccommodationTypes')
      error.value = apiError.getUserMessage()
      accommodationTypes.value = []
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createAccommodationType = async (data: AccommodationTypeCreate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const type = await AccommodationService.createAccommodationType(data)
      accommodationTypes.value.push(type)
      return { success: true, data: type }
    } catch (err: any) {
      const apiError = handleError(err, 'createAccommodationType')
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

  const updateAccommodationType = async (id: number, data: AccommodationTypeUpdate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const type = await AccommodationService.updateAccommodationType(id, data)
      
      // Update current type if it's the one being edited
      if (currentAccommodationType.value?.id === id) {
        currentAccommodationType.value = type
      }
      
      // Update in the list
      const index = accommodationTypes.value.findIndex(t => t.id === id)
      if (index !== -1) {
        accommodationTypes.value[index] = type
      }
      
      return { success: true, data: type }
    } catch (err: any) {
      const apiError = handleError(err, 'updateAccommodationType')
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

  const deleteAccommodationType = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      await AccommodationService.deleteAccommodationType(id)
      
      // Remove from list
      accommodationTypes.value = accommodationTypes.value.filter(t => t.id !== id)
      
      // Clear current type if it was deleted
      if (currentAccommodationType.value?.id === id) {
        currentAccommodationType.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'deleteAccommodationType')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Accommodation Actions
  const fetchAccommodations = async () => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      accommodations.value = await AccommodationService.getAccommodations()
      return { success: true, data: accommodations.value }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchAccommodations')
      error.value = apiError.getUserMessage()
      accommodations.value = []
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createAccommodation = async (data: AccommodationCreate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const accommodation = await AccommodationService.createAccommodation(data)
      accommodations.value.push(accommodation)
      return { success: true, data: accommodation }
    } catch (err: any) {
      const apiError = handleError(err, 'createAccommodation')
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

  const updateAccommodation = async (id: number, data: AccommodationUpdate) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const accommodation = await AccommodationService.updateAccommodation(id, data)
      
      // Update current accommodation if it's the one being edited
      if (currentAccommodation.value?.id === id) {
        currentAccommodation.value = accommodation
      }
      
      // Update in the list
      const index = accommodations.value.findIndex(a => a.id === id)
      if (index !== -1) {
        accommodations.value[index] = accommodation
      }
      
      return { success: true, data: accommodation }
    } catch (err: any) {
      const apiError = handleError(err, 'updateAccommodation')
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

  const deleteAccommodation = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      await AccommodationService.deleteAccommodation(id)
      
      // Remove from list
      accommodations.value = accommodations.value.filter(a => a.id !== id)
      
      // Clear current accommodation if it was deleted
      if (currentAccommodation.value?.id === id) {
        currentAccommodation.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'deleteAccommodation')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Availability Actions
  const fetchAvailableAccommodations = async (
    startDate: string, 
    endDate: string, 
    capacity?: number
  ) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      availableAccommodations.value = await AvailabilityService.getAvailableAccommodations(
        startDate, 
        endDate, 
        capacity
      )
      return { success: true, data: availableAccommodations.value }
    } catch (err: any) {
      const apiError = handleError(err, 'fetchAvailableAccommodations')
      error.value = apiError.getUserMessage()
      availableAccommodations.value = []
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const checkAccommodationAvailability = async (
    accommodationId: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const result = await AvailabilityService.checkAccommodationAvailability(
        accommodationId,
        startDate,
        endDate
      )
      return { success: true, data: result }
    } catch (err: any) {
      const apiError = handleError(err, 'checkAccommodationAvailability')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const batchCheckAvailability = async (
    accommodationIds: number[],
    startDate: string,
    endDate: string
  ) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      availabilityResults.value = await AvailabilityService.batchCheckAvailability(
        accommodationIds,
        startDate,
        endDate
      )
      return { success: true, data: availabilityResults.value }
    } catch (err: any) {
      const apiError = handleError(err, 'batchCheckAvailability')
      error.value = apiError.getUserMessage()
      availabilityResults.value = []
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const findNextAvailableDate = async (
    accommodationId: number,
    startDate: string,
    maxDaysToCheck?: number
  ) => {
    try {
      loading.value = true
      error.value = null
      clearError()
      
      const result = await AvailabilityService.findNextAvailableDate(
        accommodationId,
        startDate,
        maxDaysToCheck
      )
      return { success: true, data: result }
    } catch (err: any) {
      const apiError = handleError(err, 'findNextAvailableDate')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Helper Actions
  const setCurrentAccommodation = (accommodation: Accommodation | null) => {
    currentAccommodation.value = accommodation
  }

  const setCurrentAccommodationType = (type: AccommodationType | null) => {
    currentAccommodationType.value = type
  }

  // Selection management
  const toggleAccommodationSelection = (id: number) => {
    const index = selectedAccommodationIds.value.indexOf(id)
    if (index >= 0) {
      selectedAccommodationIds.value.splice(index, 1)
    } else {
      selectedAccommodationIds.value.push(id)
    }
  }

  const toggleTypeSelection = (id: number) => {
    const index = selectedTypeIds.value.indexOf(id)
    if (index >= 0) {
      selectedTypeIds.value.splice(index, 1)
    } else {
      selectedTypeIds.value.push(id)
    }
  }

  const selectAllAccommodations = () => {
    selectedAccommodationIds.value = accommodations.value.map(a => a.id)
  }

  const selectAllTypes = () => {
    selectedTypeIds.value = accommodationTypes.value.map(t => t.id)
  }

  const clearAccommodationSelection = () => {
    selectedAccommodationIds.value = []
  }

  const clearTypeSelection = () => {
    selectedTypeIds.value = []
  }

  // Bulk operations
  const bulkDeleteAccommodations = async () => {
    if (selectedAccommodationIds.value.length === 0) {
      return { success: false, error: 'No accommodations selected' }
    }
    
    try {
      loading.value = true
      error.value = null
      clearError()
      
      // Delete accommodations one by one (no bulk API endpoint)
      const promises = selectedAccommodationIds.value.map(id => 
        AccommodationService.deleteAccommodation(id)
      )
      await Promise.all(promises)
      
      await fetchAccommodations()
      clearAccommodationSelection()
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'bulkDeleteAccommodations')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkDeleteTypes = async () => {
    if (selectedTypeIds.value.length === 0) {
      return { success: false, error: 'No types selected' }
    }
    
    try {
      loading.value = true
      error.value = null
      clearError()
      
      // Delete types one by one (no bulk API endpoint)
      const promises = selectedTypeIds.value.map(id => 
        AccommodationService.deleteAccommodationType(id)
      )
      await Promise.all(promises)
      
      await fetchAccommodationTypes()
      clearTypeSelection()
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'bulkDeleteTypes')
      error.value = apiError.getUserMessage()
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Reset store
  const reset = () => {
    accommodations.value = []
    accommodationTypes.value = []
    currentAccommodation.value = null
    currentAccommodationType.value = null
    availableAccommodations.value = []
    availabilityResults.value = []
    loading.value = false
    error.value = null
    clearAccommodationSelection()
    clearTypeSelection()
    clearError()
  }

  return {
    // State
    accommodations,
    accommodationTypes,
    currentAccommodation,
    currentAccommodationType,
    availableAccommodations,
    availabilityResults,
    loading,
    error,
    selectedAccommodationIds,
    selectedTypeIds,
    
    // Computed
    hasSelectedAccommodations,
    hasSelectedTypes,
    accommodationsByType,
    availableAccommodationsCount,
    occupiedAccommodationsCount,
    maintenanceAccommodationsCount,
    
    // Type Actions
    fetchAccommodationTypes,
    createAccommodationType,
    updateAccommodationType,
    deleteAccommodationType,
    
    // Accommodation Actions
    fetchAccommodations,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    
    // Availability Actions
    fetchAvailableAccommodations,
    checkAccommodationAvailability,
    batchCheckAvailability,
    findNextAvailableDate,
    
    // Helpers
    setCurrentAccommodation,
    setCurrentAccommodationType,
    toggleAccommodationSelection,
    toggleTypeSelection,
    selectAllAccommodations,
    selectAllTypes,
    clearAccommodationSelection,
    clearTypeSelection,
    bulkDeleteAccommodations,
    bulkDeleteTypes,
    reset,
  }
})