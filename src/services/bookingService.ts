import { apiClient } from '../api/client'
import type { Client } from '../types/client'
import type { Accommodation } from '../types/accommodation'
import type { BookingInventoryItemWithDetails, BookingCustomItemWithDetails, InventoryItemWithType } from '../types/inventory'
import type {
  Booking,
  BookingWithDetails,
  BookingCreate,
  BookingUpdate,
  BookingSetDates,
  BookingCheckIn,
  BookingCheckOut,
  BookingPayment,
  BookingsListResponse,
  BookingsSearchParams,
  BookingStats,
  BookingListItem,
  CalendarEvent,
  CalendarOccupancy,
  CalendarStatistics,
  BookingCreateOpenDates,
} from '../types/booking'

export class BookingService {
  // Main CRUD operations
  static async getBookings(params?: BookingsSearchParams): Promise<BookingsListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.search) {
      searchParams.append('search', params.search)
    }
    if (params?.status?.length) {
      params.status.forEach((status) => searchParams.append('status', status))
    }
    if (params?.payment_status?.length) {
      params.payment_status.forEach((status) => searchParams.append('payment_status', status))
    }
    if (params?.accommodation_id) {
      searchParams.append('accommodation_id', params.accommodation_id.toString())
    }
    if (params?.client_id) {
      searchParams.append('client_id', params.client_id.toString())
    }
    if (params?.date_from) {
      searchParams.append('date_from', params.date_from)
    }
    if (params?.date_to) {
      searchParams.append('date_to', params.date_to)
    }
    if (params?.is_open_dates !== undefined) {
      searchParams.append('is_open_dates', params.is_open_dates.toString())
    }
    if (params?.skip !== undefined) {
      searchParams.append('skip', params.skip.toString())
    }
    if (params?.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    }
    if (params?.sort_by) {
      searchParams.append('sort_by', params.sort_by)
    }
    if (params?.sort_order) {
      searchParams.append('sort_order', params.sort_order)
    }

    const queryString = searchParams.toString()
    const url = `/api/v1/bookings/${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async getBooking(bookingId: number): Promise<BookingWithDetails> {
    const response = await apiClient.get(`/api/v1/bookings/${bookingId}`)
    return response.data
  }

  static async createBooking(data: BookingCreate): Promise<Booking> {
    const response = await apiClient.post('/api/v1/bookings/', data)
    return response.data
  }

  static async updateBooking(bookingId: number, data: BookingUpdate): Promise<Booking> {
    const response = await apiClient.put(`/api/v1/bookings/${bookingId}`, data)
    return response.data
  }

  static async deleteBooking(bookingId: number): Promise<void> {
    await apiClient.delete(`/api/v1/bookings/${bookingId}`)
  }

  // Specialized operations
  static async createOpenDateBooking(data: BookingCreateOpenDates): Promise<Booking> {
    const response = await apiClient.post('/api/v1/bookings/open-dates', data)
    return response.data
  }

  static async getOpenDateBookings(skip?: number, limit?: number): Promise<Booking[]> {
    const searchParams = new URLSearchParams()
    if (skip !== undefined) {
      searchParams.append('skip', skip.toString())
    }
    if (limit !== undefined) {
      searchParams.append('limit', limit.toString())
    }

    const queryString = searchParams.toString()
    const url = `/api/v1/bookings/open${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async setBookingDates(bookingId: number, data: BookingSetDates): Promise<Booking> {
    const response = await apiClient.put(`/api/v1/bookings/${bookingId}/set-dates`, data)
    return response.data
  }

  static async checkInBooking(bookingId: number, data: BookingCheckIn): Promise<Booking> {
    const response = await apiClient.post(`/api/v1/bookings/${bookingId}/checkin`, data)
    return response.data
  }

  static async checkOutBooking(bookingId: number, data: BookingCheckOut): Promise<Booking> {
    const response = await apiClient.post(`/api/v1/bookings/${bookingId}/checkout`, data)
    return response.data
  }

  static async processPayment(bookingId: number, data: BookingPayment): Promise<Booking> {
    const response = await apiClient.post(`/api/v1/bookings/${bookingId}/payment`, data)
    return response.data
  }

  static async cancelBooking(bookingId: number, data?: { reason?: string }): Promise<Booking> {
    const response = await apiClient.post(`/api/v1/bookings/${bookingId}/cancel`, data || {})
    return response.data
  }

  // Extended booking details
  static async getBookingWithItems(bookingId: number): Promise<BookingWithDetails> {
    const response = await apiClient.get(`/api/v1/bookings/${bookingId}/with-items`)
    return response.data
  }

  static async getBookingFullDetails(bookingId: number): Promise<BookingWithDetails> {
    const response = await apiClient.get(`/api/v1/bookings/${bookingId}/full-details`)
    return response.data
  }

  // Inventory and custom items management
  static async addInventoryItemToBooking(
    bookingId: number,
    inventoryItemId: number,
    data: { quantity: number; notes?: string }
  ): Promise<BookingInventoryItemWithDetails> {
    const response = await apiClient.post(
      `/api/v1/bookings/${bookingId}/inventory/${inventoryItemId}`,
      data
    )
    return response.data
  }

  static async addCustomItemToBooking(
    bookingId: number,
    customItemId: number,
    data: { quantity: number; unit_price?: number | string; notes?: string }
  ): Promise<BookingCustomItemWithDetails> {
    const response = await apiClient.post(
      `/api/v1/bookings/${bookingId}/custom-items/${customItemId}`,
      data
    )
    return response.data
  }

  static async removeInventoryItemFromBooking(
    bookingId: number,
    inventoryItemId: number
  ): Promise<void> {
    await apiClient.delete(`/api/v1/bookings/${bookingId}/inventory/${inventoryItemId}`)
  }

  static async removeCustomItemFromBooking(
    bookingCustomItemId: number
  ): Promise<void> {
    await apiClient.delete(`/api/v1/bookings/custom-items/${bookingCustomItemId}`)
  }

  static async getAvailableInventoryItemsByType(
    typeId: number,
    startDate?: string,
    endDate?: string
  ): Promise<InventoryItemWithType[]> {
    const searchParams = new URLSearchParams()
    if (startDate) searchParams.append('start_date', startDate)
    if (endDate) searchParams.append('end_date', endDate)
    
    const queryString = searchParams.toString()
    const url = `/api/v1/inventory-items/by-type/${typeId}/available${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get(url)
    return response.data
  }

  // Calendar and analytics
  static async getCalendarEvents(
    startDate: string,
    endDate: string,
  ): Promise<CalendarEvent[]> {
    const searchParams = new URLSearchParams()
    searchParams.append('start_date', startDate)
    searchParams.append('end_date', endDate)

    const queryString = searchParams.toString()
    const url = `/api/v1/bookings/calendar/events?${queryString}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async getCalendarOccupancy(
    startDate: string,
    endDate: string,
  ): Promise<CalendarOccupancy[]> {
    const searchParams = new URLSearchParams()
    searchParams.append('start_date', startDate)
    searchParams.append('end_date', endDate)

    const queryString = searchParams.toString()
    const url = `/api/v1/bookings/calendar/occupancy?${queryString}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async getMonthlyOccupancy(
    year: number,
    month: number,
  ): Promise<CalendarOccupancy[]> {
    const response = await apiClient.get(`/api/v1/bookings/calendar/occupancy/${year}/${month}`)
    return response.data
  }

  static async getCalendarStatistics(
    startDate: string,
    endDate: string,
  ): Promise<CalendarStatistics> {
    const searchParams = new URLSearchParams()
    searchParams.append('start_date', startDate)
    searchParams.append('end_date', endDate)

    const queryString = searchParams.toString()
    const url = `/api/v1/bookings/calendar/statistics?${queryString}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async getBookingStats(startDate?: string, endDate?: string): Promise<BookingStats> {
    const searchParams = new URLSearchParams()
    if (startDate) {
      searchParams.append('start_date', startDate)
    }
    if (endDate) {
      searchParams.append('end_date', endDate)
    }

    const queryString = searchParams.toString()
    const url = `/api/v1/bookings/statistics${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    return response.data
  }

  // Enhanced list for display - enriches basic booking data with client and accommodation info
  static async getBookingsList(params?: BookingsSearchParams): Promise<BookingListItem[]> {
    // First get the basic bookings
    const bookingsResponse = await this.getBookings(params)
    const bookings = Array.isArray(bookingsResponse) ? bookingsResponse : bookingsResponse.bookings || []
    
    if (bookings.length === 0) {
      return []
    }

    // Get unique client and accommodation IDs
    const clientIds = [...new Set(bookings.map(b => b.client_id))]
    const accommodationIds = [...new Set(bookings.map(b => b.accommodation_id))]

    // Fetch clients and accommodations in parallel (we'll import these at the top)
    const [clientsData, accommodationsData] = await Promise.all([
      this.fetchClientsMap(clientIds),
      this.fetchAccommodationsMap(accommodationIds)
    ])

    // Enhance bookings with client and accommodation information
    return bookings.map((booking): BookingListItem => ({
      ...booking,
      client_name: clientsData[booking.client_id]?.first_name && clientsData[booking.client_id]?.last_name 
        ? `${clientsData[booking.client_id].first_name} ${clientsData[booking.client_id].last_name}`.trim()
        : undefined,
      client_phone: clientsData[booking.client_id]?.phone || undefined,
      accommodation_number: accommodationsData[booking.accommodation_id]?.number || undefined,
      accommodation_type: accommodationsData[booking.accommodation_id]?.type?.name || undefined,
    }))
  }

  // Helper method to fetch clients and create a map
  private static async fetchClientsMap(clientIds: number[]): Promise<Record<number, Client>> {
    if (clientIds.length === 0) return {}
    
    try {
      // For now, we'll fetch clients individually since we don't have a batch endpoint
      // In production, this should be optimized with a batch endpoint
      const clientPromises = clientIds.map(id => 
        apiClient.get(`/api/v1/clients/${id}`).catch(() => null)
      )
      const clientResponses = await Promise.all(clientPromises)
      
      const clientsMap: Record<number, Client> = {}
      clientResponses.forEach((response, index) => {
        if (response?.data) {
          clientsMap[clientIds[index]] = response.data
        }
      })
      
      return clientsMap
    } catch (error) {
      console.warn('Failed to fetch clients for booking list:', error)
      return {}
    }
  }

  // Helper method to fetch accommodations and create a map
  private static async fetchAccommodationsMap(accommodationIds: number[]): Promise<Record<number, Accommodation>> {
    if (accommodationIds.length === 0) return {}
    
    try {
      // Fetch all accommodations and filter to what we need
      const response = await apiClient.get('/api/v1/accommodations/')
      const allAccommodations = response.data || []
      
      const accommodationsMap: Record<number, Accommodation> = {}
      allAccommodations.forEach((accommodation: Accommodation) => {
        if (accommodationIds.includes(accommodation.id)) {
          accommodationsMap[accommodation.id] = accommodation
        }
      })
      
      return accommodationsMap
    } catch (error) {
      console.warn('Failed to fetch accommodations for booking list:', error)
      return {}
    }
  }

  // Today's operations - useful for dashboard
  static async getTodaysCheckIns(): Promise<Booking[]> {
    const today = new Date().toISOString().split('T')[0]
    const response = await apiClient.get(`/api/v1/bookings/checkins/${today}`)
    return response.data
  }

  static async getTodaysCheckOuts(): Promise<Booking[]> {
    const today = new Date().toISOString().split('T')[0]
    const response = await apiClient.get(`/api/v1/bookings/checkouts/${today}`)
    return response.data
  }

  // Bulk operations
  static async bulkUpdateStatus(bookingIds: number[], status: string): Promise<void> {
    await apiClient.post('/api/v1/bookings/bulk/status', {
      booking_ids: bookingIds,
      status,
    })
  }

  static async bulkDelete(bookingIds: number[]): Promise<void> {
    await apiClient.post('/api/v1/bookings/bulk/delete', {
      booking_ids: bookingIds,
    })
  }
}
