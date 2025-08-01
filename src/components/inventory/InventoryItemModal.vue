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
                {{ isEdit ? 'Edit Inventory Item' : 'Add Inventory Item' }}
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
            <!-- Inventory Type -->
            <div>
              <label for="type_id" class="block text-sm font-medium text-gray-700 mb-1">
                Inventory Type <span class="text-red-500">*</span>
              </label>
              <select
                id="type_id"
                v-model="form.type_id"
                required
                :class="[
                  'block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  errors.type_id ? 'border-red-300' : 'border-gray-300'
                ]"
              >
                <option value="">Select inventory type</option>
                <option v-for="type in inventoryTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
              <p v-if="errors.type_id" class="mt-1 text-sm text-red-600">{{ errors.type_id }}</p>
            </div>

            <!-- Item Number -->
            <div>
              <label for="number" class="block text-sm font-medium text-gray-700 mb-1">
                Item Number <span class="text-red-500">*</span>
              </label>
              <input
                id="number"
                v-model="form.number"
                type="text"
                required
                :class="[
                  'block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  errors.number ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Enter item number (e.g., SLP-001)"
              >
              <p v-if="errors.number" class="mt-1 text-sm text-red-600">{{ errors.number }}</p>
            </div>

            <!-- Condition -->
            <div>
              <label for="condition" class="block text-sm font-medium text-gray-700 mb-1">
                Condition <span class="text-red-500">*</span>
              </label>
              <select
                id="condition"
                v-model="form.condition"
                required
                :class="[
                  'block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  errors.condition ? 'border-red-300' : 'border-gray-300'
                ]"
              >
                <option value="">Select condition</option>
                <option v-for="option in conditionOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <p v-if="errors.condition" class="mt-1 text-sm text-red-600">{{ errors.condition }}</p>
            </div>

            <!-- Notes -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                :class="[
                  'block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  errors.notes ? 'border-red-300' : 'border-gray-300'
                ]"
                placeholder="Optional notes about the item condition or other details"
              ></textarea>
              <p v-if="errors.notes" class="mt-1 text-sm text-red-600">{{ errors.notes }}</p>
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
              Inactive items won't be available for new bookings
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
import { useInventoryTypesStore } from '../../stores/inventoryTypes'
import type { InventoryItemWithType, InventoryItemCreate, InventoryItemUpdate, InventoryType } from '../../types/inventory'
import { InventoryCondition } from '../../types/inventory'

interface Props {
  inventoryItem?: InventoryItemWithType | null
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: InventoryItemCreate | InventoryItemUpdate): void
}

const props = withDefaults(defineProps<Props>(), {
  inventoryItem: null,
  isEdit: false,
})

const emit = defineEmits<Emits>()

// Stores
const typesStore = useInventoryTypesStore()

// Form state
const loading = ref(false)
const inventoryTypes = ref<InventoryType[]>([])

const form = reactive({
  type_id: null as number | null,
  number: '',
  condition: '' as InventoryCondition | '',
  notes: '',
  is_active: true,
})

const errors = reactive({
  type_id: '',
  number: '',
  condition: '',
  notes: '',
})

// Condition options
const conditionOptions = [
  { value: InventoryCondition.OK, label: 'OK' },
  { value: InventoryCondition.MINOR_ISSUE, label: 'Minor Issue' },
  { value: InventoryCondition.CRITICAL, label: 'Critical' },
]

// Methods
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validate inventory type
  if (!form.type_id) {
    errors.type_id = 'Inventory type is required'
    isValid = false
  }

  // Validate number
  if (!form.number.trim()) {
    errors.number = 'Item number is required'
    isValid = false
  } else if (form.number.trim().length < 2) {
    errors.number = 'Item number must be at least 2 characters long'
    isValid = false
  } else if (form.number.trim().length > 50) {
    errors.number = 'Item number must be less than 50 characters long'
    isValid = false
  }

  // Validate condition
  if (!form.condition) {
    errors.condition = 'Condition is required'
    isValid = false
  }

  // Validate notes
  if (form.notes && form.notes.length > 1000) {
    errors.notes = 'Notes must be less than 1000 characters long'
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
    const data: InventoryItemCreate | InventoryItemUpdate = {
      type_id: form.type_id!,
      number: form.number.trim(),
      condition: form.condition as InventoryCondition,
      notes: form.notes.trim() || undefined,
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
  form.type_id = null
  form.number = ''
  form.condition = ''
  form.notes = ''
  form.is_active = true
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const loadInventoryItem = () => {
  if (props.inventoryItem) {
    form.type_id = props.inventoryItem.type_id
    form.number = props.inventoryItem.number
    form.condition = props.inventoryItem.condition
    form.notes = props.inventoryItem.notes || ''
    form.is_active = props.inventoryItem.is_active
  } else {
    resetForm()
  }
}

const loadInventoryTypes = async () => {
  try {
    inventoryTypes.value = await typesStore.getInventoryTypesList(false)
  } catch (error) {
    console.error('Failed to load inventory types:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await loadInventoryTypes()
  loadInventoryItem()
})

// Watch for prop changes
watch(() => props.inventoryItem, () => {
  loadInventoryItem()
}, { deep: true })
</script>