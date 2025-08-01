<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6"
  >
    <div
      class="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border max-h-full overflow-y-auto"
    >
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ client ? 'Edit Client' : 'Add New Client' }}
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
          <!-- Basic Information -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h4>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="first_name" class="block text-sm font-medium text-gray-700">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="first_name"
                  v-model="form.first_name"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="Enter first name"
                />
                <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
              </div>

              <div>
                <label for="last_name" class="block text-sm font-medium text-gray-700">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  id="last_name"
                  v-model="form.last_name"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="Enter last name"
                />
                <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="+1 (555) 123-4567"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="client@example.com"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <div class="sm:col-span-2">
                <label for="photo_url" class="block text-sm font-medium text-gray-700"
                  >Photo URL</label
                >
                <input
                  id="photo_url"
                  v-model="form.photo_url"
                  type="url"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="https://example.com/photo.jpg"
                />
                <p class="mt-1 text-sm text-gray-500">Optional: URL to client's profile photo</p>
              </div>
            </div>
          </div>

          <!-- Rating -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Rating & Feedback
            </h4>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="rating" class="block text-sm font-medium text-gray-700">Rating</label>
                <select
                  id="rating"
                  v-model="form.rating"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                >
                  <option value="">No rating</option>
                  <option :value="1">1 Star</option>
                  <option :value="2">2 Stars</option>
                  <option :value="3">3 Stars</option>
                  <option :value="4">4 Stars</option>
                  <option :value="5">5 Stars</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label for="comments" class="block text-sm font-medium text-gray-700"
                  >Comments/Notes</label
                >
                <textarea
                  id="comments"
                  v-model="form.comments"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="Any additional notes about this client..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Car Numbers -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Vehicle Information
            </h4>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Car Numbers</label>
              <div class="space-y-2">
                <div
                  v-for="(carNumber, index) in form.car_numbers || []"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="form.car_numbers![index]"
                    type="text"
                    class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                    placeholder="ABC-123"
                  />
                  <button
                    type="button"
                    @click="removeCarNumber(index)"
                    class="text-red-600 hover:text-red-800 p-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addCarNumber"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Add Car Number
                </button>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Social Links
            </h4>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
              <div class="space-y-2">
                <div
                  v-for="(platform, index) in socialLinksArray"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <input
                    v-model="platform.name"
                    type="text"
                    class="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                    placeholder="Platform (e.g., Facebook)"
                  />
                  <input
                    v-model="platform.url"
                    type="url"
                    class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                    placeholder="https://facebook.com/profile"
                  />
                  <button
                    type="button"
                    @click="removeSocialLink(index)"
                    class="text-red-600 hover:text-red-800 p-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addSocialLink"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Add Social Link
                </button>
              </div>
            </div>
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
              :disabled="loading || !form.first_name.trim() || !form.last_name.trim()"
              class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-0"
            >
              {{ loading ? 'Saving...' : client ? 'Update Client' : 'Create Client' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Client, ClientCreate, ClientUpdate } from '../../types/client'

interface Props {
  client?: Client | null
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: ClientCreate | ClientUpdate): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref<ClientCreate>({
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  photo_url: '',
  car_numbers: [],
  social_links: {},
  rating: undefined,
  comments: '',
})

const errors = ref<Record<string, string>>({})

// Computed property to convert social_links object to array for form editing
const socialLinksArray = computed({
  get: () => {
    if (!form.value.social_links) return []
    return Object.entries(form.value.social_links).map(([name, url]) => ({ name, url }))
  },
  set: (newArray: Array<{ name: string; url: string }>) => {
    const socialLinksObj: Record<string, string> = {}
    newArray.forEach(({ name, url }) => {
      if (name.trim() && url.trim()) {
        socialLinksObj[name.trim()] = url.trim()
      }
    })
    form.value.social_links = socialLinksObj
  }
})

const initializeForm = () => {
  if (props.client) {
    form.value = {
      first_name: props.client.first_name,
      last_name: props.client.last_name,
      phone: props.client.phone || '',
      email: props.client.email || '',
      photo_url: props.client.photo_url || '',
      car_numbers: props.client.car_numbers ? [...props.client.car_numbers] : [],
      social_links: props.client.social_links ? { ...props.client.social_links } : {},
      rating: props.client.rating,
      comments: props.client.comments || '',
      group_id: props.client.group_id,
    }
  } else {
    form.value = {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      photo_url: '',
      car_numbers: [],
      social_links: {},
      rating: undefined,
      comments: '',
    }
  }
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.first_name.trim()) {
    errors.value.first_name = 'First name is required'
  }

  if (!form.value.last_name.trim()) {
    errors.value.last_name = 'Last name is required'
  }

  if (form.value.email && !isValidEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (form.value.phone && !isValidPhone(form.value.phone)) {
    errors.value.phone = 'Please enter a valid phone number'
  }

  return Object.keys(errors.value).length === 0
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

const addCarNumber = () => {
  form.value.car_numbers = form.value.car_numbers || []
  form.value.car_numbers.push('')
}

const removeCarNumber = (index: number) => {
  if (form.value.car_numbers) {
    form.value.car_numbers.splice(index, 1)
  }
}

const addSocialLink = () => {
  const currentArray = socialLinksArray.value
  currentArray.push({ name: '', url: '' })
  socialLinksArray.value = currentArray
}

const removeSocialLink = (index: number) => {
  const currentArray = socialLinksArray.value
  currentArray.splice(index, 1)
  socialLinksArray.value = currentArray
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  // Clean up empty values
  const cleanedData = {
    ...form.value,
    phone: form.value.phone?.trim() || undefined,
    email: form.value.email?.trim() || undefined,
    photo_url: form.value.photo_url?.trim() || undefined,
    comments: form.value.comments?.trim() || undefined,
    car_numbers: form.value.car_numbers?.filter((num) => num.trim()) || undefined,
    social_links: Object.keys(form.value.social_links || {}).length > 0 ? form.value.social_links : undefined,
  }

  emit('save', cleanedData)
}

// Watch for changes in the client prop
watch(() => props.client, initializeForm, { immediate: true })

onMounted(() => {
  initializeForm()
})
</script>
