/**
 * Error handling types for API responses
 * Based on OpenAPI HTTPValidationError schema
 */

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
  ctx?: Record<string, any>
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

export interface APIError {
  message: string
  status: number
  statusText: string
  data?: any
  validationErrors?: ValidationError[]
}

export class ApiClientError extends Error {
  public status: number
  public statusText: string
  public data: any
  public validationErrors?: ValidationError[]

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.statusText = statusText
    this.data = data

    // Extract validation errors from 422 responses
    if (status === 422 && data?.detail && Array.isArray(data.detail)) {
      this.validationErrors = data.detail
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    // Handle validation errors
    if (this.validationErrors && this.validationErrors.length > 0) {
      const firstError = this.validationErrors[0]
      const fieldName = firstError.loc.join('.')
      return `${fieldName}: ${firstError.msg}`
    }

    // Handle other HTTP errors
    switch (this.status) {
      case 400:
        return 'Bad request. Please check your input and try again.'
      case 401:
        return 'Authentication required. Please log in again.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return 'This action conflicts with existing data.'
      case 422:
        return 'Please check your input data.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return this.message || 'An unexpected error occurred.'
    }
  }

  /**
   * Get all validation error messages formatted for display
   */
  getValidationMessages(): string[] {
    if (!this.validationErrors) return []
    
    return this.validationErrors.map(error => {
      const fieldName = error.loc.length > 1 ? error.loc.slice(1).join('.') : error.loc.join('.')
      return `${fieldName}: ${error.msg}`
    })
  }

  /**
   * Check if error is a specific type
   */
  isValidationError(): boolean {
    return this.status === 422 && !!this.validationErrors
  }

  isAuthError(): boolean {
    return this.status === 401
  }

  isPermissionError(): boolean {
    return this.status === 403
  }

  isNotFoundError(): boolean {
    return this.status === 404
  }

  isConflictError(): boolean {
    return this.status === 409
  }

  isServerError(): boolean {
    return this.status >= 500
  }
}

/**
 * Error handler utility functions
 */
export class ErrorHandler {
  /**
   * Handle API errors in a consistent way
   */
  static handleApiError(error: any): ApiClientError {
    if (error instanceof ApiClientError) {
      return error
    }

    if (error.response) {
      // HTTP error response
      const { status, statusText, data } = error.response
      const message = data?.message || data?.detail || error.message || 'Request failed'
      return new ApiClientError(message, status, statusText, data)
    }

    if (error.request) {
      // Network error
      return new ApiClientError('Network error. Please check your connection.', 0, 'Network Error')
    }

    // Other error
    return new ApiClientError(error.message || 'An unexpected error occurred', 0, 'Unknown Error')
  }

  /**
   * Log error for debugging
   */
  static logError(error: ApiClientError, context?: string): void {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data,
      validationErrors: error.validationErrors,
    })
  }

  /**
   * Show user-friendly error notification
   */
  static showErrorNotification(error: ApiClientError, context?: string): void {
    // This should be implemented based on your notification system
    // For now, just log the user message
    console.warn(`User Error${context ? ` in ${context}` : ''}:`, error.getUserMessage())
    
    // If using vue-toastification or similar:
    // toast.error(error.getUserMessage())
  }
}