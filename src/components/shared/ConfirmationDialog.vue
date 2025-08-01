<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="$emit('cancel')"
      ></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <!-- Header -->
        <div class="px-6 py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div :class="[
                'mx-auto flex items-center justify-center h-12 w-12 rounded-full',
                iconBgClass
              ]">
                <svg :class="['h-6 w-6', iconClass]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ title }}
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
          <button
            type="button"
            @click="$emit('cancel')"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 border border-gray-300 rounded-lg transition-colors duration-200"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            @click="$emit('confirm')"
            :disabled="loading"
            :class="[
              'w-full sm:w-auto px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200',
              confirmClass
            ]"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loadingText }}
            </span>
            <span v-else>
              {{ confirmText }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmClass?: string
  type?: 'warning' | 'danger' | 'info'
  loading?: boolean
  loadingText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  type: 'warning',
  loading: false,
  loadingText: 'Processing...',
})

defineEmits<Emits>()

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100'
    case 'info':
      return 'bg-blue-100'
    case 'warning':
    default:
      return 'bg-yellow-100'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'text-red-600'
    case 'info':
      return 'text-blue-600'
    case 'warning':
    default:
      return 'text-yellow-600'
  }
})

const iconPath = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    case 'info':
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'warning':
    default:
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z'
  }
})
</script>