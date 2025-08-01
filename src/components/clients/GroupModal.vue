<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6"
  >
    <div
      class="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg border max-h-full overflow-y-auto"
    >
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ group ? 'Edit Client Group' : 'Add New Client Group' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Group Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Group Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              placeholder="Enter group name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              placeholder="Optional description for this group..."
            ></textarea>
          </div>

          <!-- Color Theme -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="color in colorOptions"
                :key="color.value"
                type="button"
                @click="form.color = color.value"
                :class="[
                  'h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-200',
                  form.color === color.value
                    ? 'border-gray-900 shadow-md'
                    : 'border-gray-200 hover:border-gray-300',
                  color.bgClass,
                ]"
                :title="color.name"
              >
                <div
                  :class="[
                    'w-6 h-6 rounded-full',
                    color.colorClass,
                    form.color === color.value ? 'ring-2 ring-white shadow-sm' : '',
                  ]"
                ></div>
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">Choose a color theme for this group</p>
          </div>

          <!-- Form Actions -->
          <div
            class="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200"
          >
            <button
              type="button"
              @click="$emit('close')"
              class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 touch-manipulation min-h-[44px] sm:min-h-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading || !form.name.trim()"
              class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-0"
            >
              {{ loading ? 'Saving...' : group ? 'Update Group' : 'Create Group' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { ClientGroup, ClientGroupCreate, ClientGroupUpdate } from '../../types/client'

interface Props {
  group?: ClientGroup | null
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: ClientGroupCreate | ClientGroupUpdate): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref<ClientGroupCreate>({
  name: '',
  description: '',
  color: 'blue',
})

const errors = ref<Record<string, string>>({})

const colorOptions = [
  { value: 'blue', name: 'Blue', bgClass: 'bg-blue-50', colorClass: 'bg-blue-500' },
  { value: 'green', name: 'Green', bgClass: 'bg-green-50', colorClass: 'bg-green-500' },
  { value: 'purple', name: 'Purple', bgClass: 'bg-purple-50', colorClass: 'bg-purple-500' },
  { value: 'red', name: 'Red', bgClass: 'bg-red-50', colorClass: 'bg-red-500' },
  { value: 'yellow', name: 'Yellow', bgClass: 'bg-yellow-50', colorClass: 'bg-yellow-500' },
  { value: 'indigo', name: 'Indigo', bgClass: 'bg-indigo-50', colorClass: 'bg-indigo-500' },
  { value: 'pink', name: 'Pink', bgClass: 'bg-pink-50', colorClass: 'bg-pink-500' },
  { value: 'gray', name: 'Gray', bgClass: 'bg-gray-50', colorClass: 'bg-gray-500' },
]

const initializeForm = () => {
  if (props.group) {
    form.value = {
      name: props.group.name,
      description: props.group.description || '',
      color: props.group.color || 'blue',
    }
  } else {
    form.value = {
      name: '',
      description: '',
      color: 'blue',
    }
  }
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Group name is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  // Clean up empty values
  const cleanedData = {
    ...form.value,
    name: form.value.name.trim(),
    description: form.value.description?.trim() || undefined,
  }

  emit('save', cleanedData)
}

// Watch for changes in the group prop
watch(() => props.group, initializeForm, { immediate: true })

onMounted(() => {
  initializeForm()
})
</script>