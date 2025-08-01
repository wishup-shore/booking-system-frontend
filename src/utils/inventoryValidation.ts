import type { InventoryItemWithType, CustomItem } from '../types/inventory'

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export interface ValidationRule<T> {
  (value: T, context?: any): ValidationResult
}

// Inventory Item Validation Rules
export const inventoryValidationRules = {
  quantity: (quantity: number): ValidationResult => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { isValid: false, message: 'Quantity must be a positive integer' }
    }
    if (quantity > 100) {
      return { isValid: false, message: 'Quantity cannot exceed 100 items' }
    }
    return { isValid: true }
  },

  availability: (
    item: InventoryItemWithType,
    dateRange?: { startDate: string; endDate: string }
  ): ValidationResult => {
    if (!item.is_active) {
      return { isValid: false, message: 'This inventory item is not active' }
    }
    
    if (item.condition === 'critical') {
      return { isValid: false, message: 'This item has critical issues and cannot be booked' }
    }

    return { isValid: true }
  },

  notes: (notes?: string): ValidationResult => {
    if (notes && notes.length > 500) {
      return { isValid: false, message: 'Notes cannot exceed 500 characters' }
    }
    return { isValid: true }
  }
}

// Custom Item Validation Rules
export const customItemValidationRules = {
  quantity: (quantity: number): ValidationResult => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { isValid: false, message: 'Quantity must be a positive integer' }
    }
    if (quantity > 1000) {
      return { isValid: false, message: 'Quantity cannot exceed 1000 items' }
    }
    return { isValid: true }
  },

  unitPrice: (unitPrice: number, defaultPrice?: number): ValidationResult => {
    if (unitPrice < 0) {
      return { isValid: false, message: 'Unit price cannot be negative' }
    }
    if (unitPrice > 50000) {
      return { isValid: false, message: 'Unit price cannot exceed $50,000' }
    }
    if (defaultPrice && Math.abs(unitPrice - defaultPrice) / defaultPrice > 0.5) {
      return { 
        isValid: true, 
        message: 'Unit price differs significantly from the default price' 
      }
    }
    return { isValid: true }
  },

  availability: (item: CustomItem): ValidationResult => {
    if (!item.is_active) {
      return { isValid: false, message: 'This custom item is not active' }
    }
    return { isValid: true }
  },

  notes: (notes?: string): ValidationResult => {
    if (notes && notes.length > 500) {
      return { isValid: false, message: 'Notes cannot exceed 500 characters' }
    }
    return { isValid: true }
  }
}

// Booking Context Validation
export const bookingContextValidation = {
  dateRange: (startDate: string, endDate: string): ValidationResult => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()

    if (start >= end) {
      return { isValid: false, message: 'End date must be after start date' }
    }

    if (start < now && Math.abs(start.getTime() - now.getTime()) > 24 * 60 * 60 * 1000) {
      return { isValid: false, message: 'Cannot book items for past dates' }
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays > 365) {
      return { isValid: false, message: 'Booking period cannot exceed 365 days' }
    }

    return { isValid: true }
  },

  conflictCheck: (
    selectedItems: { itemId: number; quantity: number }[],
    existingBookings?: any[]
  ): ValidationResult => {
    // Check for duplicate item IDs in selection
    const itemIds = selectedItems.map(item => item.itemId)
    const duplicates = itemIds.filter((id, index) => itemIds.indexOf(id) !== index)
    
    if (duplicates.length > 0) {
      return { 
        isValid: false, 
        message: `Duplicate items detected: ${duplicates.join(', ')}` 
      }
    }

    // Check total quantity limits
    const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
    if (totalItems > 50) {
      return { 
        isValid: false, 
        message: 'Total number of items cannot exceed 50 per booking' 
      }
    }

    return { isValid: true }
  }
}

// Composite Validation Functions
export function validateInventoryBookingSelection(
  items: {
    item: InventoryItemWithType
    quantity: number
    notes?: string
  }[],
  dateRange?: { startDate: string; endDate: string }
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate date range if provided
  if (dateRange) {
    const dateValidation = bookingContextValidation.dateRange(dateRange.startDate, dateRange.endDate)
    if (!dateValidation.isValid && dateValidation.message) {
      errors.push(dateValidation.message)
    }
  }

  // Validate conflict check
  const conflictValidation = bookingContextValidation.conflictCheck(
    items.map(item => ({ itemId: item.item.id, quantity: item.quantity }))
  )
  if (!conflictValidation.isValid && conflictValidation.message) {
    errors.push(conflictValidation.message)
  }

  // Validate each item
  items.forEach((selection, index) => {
    const { item, quantity, notes } = selection

    // Quantity validation
    const quantityValidation = inventoryValidationRules.quantity(quantity)
    if (!quantityValidation.isValid && quantityValidation.message) {
      errors.push(`Item ${index + 1}: ${quantityValidation.message}`)
    }

    // Availability validation
    const availabilityValidation = inventoryValidationRules.availability(item, dateRange)
    if (!availabilityValidation.isValid && availabilityValidation.message) {
      errors.push(`Item ${index + 1} (${item.number}): ${availabilityValidation.message}`)
    } else if (item.condition === 'minor_issue') {
      warnings.push(`Item ${index + 1} (${item.number}) has minor issues`)
    }

    // Notes validation
    const notesValidation = inventoryValidationRules.notes(notes)
    if (!notesValidation.isValid && notesValidation.message) {
      errors.push(`Item ${index + 1}: ${notesValidation.message}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateCustomItemBookingSelection(
  items: {
    item: CustomItem
    quantity: number
    unitPrice?: number
    notes?: string
  }[]
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate conflict check
  const conflictValidation = bookingContextValidation.conflictCheck(
    items.map(item => ({ itemId: item.item.id, quantity: item.quantity }))
  )
  if (!conflictValidation.isValid && conflictValidation.message) {
    errors.push(conflictValidation.message)
  }

  // Calculate total amount and check limits
  const totalAmount = items.reduce((sum, item) => {
    const price = item.unitPrice || item.item.price
    return sum + (price * item.quantity)
  }, 0)

  if (totalAmount > 100000) {
    errors.push('Total custom items amount cannot exceed $100,000')
  } else if (totalAmount > 10000) {
    warnings.push('High total amount for custom items')
  }

  // Validate each item
  items.forEach((selection, index) => {
    const { item, quantity, unitPrice, notes } = selection

    // Quantity validation
    const quantityValidation = customItemValidationRules.quantity(quantity)
    if (!quantityValidation.isValid && quantityValidation.message) {
      errors.push(`Custom item ${index + 1}: ${quantityValidation.message}`)
    }

    // Unit price validation
    if (unitPrice !== undefined) {
      const priceValidation = customItemValidationRules.unitPrice(unitPrice, item.price)
      if (!priceValidation.isValid && priceValidation.message) {
        errors.push(`Custom item ${index + 1} (${item.name}): ${priceValidation.message}`)
      } else if (priceValidation.message) {
        warnings.push(`Custom item ${index + 1} (${item.name}): ${priceValidation.message}`)
      }
    }

    // Availability validation
    const availabilityValidation = customItemValidationRules.availability(item)
    if (!availabilityValidation.isValid && availabilityValidation.message) {
      errors.push(`Custom item ${index + 1} (${item.name}): ${availabilityValidation.message}`)
    }

    // Notes validation
    const notesValidation = customItemValidationRules.notes(notes)
    if (!notesValidation.isValid && notesValidation.message) {
      errors.push(`Custom item ${index + 1}: ${notesValidation.message}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Helper function to format validation messages for display
export function formatValidationMessages(
  errors: string[],
  warnings: string[]
): { errorMessage?: string; warningMessage?: string } {
  const errorMessage = errors.length > 0 
    ? errors.length === 1
      ? errors[0]
      : `Multiple errors found:\n• ${errors.join('\n• ')}`
    : undefined

  const warningMessage = warnings.length > 0
    ? warnings.length === 1
      ? warnings[0]
      : `Warnings:\n• ${warnings.join('\n• ')}`
    : undefined

  return { errorMessage, warningMessage }
}