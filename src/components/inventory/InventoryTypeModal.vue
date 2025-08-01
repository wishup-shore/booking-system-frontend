<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ isEdit ? 'Edit Inventory Type' : 'Add Inventory Type' }}
              </h3>
              <button
                type="button"
                @click="$emit('close')"
                class="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="px-6 py-4 space-y-4">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :class="[
                  'block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  errors.name ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Enter inventory type name"
              >
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                :class="[
                  'block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  errors.description ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Optional description for this inventory type"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>

            <!-- Active Status -->
            <div class="flex items-center">
              <input
                id="is_active"
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              >
              <label for="is_active" class="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
            <p class="text-xs text-gray-500">
              Inactive inventory types won't be available for new bookings
            </p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isEdit ? 'Updating...' : 'Creating...' }}
              </span>
              <span v-else>
                {{ isEdit ? 'Update' : 'Create' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { InventoryType, InventoryTypeCreate, InventoryTypeUpdate } from '../../types/inventory'

interface Props {
  inventoryType?: InventoryType | null
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: InventoryTypeCreate | InventoryTypeUpdate): void
}

const props = withDefaults(defineProps<Props>(), {
  inventoryType: null,
  isEdit: false,
})

const emit = defineEmits<Emits>()

// Form state
const loading = ref(false)
const form = reactive({
  name: '',
  description: '',
  is_active: true,
})

const errors = reactive({
  name: '',
  description: '',
})

// Methods
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
    isValid = false
  } else if (form.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters long'
    isValid = false
  }

  // Validate description
  if (form.description && form.description.length > 500) {
    errors.description = 'Description must be less than 500 characters long'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const data: InventoryTypeCreate | InventoryTypeUpdate = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      is_active: form.is_active,
    }

    emit('save', data)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.is_active = true
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const loadInventoryType = () => {
  if (props.inventoryType) {
    form.name = props.inventoryType.name
    form.description = props.inventoryType.description || ''
    form.is_active = props.inventoryType.is_active
  } else {
    resetForm()
  }
}

// Lifecycle
onMounted(() => {
  loadInventoryType()
})

// Watch for prop changes
watch(() => props.inventoryType, () => {
  loadInventoryType()
}, { deep: true })
</script>