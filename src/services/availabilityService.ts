import { apiClient } from '../api/client'

export interface AvailableAccommodation {
  id: number
  number: string
  type: {
    id: number
    name: string
    description?: string
    default_capacity: number
  }
  capacity: number
  price_per_night: string
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order'
  condition: 'ok' | 'minor' | 'critical'
  comments?: string
}

export interface AccommodationAvailabilityResponse {
  accommodation_id: number
  start_date: string
  end_date: string
  is_available: boolean
  conflicting_bookings?: Array<{
    id: number
    client_name: string
    check_in_date: string
    check_out_date: string
    status: string
  }>
  next_available_date?: string
}

export class AvailabilityService {
  /**
   * Get available accommodations for given dates
   */
  static async getAvailableAccommodations(
    startDate: string,
    endDate: string,
    capacity?: number,
  ): Promise<AvailableAccommodation[]> {
    const searchParams = new URLSearchParams()
    searchParams.append('start_date', startDate)
    searchParams.append('end_date', endDate)
    
    if (capacity !== undefined) {
      searchParams.append('capacity', capacity.toString())
    }

    const response = await apiClient.get(`/api/v1/bookings/availability/accommodations?${searchParams.toString()}`)
    return response.data
  }

  /**
   * Check if specific accommodation is available for given dates
   */
  static async checkAccommodationAvailability(
    accommodationId: number,
    startDate: string,
    endDate: string,
  ): Promise<AccommodationAvailabilityResponse> {
    const searchParams = new URLSearchParams()
    searchParams.append('accommodation_id', accommodationId.toString())
    searchParams.append('start_date', startDate)
    searchParams.append('end_date', endDate)

    const response = await apiClient.get(`/api/v1/bookings/availability/check?${searchParams.toString()}`)
    return response.data
  }

  /**
   * Batch check availability for multiple accommodations
   */
  static async batchCheckAvailability(
    accommodationIds: number[],
    startDate: string,
    endDate: string,
  ): Promise<AccommodationAvailabilityResponse[]> {
    const promises = accommodationIds.map(id =>
      this.checkAccommodationAvailability(id, startDate, endDate)
    )
    
    try {
      return await Promise.all(promises)
    } catch (error) {
      console.error('Error in batch availability check:', error)
      throw error
    }
  }

  /**
   * Find next available date for accommodation if not available in requested range
   */
  static async findNextAvailableDate(
    accommodationId: number,
    startDate: string,
    maxDaysToCheck: number = 30,
  ): Promise<string | null> {
    const startDateObj = new Date(startDate)
    
    for (let i = 0; i < maxDaysToCheck; i++) {
      const checkDate = new Date(startDateObj)
      checkDate.setDate(checkDate.getDate() + i)
      
      const nextDay = new Date(checkDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const availability = await this.checkAccommodationAvailability(
        accommodationId,
        checkDate.toISOString().split('T')[0],
        nextDay.toISOString().split('T')[0]
      )
      
      if (availability.is_available) {
        return checkDate.toISOString().split('T')[0]
      }
    }
    
    return null
  }
}