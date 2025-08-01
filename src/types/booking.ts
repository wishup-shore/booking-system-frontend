import type { Client } from './client'
import type { Accommodation } from './accommodation'
import type { BookingInventoryItemWithDetails, BookingCustomItemWithDetails, BookingInventoryItemCreate, BookingCustomItemCreate } from './inventory'

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  NOT_PAID = 'not_paid',
  PARTIAL = 'partial',
  PAID = 'paid',
}

// Basic booking model (from GET /api/v1/bookings/)
export interface Booking {
  id: number
  client_id: number
  accommodation_id: number
  check_in_date?: string // can be null for open dates
  check_out_date?: string // can be null for open dates
  is_open_dates: boolean
  actual_check_in?: string // DateTime for real check-in
  actual_check_out?: string // DateTime for real check-out
  guests_count: number
  status: BookingStatus
  payment_status: PaymentStatus
  total_amount: string
  paid_amount: string
  comments?: string
  created_at: string
  updated_at: string
}

// Extended booking model with relationships (from GET /api/v1/bookings/{booking_id})
export interface BookingWithDetails extends Booking {
  client: Client | null
  accommodation: Accommodation | null
  inventory_items?: BookingInventoryItemWithDetails[]
  custom_items?: BookingCustomItemWithDetails[]
}

export interface BookingCreate {
  client_id: number
  accommodation_id: number
  check_in_date?: string
  check_out_date?: string
  is_open_dates: boolean
  guests_count: number
  status?: BookingStatus
  payment_status?: PaymentStatus
  total_amount: number | string
  paid_amount?: number | string
  comments?: string
  inventory_items?: BookingInventoryItemCreate[]
  custom_items?: BookingCustomItemCreate[]
}

export interface BookingUpdate {
  client_id?: number
  accommodation_id?: number
  check_in_date?: string
  check_out_date?: string
  is_open_dates?: boolean
  guests_count?: number
  status?: BookingStatus
  payment_status?: PaymentStatus
  total_amount?: number | string
  paid_amount?: number | string
  comments?: string
  inventory_items?: BookingInventoryItemCreate[]
  custom_items?: BookingCustomItemCreate[]
}

export interface BookingSetDates {
  check_in_date: string
  check_out_date: string
}

export interface BookingCheckIn {
  actual_check_in: string
  guests_count?: number
  comments?: string
}

export interface BookingCheckOut {
  actual_check_out: string
  comments?: string
}

export interface BookingPayment {
  amount: number
  payment_method?: string
  notes?: string
}

export interface BookingCalendarData {
  accommodation_id: number
  accommodation_number: string
  bookings: {
    id: number
    client_name: string
    check_in_date: string
    check_out_date: string
    status: BookingStatus
    guests_count: number
  }[]
}

// New calendar types from OpenAPI spec
export interface CalendarEvent {
  id: number
  title: string
  start: string
  end?: string | null
  accommodation_id: number
  accommodation_number: string
  client_name: string
  status: BookingStatus
  is_open_dates: boolean
}

export interface CalendarOccupancy {
  date: string
  accommodations: Array<{
    accommodation_id: number
    accommodation_number: string
    status: 'available' | 'occupied' | 'maintenance' | 'out_of_order'
    booking?: {
      id: number
      client_name: string
      status: BookingStatus
      is_open_dates: boolean
    }
  }>
}

export interface CalendarStatistics {
  total_accommodations: number
  total_bookings: number
  occupied_nights: number
  available_nights: number
  occupancy_rate: number
  total_revenue: string
  average_daily_rate: string
  revenue_per_available_room: string
  period_start: string
  period_end: string
}

export interface BookingCreateOpenDates {
  client_id: number
  accommodation_id: number
  guests_count: number
  status?: BookingStatus
  payment_status?: PaymentStatus
  total_amount: number | string
  paid_amount?: number | string
  comments?: string
  inventory_items?: BookingInventoryItemCreate[]
  custom_items?: BookingCustomItemCreate[]
}

export interface BookingsListResponse {
  bookings: Booking[]
  total: number
  skip: number
  limit: number
}

export interface BookingsSearchParams {
  search?: string
  status?: BookingStatus[]
  payment_status?: PaymentStatus[]
  accommodation_id?: number
  client_id?: number
  date_from?: string
  date_to?: string
  is_open_dates?: boolean
  skip?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Filter and UI state types
export interface BookingFilters {
  search: string
  status: BookingStatus[]
  paymentStatus: PaymentStatus[]
  accommodationId?: number
  clientId?: number
  dateFrom?: string
  dateTo?: string
  isOpenDates?: boolean
}

export interface BookingSortOptions {
  field:
    | 'created_at'
    | 'check_in_date'
    | 'check_out_date'
    | 'total_amount'
    | 'client_name'
    | 'accommodation_number'
  order: 'asc' | 'desc'
}

// Quick stats for dashboard/overview
export interface BookingStats {
  total_bookings: number
  pending_bookings: number
  confirmed_bookings: number
  checked_in_bookings: number
  todays_checkins: number
  todays_checkouts: number
  total_revenue: number
  pending_payments: number
}

// Booking list item for optimized display - this should be derived from API response
export interface BookingListItem {
  id: number
  client_id: number
  accommodation_id: number
  client_name?: string // Will be populated by frontend logic or API enhancement
  client_phone?: string // Will be populated by frontend logic or API enhancement
  accommodation_number?: string // Will be populated by frontend logic or API enhancement
  accommodation_type?: string // Will be populated by frontend logic or API enhancement
  check_in_date?: string
  check_out_date?: string
  is_open_dates: boolean
  guests_count: number
  status: BookingStatus
  payment_status: PaymentStatus
  total_amount: string
  paid_amount: string
  created_at: string
}
