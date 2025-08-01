import { ref, computed } from 'vue'
import { AvailabilityService } from '../services/availabilityService'
import type { AvailableAccommodation, AccommodationAvailabilityResponse } from '../services/availabilityService'
import { useErrorHandler } from './useErrorHandler'

/**
 * Composable for managing accommodation availability
 */
export function useAvailability() {
  const { executeWithErrorHandling, error, isLoading, clearError } = useErrorHandler()
  
  const availableAccommodations = ref<AvailableAccommodation[]>([])
  const availabilityChecks = ref<Map<string, AccommodationAvailabilityResponse>>(new Map())

  /**
   * Get available accommodations for date range
   */
  const getAvailableAccommodations = async (
    startDate: string,
    endDate: string,
    capacity?: number
  ) => {
    const result = await executeWithErrorHandling(
      () => AvailabilityService.getAvailableAccommodations(startDate, endDate, capacity),
      'getAvailableAccommodations'
    )
    
    if (result) {
      availableAccommodations.value = result
    }
    
    return result
  }

  /**
   * Check availability for specific accommodation
   */
  const checkAccommodationAvailability = async (
    accommodationId: number,
    startDate: string,
    endDate: string
  ) => {
    const result = await executeWithErrorHandling(
      () => AvailabilityService.checkAccommodationAvailability(accommodationId, startDate, endDate),
      'checkAccommodationAvailability'
    )
    
    if (result) {
      const key = `${accommodationId}-${startDate}-${endDate}`
      availabilityChecks.value.set(key, result)
    }
    
    return result
  }

  /**
   * Batch check availability for multiple accommodations
   */
  const batchCheckAvailability = async (
    accommodationIds: number[],
    startDate: string,
    endDate: string
  ) => {
    const result = await executeWithErrorHandling(
      () => AvailabilityService.batchCheckAvailability(accommodationIds, startDate, endDate),
      'batchCheckAvailability'
    )
    
    if (result) {
      result.forEach(availability => {
        const key = `${availability.accommodation_id}-${startDate}-${endDate}`
        availabilityChecks.value.set(key, availability)
      })
    }
    
    return result
  }

  /**
   * Find next available date for accommodation
   */
  const findNextAvailableDate = async (
    accommodationId: number,
    startDate: string,
    maxDaysToCheck: number = 30
  ) => {
    return await executeWithErrorHandling(
      () => AvailabilityService.findNextAvailableDate(accommodationId, startDate, maxDaysToCheck),
      'findNextAvailableDate'
    )
  }

  /**
   * Get cached availability check result
   */
  const getCachedAvailability = (
    accommodationId: number,
    startDate: string,
    endDate: string
  ): AccommodationAvailabilityResponse | undefined => {
    const key = `${accommodationId}-${startDate}-${endDate}`
    return availabilityChecks.value.get(key)
  }

  /**
   * Check if accommodation is available (from cache or API)
   */
  const isAccommodationAvailable = async (
    accommodationId: number,
    startDate: string,
    endDate: string
  ): Promise<boolean> => {
    // Check cache first
    const cached = getCachedAvailability(accommodationId, startDate, endDate)
    if (cached) {
      return cached.is_available
    }

    // Check via API
    const result = await checkAccommodationAvailability(accommodationId, startDate, endDate)
    return result?.is_available || false
  }

  /**
   * Clear all cached data
   */
  const clearCache = () => {
    availableAccommodations.value = []
    availabilityChecks.value.clear()
    clearError()
  }

  /**
   * Get accommodations filtered by availability
   */
  const getAvailableAccommodationsFiltered = computed(() => {
    return availableAccommodations.value.filter(acc => 
      acc.status === 'available' && acc.condition !== 'critical'
    )
  })

  /**
   * Get accommodations by capacity
   */
  const getAccommodationsByCapacity = (minCapacity: number) => {
    return availableAccommodations.value.filter(acc => acc.capacity >= minCapacity)
  }

  /**
   * Get accommodations by type
   */
  const getAccommodationsByType = (typeName: string) => {
    return availableAccommodations.value.filter(acc => 
      acc.type.name.toLowerCase().includes(typeName.toLowerCase())
    )
  }

  return {
    // State
    availableAccommodations,
    availabilityChecks,
    error,
    isLoading,

    // Actions
    getAvailableAccommodations,
    checkAccommodationAvailability,
    batchCheckAvailability,
    findNextAvailableDate,
    getCachedAvailability,
    isAccommodationAvailable,
    clearCache,

    // Getters
    getAvailableAccommodationsFiltered,
    getAccommodationsByCapacity,
    getAccommodationsByType,

    // Utilities
    clearError,
  }
}