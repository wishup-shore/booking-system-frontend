import { apiClient } from './client'
import type { LoginRequest, Token, User, UserCreate, UserRegistrationResponse } from '../types/auth'

export const authApi = {
  async login(credentials: LoginRequest): Promise<Token> {
    const response = await apiClient.post<Token>('/api/v1/auth/login', credentials)
    return response.data
  },

  async register(userData: UserCreate): Promise<UserRegistrationResponse> {
    const response = await apiClient.post<UserRegistrationResponse>('/api/v1/auth/register', userData)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/auth/me')
    return response.data
  },
}
