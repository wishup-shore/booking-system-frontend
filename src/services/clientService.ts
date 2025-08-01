import { apiClient } from '../api/client'
import type {
  Client,
  ClientCreate,
  ClientUpdate,
  ClientStats,
  ClientGroup,
  ClientGroupCreate,
  ClientGroupUpdate,
  ClientGroupDetail,
  ClientsListResponse,
  ClientsSearchParams,
  ClientGroupsListResponse,
} from '../types/client'

export class ClientService {
  // Individual Clients
  static async getClients(params?: ClientsSearchParams): Promise<ClientsListResponse> {
    const searchParams = new URLSearchParams()

    if (params?.search) {
      searchParams.append('search', params.search)
    }
    if (params?.skip !== undefined) {
      searchParams.append('skip', params.skip.toString())
    }
    if (params?.limit !== undefined) {
      searchParams.append('limit', params.limit.toString())
    }

    const queryString = searchParams.toString()
    const url = `/api/v1/clients/${queryString ? `?${queryString}` : ''}`

    const response = await apiClient.get(url)
    // API returns array directly, we need to wrap it
    const clients = response.data as Client[]
    return {
      clients,
      total: clients.length,
      skip: params?.skip || 0,
      limit: params?.limit || 100
    }
  }

  static async getClient(clientId: number): Promise<Client> {
    const response = await apiClient.get(`/api/v1/clients/${clientId}`)
    return response.data
  }

  static async createClient(data: ClientCreate): Promise<Client> {
    const response = await apiClient.post('/api/v1/clients/', data)
    return response.data
  }

  static async updateClient(clientId: number, data: ClientUpdate): Promise<Client> {
    const response = await apiClient.put(`/api/v1/clients/${clientId}`, data)
    return response.data
  }

  static async deleteClient(clientId: number): Promise<void> {
    await apiClient.delete(`/api/v1/clients/${clientId}`)
  }

  static async getClientStats(clientId: number): Promise<ClientStats> {
    const response = await apiClient.get(`/api/v1/clients/${clientId}/stats`)
    return response.data
  }

  // Client Groups
  static async getClientGroups(): Promise<ClientGroupsListResponse> {
    const response = await apiClient.get('/api/v1/clients/groups/')
    // API returns array directly, we need to wrap it
    const groups = response.data as ClientGroup[]
    return {
      groups,
      total: groups.length
    }
  }

  static async getClientGroup(groupId: number): Promise<ClientGroupDetail> {
    const response = await apiClient.get(`/api/v1/clients/groups/${groupId}`)
    return response.data
  }

  static async createClientGroup(data: ClientGroupCreate): Promise<ClientGroup> {
    const response = await apiClient.post('/api/v1/clients/groups/', data)
    return response.data
  }

  static async updateClientGroup(groupId: number, data: ClientGroupUpdate): Promise<ClientGroup> {
    const response = await apiClient.put(`/api/v1/clients/groups/${groupId}`, data)
    return response.data
  }

  static async deleteClientGroup(groupId: number): Promise<void> {
    await apiClient.delete(`/api/v1/clients/groups/${groupId}`)
  }

  static async addClientToGroup(groupId: number, clientId: number): Promise<void> {
    await apiClient.post(`/api/v1/clients/groups/${groupId}/clients/${clientId}`)
  }

  static async removeClientFromGroup(groupId: number, clientId: number): Promise<void> {
    await apiClient.delete(`/api/v1/clients/groups/${groupId}/clients/${clientId}`)
  }
}
