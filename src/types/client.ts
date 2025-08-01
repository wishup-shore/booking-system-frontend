export interface Client {
  id: number
  first_name: string
  last_name: string
  phone?: string
  email?: string
  photo_url?: string
  car_numbers?: string[]
  social_links?: Record<string, string>
  rating?: number
  comments?: string
  group_id?: number
  created_at: string
  group?: ClientGroup
}

export interface ClientCreate {
  first_name: string
  last_name: string
  phone?: string
  email?: string
  photo_url?: string
  car_numbers?: string[]
  social_links?: Record<string, string>
  rating?: number
  comments?: string
  group_id?: number
}

export interface ClientUpdate {
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
  photo_url?: string
  car_numbers?: string[]
  social_links?: Record<string, string>
  rating?: number
  comments?: string
  group_id?: number
}

export interface ClientStats {
  first_name: string
  last_name: string
  phone?: string
  email?: string
  photo_url?: string
  car_numbers?: string[]
  social_links?: Record<string, string>
  rating?: number
  comments?: string
  group_id?: number
  id: number
  created_at: string
  group?: ClientGroup
  visits_count: number
  total_spent: number
}

export interface ClientGroup {
  id: number
  name: string
  description?: string
  color?: string
  created_at: string
  clients_count?: number
}

export interface ClientGroupCreate {
  name: string
  description?: string
  color?: string
}

export interface ClientGroupUpdate {
  name?: string
  description?: string
  color?: string
}

export interface ClientGroupDetail extends ClientGroup {
  clients: Client[]
}

export interface ClientsListResponse {
  clients: Client[]
  total: number
  skip: number
  limit: number
}

export interface ClientsSearchParams {
  search?: string
  skip?: number
  limit?: number
}

export interface ClientGroupsListResponse {
  groups: ClientGroup[]
  total: number
}
