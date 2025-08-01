import { ref } from 'vue'
import type { ApiClientError } from '../types/errors'
import { ErrorHandler } from '../types/errors'

/**
 * Composable for handling API errors in Vue components
 */
export function useErrorHandler() {
  const error = ref<ApiClientError | null>(null)
  const isLoading = ref(false)

  /**
   * Clear current error
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Handle API error
   */
  const handleError = (err: any, context?: string) => {
    const apiError = err instanceof Error ? ErrorHandler.handleApiError(err) : err
    error.value = apiError
    ErrorHandler.logError(apiError, context)
    return apiError
  }

  /**
   * Execute async function with error handling
   */
  const executeWithErrorHandling = async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      isLoading.value = true
      clearError()
      const result = await asyncFn()
      return result
    } catch (err) {
      handleError(err, context)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get user-friendly error message
   */
  const getErrorMessage = () => {
    return error.value?.getUserMessage() || ''
  }

  /**
   * Get validation error messages
   */
  const getValidationMessages = () => {
    return error.value?.getValidationMessages() || []
  }

  /**
   * Check error types
   */
  const isValidationError = () => error.value?.isValidationError() || false
  const isAuthError = () => error.value?.isAuthError() || false
  const isPermissionError = () => error.value?.isPermissionError() || false
  const isNotFoundError = () => error.value?.isNotFoundError() || false
  const isConflictError = () => error.value?.isConflictError() || false
  const isServerError = () => error.value?.isServerError() || false

  return {
    error,
    isLoading,
    clearError,
    handleError,
    executeWithErrorHandling,
    getErrorMessage,
    getValidationMessages,
    isValidationError,
    isAuthError,
    isPermissionError,
    isNotFoundError,
    isConflictError,
    isServerError,
  }
}