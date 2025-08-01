// Inventory condition states - matching API enum values
export enum InventoryCondition {
  OK = 'ok',
  MINOR_ISSUE = 'minor',
  CRITICAL = 'critical',
}

// Inventory Type model
export interface InventoryType {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InventoryTypeCreate {
  name: string
  description?: string
  is_active?: boolean
}

export interface InventoryTypeUpdate {
  name?: string
  description?: string
  is_active?: boolean
}

// Inventory Item model
export interface InventoryItem {
  id: number
  type_id: number
  number: string
  condition: InventoryCondition
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Inventory Item with type relationship
export interface InventoryItemWithType extends InventoryItem {
  inventory_type: InventoryType | null
}

export interface InventoryItemCreate {
  type_id: number
  number: string
  condition: InventoryCondition
  notes?: string
  is_active?: boolean
}

export interface InventoryItemUpdate {
  type_id?: number
  number?: string
  condition?: InventoryCondition
  notes?: string
  is_active?: boolean
}

// Custom Item model
export interface CustomItem {
  id: number
  name: string
  description?: string
  price: string
  unit?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CustomItemCreate {
  name: string
  description?: string
  price: number | string
  unit?: string
  is_active?: boolean
}

export interface CustomItemUpdate {
  name?: string
  description?: string
  price?: number | string
  unit?: string
  is_active?: boolean
}

// Booking inventory and custom items relationships
export interface BookingInventoryItem {
  id: number
  booking_id: number
  inventory_item_id: number
  quantity: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface BookingInventoryItemWithDetails extends BookingInventoryItem {
  inventory_item: InventoryItemWithType | null
}

export interface BookingCustomItem {
  id: number
  booking_id: number
  custom_item_id: number
  quantity: number
  unit_price: string
  total_price: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface BookingCustomItemWithDetails extends BookingCustomItem {
  custom_item: CustomItem | null
}

export interface BookingInventoryItemCreate {
  inventory_item_id: number
  quantity: number
  notes?: string
}

export interface BookingCustomItemCreate {
  custom_item_id: number
  quantity: number
  unit_price?: number | string
  notes?: string
}

// Filters and search
export interface InventoryTypeFilters {
  search: string
  is_active?: boolean
}

export interface InventoryItemFilters {
  search: string
  type_id?: number
  condition?: InventoryCondition[]
  is_active?: boolean
}

export interface CustomItemFilters {
  search: string
  is_active?: boolean
}

// List responses
export interface InventoryTypesListResponse {
  inventory_types: InventoryType[]
  total: number
  skip: number
  limit: number
}

export interface InventoryItemsListResponse {
  inventory_items: InventoryItemWithType[]
  total: number
  skip: number
  limit: number
}

export interface CustomItemsListResponse {
  custom_items: CustomItem[]
  total: number
  skip: number
  limit: number
}

// Search parameters
export interface InventoryTypesSearchParams {
  search?: string
  is_active?: boolean
  skip?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface InventoryItemsSearchParams {
  search?: string
  type_id?: number
  condition?: InventoryCondition[]
  is_active?: boolean
  skip?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface CustomItemsSearchParams {
  search?: string
  is_active?: boolean
  skip?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Sort options
export interface InventoryTypeSortOptions {
  field: 'name' | 'created_at' | 'updated_at'
  order: 'asc' | 'desc'
}

export interface InventoryItemSortOptions {
  field: 'number' | 'condition' | 'inventory_type_name' | 'created_at' | 'updated_at'
  order: 'asc' | 'desc'
}

export interface CustomItemSortOptions {
  field: 'name' | 'price' | 'created_at' | 'updated_at'
  order: 'asc' | 'desc'
}

// Statistics and analytics
export interface InventoryStats {
  total_inventory_types: number
  active_inventory_types: number
  total_inventory_items: number
  active_inventory_items: number
  items_by_condition: {
    [key in InventoryCondition]: number
  }
  total_custom_items: number
  active_custom_items: number
}

// Selection types for booking creation/editing
export interface InventoryItemSelection {
  inventory_item_id: number
  inventory_item: InventoryItemWithType
  quantity: number
  notes?: string
}

export interface CustomItemSelection {
  custom_item_id: number
  custom_item: CustomItem
  quantity: number
  price: number
  notes?: string
}