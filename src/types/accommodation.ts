export interface AccommodationType {
  id: number
  name: string
  description?: string
  default_capacity: number
  is_active: boolean
  created_at: string
}

export interface AccommodationTypeCreate {
  name: string
  description?: string
  default_capacity: number
  is_active?: boolean
}

export interface AccommodationTypeUpdate {
  name?: string
  description?: string
  default_capacity?: number
  is_active?: boolean
}

export enum AccommodationStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
}

export enum AccommodationCondition {
  OK = 'ok',
  MINOR_ISSUE = 'minor',
  CRITICAL = 'critical',
}

export interface Accommodation {
  id: number
  number: string
  type_id: number
  capacity: number
  price_per_night: string
  status: AccommodationStatus
  condition: AccommodationCondition
  comments?: string
  created_at: string
  type: AccommodationType
}

export interface AccommodationCreate {
  number: string
  type_id: number
  capacity: number
  price_per_night: number | string
  status?: AccommodationStatus
  condition?: AccommodationCondition
  comments?: string
}

export interface AccommodationUpdate {
  number?: string
  type_id?: number
  capacity?: number
  price_per_night?: number | string
  status?: AccommodationStatus
  condition?: AccommodationCondition
  comments?: string
}
