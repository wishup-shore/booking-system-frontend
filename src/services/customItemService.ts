import { apiClient } from '../api/client'
import type {
  CustomItem,
  CustomItemCreate,
  CustomItemUpdate,
  CustomItemsListResponse,
  CustomItemsSearchParams,
} from '../types/inventory'

export class CustomItemService {
  // Main CRUD operations for Custom Items
  static async getCustomItems(params?: CustomItemsSearchParams): Promise<CustomItemsListResponse> {
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
    const url = `/api/v1/custom-items/${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    return response.data
  }

  static async getCustomItem(id: number): Promise<CustomItem> {
    const response = await apiClient.get(`/api/v1/custom-items/${id}`)
    return response.data
  }

  static async createCustomItem(data: CustomItemCreate): Promise<CustomItem> {
    const response = await apiClient.post('/api/v1/custom-items/', data)
    return response.data
  }

  static async updateCustomItem(id: number, data: CustomItemUpdate): Promise<CustomItem> {
    const response = await apiClient.put(`/api/v1/custom-items/${id}`, data)
    return response.data
  }

  static async deleteCustomItem(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/custom-items/${id}`)
  }

  // Simplified list for dropdowns and selections
  static async getCustomItemsList(activeOnly = true): Promise<CustomItem[]> {
    const params = activeOnly ? { is_active: true, limit: 1000 } : { limit: 1000 }
    const response = await this.getCustomItems(params)
    return Array.isArray(response) ? response : response.custom_items || []
  }
}