import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BookingService } from '../services/bookingService'
import {
  BookingStatus,
} from '../types/booking'
import type {
  Booking,
  BookingWithDetails,
  BookingCreate,
  BookingUpdate,
  BookingSetDates,
  BookingCheckIn,
  BookingCheckOut,
  BookingPayment,
  BookingListItem,
  BookingFilters,
  BookingSortOptions,
  BookingStats,
  BookingsSearchParams,
  BookingCreateOpenDates,
  CalendarEvent,
  CalendarStatistics,
} from '../types/booking'
import { useErrorHandler } from '../composables/useErrorHandler'

export const useBookingsStore = defineStore('bookings', () => {
  const { handleError, clearError } = useErrorHandler()
  
  // State
  const bookings = ref<BookingListItem[]>([])
  const currentBooking = ref<BookingWithDetails | null>(null)
  const stats = ref<BookingStats | null>(null)
  const calendarEvents = ref<CalendarEvent[]>([])
  const calendarStats = ref<CalendarStatistics | null>(null)
  const openDateBookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const total = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(20)
  
  // Filters and sorting
  const filters = ref<BookingFilters>({
    search: '',
    status: [],
    paymentStatus: [],
    accommodationId: undefined,
    clientId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    isOpenDates: undefined,
  })
  
  const sortOptions = ref<BookingSortOptions>({
    field: 'created_at',
    order: 'desc',
  })
  
  // Selected items for bulk operations
  const selectedBookingIds = ref<number[]>([])

  // Computed
  const hasSelectedBookings = computed(() => selectedBookingIds.value.length > 0)
  
  const totalPages = computed(() => Math.ceil(total.value / itemsPerPage.value))
  
  const filteredBookingsCount = computed(() => bookings.value.length)
  
  const pendingBookings = computed(() => 
    bookings.value.filter(b => b.status === BookingStatus.PENDING)
  )
  
  const todaysCheckInsCount = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.value.filter(b => 
      b.check_in_date === today && b.status === BookingStatus.CONFIRMED
    ).length
  })

  // Actions
  const fetchBookings = async (resetPagination = false) => {
    try {
      loading.value = true
      error.value = null
      
      if (resetPagination) {
        currentPage.value = 1
      }
      
      const params: BookingsSearchParams = {
        search: filters.value.search || undefined,
        status: filters.value.status.length ? filters.value.status : undefined,
        payment_status: filters.value.paymentStatus.length ? filters.value.paymentStatus : undefined,
        accommodation_id: filters.value.accommodationId,
        client_id: filters.value.clientId,
        date_from: filters.value.dateFrom,
        date_to: filters.value.dateTo,
        is_open_dates: filters.value.isOpenDates,
        skip: (currentPage.value - 1) * itemsPerPage.value,
        limit: itemsPerPage.value,
        sort_by: sortOptions.value.field,
        sort_order: sortOptions.value.order,
      }
      
      const data = await BookingService.getBookingsList(params)
      bookings.value = Array.isArray(data) ? data : []
      
      // For now, we'll use the length since our enhanced method returns an array
      // In a real implementation, you'd want to also get the total count from the original API response
      total.value = bookings.value.length
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch bookings'
      bookings.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchBooking = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      currentBooking.value = await BookingService.getBooking(id)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch booking'
      currentBooking.value = null
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (data: BookingCreate) => {
    try {
      loading.value = true
      error.value = null
      const booking = await BookingService.createBooking(data)
      await fetchBookings() // Refresh list
      return { success: true, data: booking }
    } catch (err: any) {
      error.value = err.message || 'Failed to create booking'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateBooking = async (id: number, data: BookingUpdate) => {
    try {
      loading.value = true
      error.value = null
      const booking = await BookingService.updateBooking(id, data)
      
      // Update current booking if it's the one being edited (need to fetch full details)
      if (currentBooking.value?.id === id) {
        await fetchBooking(id)
      }
      
      // Update in the list
      const index = bookings.value.findIndex(b => b.id === id)
      if (index !== -1) {
        // Convert full booking to list item format
        bookings.value[index] = {
          ...bookings.value[index],
          status: booking.status,
          payment_status: booking.payment_status,
          total_amount: booking.total_amount,
          paid_amount: booking.paid_amount,
          guests_count: booking.guests_count,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
        }
      }
      
      return { success: true, data: booking }
    } catch (err: any) {
      error.value = err.message || 'Failed to update booking'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteBooking = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await BookingService.deleteBooking(id)
      
      // Remove from list
      bookings.value = bookings.value.filter(b => b.id !== id)
      total.value = Math.max(0, total.value - 1)
      
      // Clear current booking if it was deleted
      if (currentBooking.value?.id === id) {
        currentBooking.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete booking'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Specialized operations
  const setBookingDates = async (id: number, data: BookingSetDates) => {
    try {
      loading.value = true
      error.value = null
      const booking = await BookingService.setBookingDates(id, data)
      
      if (currentBooking.value?.id === id) {
        await fetchBooking(id)
      }
      
      await fetchBookings() // Refresh to show updated data
      return { success: true, data: booking }
    } catch (err: any) {
      error.value = err.message || 'Failed to set booking dates'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const checkInBooking = async (id: number, data: BookingCheckIn) => {
    try {
      loading.value = true
      error.value = null
      const booking = await BookingService.checkInBooking(id, data)
      
      if (currentBooking.value?.id === id) {
        await fetchBooking(id)
      }
      
      await fetchBookings()
      return { success: true, data: booking }
    } catch (err: any) {
      error.value = err.message || 'Failed to check in booking'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const checkOutBooking = async (id: number, data: BookingCheckOut) => {
    try {
      loading.value = true
      error.value = null
      const booking = await BookingService.checkOutBooking(id, data)
      
      if (currentBooking.value?.id === id) {
        await fetchBooking(id)
      }
      
      await fetchBookings()
      return { success: true, data: booking }
    } catch (err: any) {
      error.value = err.message || 'Failed to check out booking'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const processPayment = async (id: number, data: BookingPayment) => {
    try {
      loading.value = true
      clearError()
      const booking = await BookingService.processPayment(id, data)
      
      if (currentBooking.value?.id === id) {
        await fetchBooking(id)
      }
      
      await fetchBookings()
      return { success: true, data: booking }
    } catch (err: any) {
      const apiError = handleError(err, 'processPayment')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (id: number, reason?: string) => {
    try {
      loading.value = true
      clearError()
      const booking = await BookingService.cancelBooking(id, { reason })
      
      if (currentBooking.value?.id === id) {
        await fetchBooking(id)
      }
      
      await fetchBookings()
      return { success: true, data: booking }
    } catch (err: any) {
      const apiError = handleError(err, 'cancelBooking')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  // Open dates booking operations
  const createOpenDateBooking = async (data: BookingCreateOpenDates) => {
    try {
      loading.value = true
      clearError()
      const booking = await BookingService.createOpenDateBooking(data)
      await fetchBookings()
      await fetchOpenDateBookings() // Refresh open dates list
      return { success: true, data: booking }
    } catch (err: any) {
      const apiError = handleError(err, 'createOpenDateBooking')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  const fetchOpenDateBookings = async (skip?: number, limit?: number) => {
    try {
      loading.value = true
      clearError()
      openDateBookings.value = await BookingService.getOpenDateBookings(skip, limit)
    } catch (err: any) {
      const apiError = handleError(err, 'fetchOpenDateBookings')
      openDateBookings.value = []
    } finally {
      loading.value = false
    }
  }

  // Calendar operations
  const fetchCalendarEvents = async (startDate: string, endDate: string) => {
    try {
      loading.value = true
      clearError()
      calendarEvents.value = await BookingService.getCalendarEvents(startDate, endDate)
    } catch (err: any) {
      const apiError = handleError(err, 'fetchCalendarEvents')
      calendarEvents.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchCalendarStatistics = async (startDate: string, endDate: string) => {
    try {
      loading.value = true
      clearError()
      calendarStats.value = await BookingService.getCalendarStatistics(startDate, endDate)
    } catch (err: any) {
      const apiError = handleError(err, 'fetchCalendarStatistics')
      calendarStats.value = null
    } finally {
      loading.value = false
    }
  }

  // Extended booking details
  const fetchBookingWithItems = async (id: number) => {
    try {
      loading.value = true
      clearError()
      currentBooking.value = await BookingService.getBookingWithItems(id)
    } catch (err: any) {
      const apiError = handleError(err, 'fetchBookingWithItems')
      currentBooking.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchBookingFullDetails = async (id: number) => {
    try {
      loading.value = true
      clearError()
      currentBooking.value = await BookingService.getBookingFullDetails(id)
    } catch (err: any) {
      const apiError = handleError(err, 'fetchBookingFullDetails')
      currentBooking.value = null
    } finally {
      loading.value = false
    }
  }

  // Stats
  const fetchStats = async (startDate?: string, endDate?: string) => {
    try {
      loading.value = true
      error.value = null
      stats.value = await BookingService.getBookingStats(startDate, endDate)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch booking stats'
      stats.value = null
    } finally {
      loading.value = false
    }
  }

  // Filter and sorting helpers
  const updateFilters = (newFilters: Partial<BookingFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchBookings(true) // Reset pagination when filtering
  }

  const updateSort = (field: BookingSortOptions['field'], order?: BookingSortOptions['order']) => {
    // Toggle order if same field is clicked
    if (sortOptions.value.field === field && !order) {
      order = sortOptions.value.order === 'asc' ? 'desc' : 'asc'
    }
    
    sortOptions.value = {
      field,
      order: order || 'asc',
    }
    
    fetchBookings(true)
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      status: [],
      paymentStatus: [],
      accommodationId: undefined,
      clientId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      isOpenDates: undefined,
    }
    fetchBookings(true)
  }

  // Pagination
  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchBookings()
    }
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1
    fetchBookings()
  }

  // Selection management
  const toggleBookingSelection = (id: number) => {
    const index = selectedBookingIds.value.indexOf(id)
    if (index >= 0) {
      selectedBookingIds.value.splice(index, 1)
    } else {
      selectedBookingIds.value.push(id)
    }
  }

  const selectAllBookings = () => {
    selectedBookingIds.value = bookings.value.map(b => b.id)
  }

  const clearSelection = () => {
    selectedBookingIds.value = []
  }

  // Bulk operations
  const bulkUpdateStatus = async (status: BookingStatus) => {
    if (selectedBookingIds.value.length === 0) return { success: false, error: 'No bookings selected' }
    
    try {
      loading.value = true
      error.value = null
      await BookingService.bulkUpdateStatus(selectedBookingIds.value, status)
      await fetchBookings()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to update booking status'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkDelete = async () => {
    if (selectedBookingIds.value.length === 0) return { success: false, error: 'No bookings selected' }
    
    try {
      loading.value = true
      error.value = null
      await BookingService.bulkDelete(selectedBookingIds.value)
      await fetchBookings()
      clearSelection()
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete bookings'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Inventory and Custom Items Management
  const addInventoryItemToBooking = async (
    bookingId: number,
    inventoryItemId: number,
    data: { quantity: number; notes?: string }
  ) => {
    try {
      loading.value = true
      clearError()
      const item = await BookingService.addInventoryItemToBooking(bookingId, inventoryItemId, data)
      
      // Refresh current booking if it's the one being updated
      if (currentBooking.value?.id === bookingId) {
        await fetchBookingWithItems(bookingId)
      }
      
      return { success: true, data: item }
    } catch (err: any) {
      const apiError = handleError(err, 'addInventoryItemToBooking')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  const addCustomItemToBooking = async (
    bookingId: number,
    customItemId: number,
    data: { quantity: number; unit_price?: number | string; notes?: string }
  ) => {
    try {
      loading.value = true
      clearError()
      const item = await BookingService.addCustomItemToBooking(bookingId, customItemId, data)
      
      // Refresh current booking if it's the one being updated
      if (currentBooking.value?.id === bookingId) {
        await fetchBookingWithItems(bookingId)
      }
      
      return { success: true, data: item }
    } catch (err: any) {
      const apiError = handleError(err, 'addCustomItemToBooking')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  const removeInventoryItemFromBooking = async (
    bookingId: number,
    inventoryItemId: number
  ) => {
    try {
      loading.value = true
      clearError()
      await BookingService.removeInventoryItemFromBooking(bookingId, inventoryItemId)
      
      // Refresh current booking if it's the one being updated
      if (currentBooking.value?.id === bookingId) {
        await fetchBookingWithItems(bookingId)
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'removeInventoryItemFromBooking')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  const removeCustomItemFromBooking = async (bookingCustomItemId: number, bookingId?: number) => {
    try {
      loading.value = true
      clearError()
      await BookingService.removeCustomItemFromBooking(bookingCustomItemId)
      
      // Refresh current booking if it's the one being updated
      if (bookingId && currentBooking.value?.id === bookingId) {
        await fetchBookingWithItems(bookingId)
      }
      
      return { success: true }
    } catch (err: any) {
      const apiError = handleError(err, 'removeCustomItemFromBooking')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  // Batch operations for creating bookings with items
  const createBookingWithItems = async (
    bookingData: BookingCreate,
    inventoryItems: { itemId: number; quantity: number; notes?: string }[] = [],
    customItems: { itemId: number; quantity: number; unitPrice?: number; notes?: string }[] = []
  ) => {
    try {
      loading.value = true
      clearError()
      
      // Create the booking first
      const bookingResult = await createBooking(bookingData)
      if (!bookingResult.success || !bookingResult.data) {
        return bookingResult
      }
      
      const booking = bookingResult.data
      
      // Add inventory items
      const inventoryPromises = inventoryItems.map(item =>
        BookingService.addInventoryItemToBooking(booking.id, item.itemId, {
          quantity: item.quantity,
          notes: item.notes
        })
      )
      
      // Add custom items
      const customPromises = customItems.map(item =>
        BookingService.addCustomItemToBooking(booking.id, item.itemId, {
          quantity: item.quantity,
          unit_price: item.unitPrice,
          notes: item.notes
        })
      )
      
      // Wait for all items to be added
      await Promise.all([...inventoryPromises, ...customPromises])
      
      // Fetch the complete booking with items
      const completeBooking = await BookingService.getBookingWithItems(booking.id)
      
      return { success: true, data: completeBooking }
    } catch (err: any) {
      const apiError = handleError(err, 'createBookingWithItems')
      return { success: false, error: apiError.getUserMessage() }
    } finally {
      loading.value = false
    }
  }

  // Availability checking for booking items
  const checkInventoryAvailability = async (
    itemIds: number[],
    startDate: string,
    endDate: string
  ) => {
    try {
      return await BookingService.getAvailableInventoryItemsByType(itemIds[0], startDate, endDate)
    } catch (err: any) {
      const apiError = handleError(err, 'checkInventoryAvailability')
      return []
    }
  }

  // Reset store
  const reset = () => {
    bookings.value = []
    currentBooking.value = null
    stats.value = null
    calendarEvents.value = []
    calendarStats.value = null
    openDateBookings.value = []
    loading.value = false
    error.value = null
    total.value = 0
    currentPage.value = 1
    clearSelection()
    clearFilters()
    clearError()
  }

  return {
    // State
    bookings,
    currentBooking,
    stats,
    calendarEvents,
    calendarStats,
    openDateBookings,
    loading,
    error,
    total,
    currentPage,
    itemsPerPage,
    filters,
    sortOptions,
    selectedBookingIds,
    
    // Computed
    hasSelectedBookings,
    totalPages,
    filteredBookingsCount,
    pendingBookings,
    todaysCheckInsCount,
    
    // Actions
    fetchBookings,
    fetchBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    setBookingDates,
    checkInBooking,
    checkOutBooking,
    processPayment,
    cancelBooking,
    createOpenDateBooking,
    fetchOpenDateBookings,
    fetchCalendarEvents,
    fetchCalendarStatistics,
    fetchBookingWithItems,
    fetchBookingFullDetails,
    fetchStats,
    updateFilters,
    updateSort,
    clearFilters,
    setPage,
    setItemsPerPage,
    toggleBookingSelection,
    selectAllBookings,
    clearSelection,
    bulkUpdateStatus,
    bulkDelete,
    
    // Inventory and Custom Items Management
    addInventoryItemToBooking,
    addCustomItemToBooking,
    removeInventoryItemFromBooking,
    removeCustomItemFromBooking,
    createBookingWithItems,
    checkInventoryAvailability,
    reset,
  }
})