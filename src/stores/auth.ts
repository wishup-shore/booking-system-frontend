import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '../api/auth'
import type { LoginRequest, User, UserCreate } from '../types/auth'
import { useErrorHandler } from '../composables/useErrorHandler'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const { handleError, clearError } = useErrorHandler()

  const login = async (credentials: LoginRequest) => {
    try {
      loading.value = true
      clearError()
      
      const tokenData = await authApi.login(credentials)

      // Store tokens
      localStorage.setItem('access_token', tokenData.access_token)
      localStorage.setItem('token_type', tokenData.token_type)

      // Get user info
      const userData = await authApi.getCurrentUser()
      user.value = userData
      isAuthenticated.value = true

      return { success: true }
    } catch (error: unknown) {
      const apiError = handleError(error, 'login')
      return {
        success: false,
        error: apiError.getUserMessage(),
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: UserCreate) => {
    try {
      loading.value = true
      clearError()
      
      const result = await authApi.register(userData)
      
      return { 
        success: true, 
        user: result.user,
        message: result.message 
      }
    } catch (error: unknown) {
      const apiError = handleError(error, 'register')
      return {
        success: false,
        error: apiError.getUserMessage(),
        validationErrors: apiError.getValidationMessages(),
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('token_type')
    user.value = null
    isAuthenticated.value = false
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return false
    }

    try {
      const userData = await authApi.getCurrentUser()
      user.value = userData
      isAuthenticated.value = true
      return true
    } catch {
      logout()
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuth,
  }
})
