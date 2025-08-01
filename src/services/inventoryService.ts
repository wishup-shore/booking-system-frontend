import { apiClient } from '../api/client'
import type {
  InventoryType,
  InventoryTypeCreate,
  InventoryTypeUpdate,
  InventoryTypesListResponse,
  InventoryTypesSearchParams,
  InventoryItem,
  InventoryItemWithType,
  InventoryItemCreate,
  InventoryItemUpdate,
  InventoryItemsListResponse,
  InventoryItemsSearchParams,
  InventoryStats,
} from '../types/inventory'

export class InventoryTypeService {
  // Main CRUD operations for Inventory Types
  static async getInventoryTypes(params?: InventoryTypesSearchParams): Promise<InventoryTypesListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.search) {
      searchParams.append('search', params.search)
    }
    if (params?.is_active !== undefined) {
      searchParams.append('is_active', params.is_active.toString())
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
    const url = `/api/v1/inventory-types/${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async getInventoryType(id: number): Promise<InventoryType> {
    const response = await apiClient.get(`/api/v1/inventory-types/${id}`)
    return response.data
  }

  static async createInventoryType(data: InventoryTypeCreate): Promise<InventoryType> {
    const response = await apiClient.post('/api/v1/inventory-types/', data)
    return response.data
  }

  static async updateInventoryType(id: number, data: InventoryTypeUpdate): Promise<InventoryType> {
    const response = await apiClient.put(`/api/v1/inventory-types/${id}`, data)
    return response.data
  }

  static async deleteInventoryType(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/inventory-types/${id}`)
  }

  // Simplified list for dropdowns and selections
  static async getInventoryTypesList(activeOnly = true): Promise<InventoryType[]> {
    const params = activeOnly ? { is_active: true, limit: 1000 } : { limit: 1000 }
    const response = await this.getInventoryTypes(params)
    return Array.isArray(response) ? response : response.inventory_types || []
  }
}

export class InventoryItemService {
  // Main CRUD operations for Inventory Items
  static async getInventoryItems(params?: InventoryItemsSearchParams): Promise<InventoryItemsListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.search) {
      searchParams.append('search', params.search)
    }
    if (params?.type_id) {
      searchParams.append('type_id', params.type_id.toString())
    }
    if (params?.condition?.length) {
      params.condition.forEach((condition) => searchParams.append('condition', condition))
    }
    if (params?.is_active !== undefined) {
      searchParams.append('is_active', params.is_active.toString())
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
    const url = `/api/v1/inventory-items/${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async getInventoryItem(id: number): Promise<InventoryItemWithType> {
    const response = await apiClient.get(`/api/v1/inventory-items/${id}`)
    return response.data
  }

  static async createInventoryItem(data: InventoryItemCreate): Promise<InventoryItem> {
    const response = await apiClient.post('/api/v1/inventory-items/', data)
    return response.data
  }

  static async updateInventoryItem(id: number, data: InventoryItemUpdate): Promise<InventoryItem> {
    const response = await apiClient.put(`/api/v1/inventory-items/${id}`, data)
    return response.data
  }

  static async deleteInventoryItem(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/inventory-items/${id}`)
  }

  // Get items by type for booking selection
  static async getItemsByType(inventoryTypeId: number, activeOnly = true): Promise<InventoryItemWithType[]> {
    const params: InventoryItemsSearchParams = {
      type_id: inventoryTypeId,
      is_active: activeOnly,
      limit: 1000,
    }
    const response = await this.getInventoryItems(params)
    return Array.isArray(response) ? response : response.inventory_items || []
  }

  // Get available items (not currently booked for a specific date range)
  static async getAvailableItems(
    inventoryTypeId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<InventoryItemWithType[]> {
    // If we have a specific type, use the by-type endpoint
    if (inventoryTypeId) {
      return this.getAvailableItemsByType(inventoryTypeId, startDate, endDate)
    }
    
    // Otherwise, use the general endpoint with available_only filter
    const searchParams = new URLSearchParams()
    searchParams.append('is_active', 'true')
    searchParams.append('available_only', 'true')
    
    // Note: The API might not support date-based availability filtering on the general endpoint
    // Date availability should be checked client-side or through a different endpoint

    const queryString = searchParams.toString()
    const url = `/api/v1/inventory-items/${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    // The API returns an array directly according to OpenAPI spec
    return Array.isArray(response.data) ? response.data : []
  }

  // Get available items by type (using the specific OpenAPI endpoint)
  static async getAvailableItemsByType(
    typeId: number,
    startDate?: string,
    endDate?: string
  ): Promise<InventoryItemWithType[]> {
    // The by-type/available endpoint doesn't support date parameters according to OpenAPI spec
    // Date availability checking should be done separately if needed
    const url = `/api/v1/inventory-items/by-type/${typeId}/available`
    
    const response = await apiClient.get(url)
    // The API returns an array directly according to OpenAPI spec
    return Array.isArray(response.data) ? response.data : []
  }

  // Check availability for multiple items
  static async checkItemsAvailability(
    itemIds: number[],
    startDate: string,
    endDate: string
  ): Promise<{ [itemId: number]: boolean }> {
    const response = await apiClient.post('/api/v1/inventory-items/check-availability', {
      item_ids: itemIds,
      start_date: startDate,
      end_date: endDate
    })
    return response.data
  }
}

export class InventoryStatsService {
  static async getInventoryStats(): Promise<InventoryStats> {
    const response = await apiClient.get('/api/v1/inventory/stats')
    return response.data
  }
}