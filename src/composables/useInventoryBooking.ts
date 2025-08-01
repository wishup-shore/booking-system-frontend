import { ref, computed } from 'vue'
import { useInventoryItemsStore } from '../stores/inventoryItems'
import { useCustomItemsStore } from '../stores/customItems'
import { useBookingsStore } from '../stores/bookings'
import { useErrorHandler } from './useErrorHandler'
import type { InventoryItemWithType, CustomItem } from '../types/inventory'

export interface InventorySelection {
  itemId: number
  quantity: number
  notes?: string
}

export interface CustomItemSelection {
  itemId: number
  quantity: number
  unitPrice?: number
  notes?: string
}

export interface BookingItemsValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function useInventoryBooking() {
  const inventoryItemsStore = useInventoryItemsStore()
  const customItemsStore = useCustomItemsStore()
  const bookingsStore = useBookingsStore()
  const { handleError, clearError } = useErrorHandler()

  const loading = ref(false)
  const validationErrors = ref<string[]>([])
  const validationWarnings = ref<string[]>([])

  // Computed
  const isLoading = computed(() => loading.value)
  const hasValidationErrors = computed(() => validationErrors.value.length > 0)
  const hasValidationWarnings = computed(() => validationWarnings.value.length > 0)

  // Validation Methods
  const validateInventorySelection = async (
    selections: InventorySelection[],
    bookingDates?: { startDate: string; endDate: string }
  ): Promise<BookingItemsValidation> => {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic validation
    for (const selection of selections) {
      if (selection.quantity <= 0) {
        errors.push(`Invalid quantity for item ${selection.itemId}. Quantity must be greater than 0.`)
      }
      
      if (selection.quantity > 100) {
        warnings.push(`High quantity (${selection.quantity}) selected for item ${selection.itemId}.`)
      }
    }

    // Availability validation if booking dates are provided
    if (bookingDates && selections.length > 0) {
      try {
        const itemIds = selections.map(s => s.itemId)
        const availability = await inventoryItemsStore.checkItemsAvailability(
          itemIds,
          bookingDates.startDate,
          bookingDates.endDate
        )

        for (const selection of selections) {
          if (availability[selection.itemId] === false) {
            errors.push(`Item ${selection.itemId} is not available for the selected dates.`)
          }
        }
      } catch (error) {
        warnings.push('Could not verify item availability. Items may not be available for the selected dates.')
      }
    }

    // Check for duplicate selections
    const itemIds = selections.map(s => s.itemId)
    const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index)
    if (duplicates.length > 0) {
      errors.push('Duplicate items selected. Each item can only be selected once.')
    }

    validationErrors.value = errors
    validationWarnings.value = warnings

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  const validateCustomItemsSelection = (selections: CustomItemSelection[]): BookingItemsValidation => {
    const errors: string[] = []
    const warnings: string[] = []

    for (const selection of selections) {
      // Quantity validation
      if (selection.quantity <= 0) {
        errors.push(`Invalid quantity for custom item ${selection.itemId}. Quantity must be greater than 0.`)
      }

      if (selection.quantity > 1000) {
        warnings.push(`Very high quantity (${selection.quantity}) selected for custom item ${selection.itemId}.`)
      }

      // Price validation
      if (selection.unitPrice !== undefined && selection.unitPrice < 0) {
        errors.push(`Invalid unit price for custom item ${selection.itemId}. Price cannot be negative.`)
      }

      if (selection.unitPrice !== undefined && selection.unitPrice > 10000) {
        warnings.push(`High unit price ($${selection.unitPrice}) for custom item ${selection.itemId}.`)
      }
    }

    // Check for duplicate selections
    const itemIds = selections.map(s => s.itemId)
    const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index)
    if (duplicates.length > 0) {
      errors.push('Duplicate custom items selected. Each item can only be selected once.')
    }

    validationErrors.value = errors
    validationWarnings.value = warnings

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // Availability Checking
  const checkItemAvailability = async (
    itemId: number,
    startDate: string,
    endDate: string
  ): Promise<boolean> => {
    try {
      const availability = await inventoryItemsStore.checkItemsAvailability([itemId], startDate, endDate)
      return availability[itemId] || false
    } catch (error) {
      handleError(error, 'checkItemAvailability')
      return false
    }
  }

  const checkMultipleItemsAvailability = async (
    itemIds: number[],
    startDate: string,
    endDate: string
  ): Promise<{ [itemId: number]: boolean }> => {
    try {
      return await inventoryItemsStore.checkItemsAvailability(itemIds, startDate, endDate)
    } catch (error) {
      handleError(error, 'checkMultipleItemsAvailability')
      return itemIds.reduce((acc, id) => ({ ...acc, [id]: false }), {})
    }
  }

  // Booking Operations
  const addInventoryItemsToBooking = async (
    bookingId: number,
    selections: InventorySelection[]
  ): Promise<{ success: boolean; errors?: string[] }> => {
    loading.value = true
    clearError()

    try {
      const validation = await validateInventorySelection(selections)
      if (!validation.isValid) {
        return { success: false, errors: validation.errors }
      }

      const results = await Promise.allSettled(
        selections.map(selection =>
          bookingsStore.addInventoryItemToBooking(bookingId, selection.itemId, {
            quantity: selection.quantity,
            notes: selection.notes
          })
        )
      )

      const failedResults = results.filter(result => result.status === 'rejected') as PromiseRejectedResult[]
      
      if (failedResults.length > 0) {
        const errors = failedResults.map(result => result.reason?.message || 'Unknown error')
        return { success: false, errors }
      }

      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'addInventoryItemsToBooking')
      return { success: false, errors: [apiError.getUserMessage()] }
    } finally {
      loading.value = false
    }
  }

  const addCustomItemsToBooking = async (
    bookingId: number,
    selections: CustomItemSelection[]
  ): Promise<{ success: boolean; errors?: string[] }> => {
    loading.value = true
    clearError()

    try {
      const validation = validateCustomItemsSelection(selections)
      if (!validation.isValid) {
        return { success: false, errors: validation.errors }
      }

      const results = await Promise.allSettled(
        selections.map(selection =>
          bookingsStore.addCustomItemToBooking(bookingId, selection.itemId, {
            quantity: selection.quantity,
            unit_price: selection.unitPrice,
            notes: selection.notes
          })
        )
      )

      const failedResults = results.filter(result => result.status === 'rejected') as PromiseRejectedResult[]
      
      if (failedResults.length > 0) {
        const errors = failedResults.map(result => result.reason?.message || 'Unknown error')
        return { success: false, errors }
      }

      return { success: true }
    } catch (error) {
      const apiError = handleError(error, 'addCustomItemsToBooking')
      return { success: false, errors: [apiError.getUserMessage()] }
    } finally {
      loading.value = false
    }
  }

  // Utility Methods
  const calculateCustomItemsTotal = (selections: CustomItemSelection[]): number => {
    return selections.reduce((total, selection) => {
      const unitPrice = selection.unitPrice || 0
      return total + (unitPrice * selection.quantity)
    }, 0)
  }

  const getInventoryItemDetails = (itemId: number): InventoryItemWithType | undefined => {
    return inventoryItemsStore.inventoryItems.find(item => item.id === itemId)
  }

  const getCustomItemDetails = (itemId: number): CustomItem | undefined => {
    return customItemsStore.customItems.find(item => item.id === itemId)
  }

  const clearValidation = () => {
    validationErrors.value = []
    validationWarnings.value = []
  }

  return {
    // State
    isLoading,
    validationErrors: computed(() => validationErrors.value),
    validationWarnings: computed(() => validationWarnings.value),
    hasValidationErrors,
    hasValidationWarnings,

    // Validation
    validateInventorySelection,
    validateCustomItemsSelection,
    clearValidation,

    // Availability
    checkItemAvailability,
    checkMultipleItemsAvailability,

    // Booking Operations
    addInventoryItemsToBooking,
    addCustomItemsToBooking,

    // Utilities
    calculateCustomItemsTotal,
    getInventoryItemDetails,
    getCustomItemDetails
  }
}