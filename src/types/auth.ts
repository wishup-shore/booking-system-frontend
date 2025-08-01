export interface LoginRequest {
  username: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface User {
  id: number
  username: string
  email: string
  role: 'staff' | 'viewer'
  is_active: boolean
}

export interface UserCreate {
  username: string
  email: string
  password: string
  full_name: string
  role?: 'staff' | 'viewer'
}

export interface UserRegistrationResponse {
  user: User
  message: string
}
