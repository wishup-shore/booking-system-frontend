import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { ErrorHandler } from '../types/errors'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor to handle errors consistently
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError = ErrorHandler.handleApiError(error)
        
        // Handle authentication errors
        if (apiError.isAuthError()) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('token_type')
          window.location.href = '/login'
        }
        
        // Log error for debugging
        ErrorHandler.logError(apiError)
        
        return Promise.reject(apiError)
      },
    )
  }

  get instance() {
    return this.client
  }
}

export const apiClient = new ApiClient().instance
