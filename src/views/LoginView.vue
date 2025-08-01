<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
          <svg
            class="w-8 h-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {{ isLogin ? 'Sign in to Booking System' : 'Create your account' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLogin ? 'Manage your accommodations and bookings' : 'Get started with your booking system' }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Email field for registration -->
          <div v-if="!isLogin">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                :disabled="authStore.loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Full name field for registration -->
          <div v-if="!isLogin">
            <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="mt-1">
              <input
                id="full_name"
                name="full_name"
                type="text"
                autocomplete="name"
                required
                v-model="form.full_name"
                :disabled="authStore.loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <div class="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                :autocomplete="isLogin ? 'username' : 'username'"
                required
                v-model="form.username"
                :disabled="authStore.loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                required
                v-model="form.password"
                :disabled="authStore.loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <!-- Confirm password field for registration -->
          <div v-if="!isLogin">
            <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="mt-1">
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autocomplete="new-password"
                required
                v-model="form.confirm_password"
                :disabled="authStore.loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Confirm your password"
              />
            </div>
          </div>
        </div>

        <!-- General error message -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Validation errors -->
        <div v-if="validationErrors && Object.keys(validationErrors).length > 0" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <div class="mt-2 text-sm text-red-700">
                <ul class="list-disc list-inside space-y-1">
                  <li v-for="(errors, field) in validationErrors" :key="field">
                    <strong>{{ field }}:</strong> {{ Array.isArray(errors) ? errors.join(', ') : errors }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Success message for registration -->
        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ successMessage }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="authStore.loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ getSubmitButtonText() }}
          </button>
        </div>

        <!-- Toggle between login and register -->
        <div class="text-center">
          <button
            type="button"
            @click="toggleMode"
            :disabled="authStore.loading"
            class="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {{ isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const isLogin = ref(true)

const form = ref({
  email: '',
  full_name: '',
  username: '',
  password: '',
  confirm_password: '',
})

const errorMessage = ref('')
const validationErrors = ref<Record<string, string | string[]>>({})
const successMessage = ref('')

// Computed properties
const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.value.username && form.value.password
  } else {
    return (
      form.value.email &&
      form.value.full_name &&
      form.value.username &&
      form.value.password &&
      form.value.confirm_password &&
      form.value.password === form.value.confirm_password
    )
  }
})

// Methods
const clearMessages = () => {
  errorMessage.value = ''
  validationErrors.value = {}
  successMessage.value = ''
}

const clearForm = () => {
  form.value = {
    email: '',
    full_name: '',
    username: '',
    password: '',
    confirm_password: '',
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  clearMessages()
  clearForm()
}

const getSubmitButtonText = () => {
  if (authStore.loading) {
    return isLogin.value ? 'Signing in...' : 'Creating account...'
  }
  return isLogin.value ? 'Sign in' : 'Create account'
}

const validateRegistrationForm = () => {
  const errors: Record<string, string[]> = {}

  if (!form.value.email) {
    errors.email = ['Email is required']
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.email = ['Please enter a valid email address']
  }

  if (!form.value.full_name) {
    errors.full_name = ['Full name is required']
  } else if (form.value.full_name.length < 2) {
    errors.full_name = ['Full name must be at least 2 characters long']
  }

  if (!form.value.username) {
    errors.username = ['Username is required']
  } else if (form.value.username.length < 3) {
    errors.username = ['Username must be at least 3 characters long']
  }

  if (!form.value.password) {
    errors.password = ['Password is required']
  } else if (form.value.password.length < 6) {
    errors.password = ['Password must be at least 6 characters long']
  }

  if (!form.value.confirm_password) {
    errors.confirm_password = ['Please confirm your password']
  } else if (form.value.password !== form.value.confirm_password) {
    errors.confirm_password = ['Passwords do not match']
  }

  return errors
}

const handleSubmit = async () => {
  clearMessages()

  if (isLogin.value) {
    // Handle login
    const result = await authStore.login({
      username: form.value.username,
      password: form.value.password,
    })

    if (result.success) {
      toast.success('Successfully signed in!')
      router.push('/dashboard')
    } else {
      errorMessage.value = result.error || 'Login failed. Please try again.'
    }
  } else {
    // Handle registration
    const clientValidationErrors = validateRegistrationForm()
    if (Object.keys(clientValidationErrors).length > 0) {
      validationErrors.value = clientValidationErrors
      return
    }

    const result = await authStore.register({
      email: form.value.email,
      full_name: form.value.full_name,
      username: form.value.username,
      password: form.value.password,
    })

    if (result.success) {
      successMessage.value = result.message || 'Account created successfully! You can now sign in.'
      toast.success('Account created successfully!')
      // Switch to login mode after successful registration
      setTimeout(() => {
        isLogin.value = true
        clearForm()
        clearMessages()
      }, 2000)
    } else {
      errorMessage.value = result.error || 'Registration failed. Please try again.'
      if (result.validationErrors) {
        validationErrors.value = result.validationErrors
      }
    }
  }
}

// Watch for mode changes to clear form
watch(isLogin, () => {
  clearMessages()
})

// Redirect if already authenticated
onMounted(async () => {
  if (await authStore.checkAuth()) {
    router.push('/dashboard')
  }
})
</script>
