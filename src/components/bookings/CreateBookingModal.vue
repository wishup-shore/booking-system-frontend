<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6"
  >
    <div
      class="relative w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg border max-h-[95vh] flex flex-col"
    >
      <!-- Modal Header - Fixed -->
      <div class="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Create New Booking</h3>
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
      </div>

      <!-- Modal Content - Scrollable -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Step 1: Client Selection -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Step 1: Select Client
            </h4>

            <div>
              <label for="client_id" class="block text-sm font-medium text-gray-700">
                Client <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <input
                  v-model="clientSearch"
                  @input="searchClients"
                  type="text"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="Search clients by name, phone, or email..."
                  :class="{ 'pr-10': form.client_id }"
                />
                <div v-if="form.client_id" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Client Search Results -->
              <div v-if="showClientResults && clientResults.length > 0" class="mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <ul class="py-1">
                  <li
                    v-for="client in clientResults"
                    :key="client.id"
                    @click="selectClient(client)"
                    class="cursor-pointer hover:bg-gray-100 px-3 py-2"
                  >
                    <div class="flex items-center">
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900">
                          {{ client.first_name }} {{ client.last_name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ client.phone }} • {{ client.email }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Selected Client Display -->
              <div v-if="selectedClient" class="mt-2 p-3 bg-gray-50 rounded-md border">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-primary-600">
                      {{ getClientInitials(selectedClient) }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      {{ selectedClient.first_name }} {{ selectedClient.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ selectedClient.phone }} • {{ selectedClient.email }}
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="clearClient"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <p v-if="errors.client_id" class="mt-1 text-sm text-red-600">{{ errors.client_id }}</p>
            </div>
          </div>

          <!-- Step 2: Accommodation Selection -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Step 2: Select Accommodation
            </h4>

            <div>
              <label for="accommodation_id" class="block text-sm font-medium text-gray-700">
                Accommodation <span class="text-red-500">*</span>
              </label>
              <select
                id="accommodation_id"
                v-model="form.accommodation_id"
                @change="loadAccommodationDetails"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              >
                <option value="">Select accommodation</option>
                <option 
                  v-for="accommodation in availableAccommodations"
                  :key="accommodation.id"
                  :value="accommodation.id"
                >
                  {{ accommodation.number }} - {{ accommodation.type.name }} (Capacity: {{ accommodation.capacity }})
                </option>
              </select>
              <p v-if="errors.accommodation_id" class="mt-1 text-sm text-red-600">{{ errors.accommodation_id }}</p>
            </div>

            <!-- Selected Accommodation Details -->
            <div v-if="selectedAccommodation" class="mt-2 p-3 bg-gray-50 rounded-md border">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-500">Number:</span>
                  <span class="text-gray-900 ml-1">{{ selectedAccommodation.number }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Type:</span>
                  <span class="text-gray-900 ml-1">{{ selectedAccommodation.type.name }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Capacity:</span>
                  <span class="text-gray-900 ml-1">{{ selectedAccommodation.capacity }} guests</span>
                </div>
                <div>
                  <span class="font-medium text-gray-500">Price:</span>
                  <span class="text-gray-900 ml-1">${{ selectedAccommodation.price_per_night }}/night</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Booking Details -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Step 3: Booking Details
            </h4>

            <!-- Open Dates Option -->
            <div class="flex items-center">
              <input
                id="is_open_dates"
                v-model="form.is_open_dates"
                type="checkbox"
                class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <label for="is_open_dates" class="ml-2 block text-sm text-gray-900">
                Open dates booking (flexible dates)
              </label>
            </div>

            <!-- Date Fields (only if not open dates) -->
            <div v-if="!form.is_open_dates" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="check_in_date" class="block text-sm font-medium text-gray-700">
                  Check-in Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="check_in_date"
                  v-model="form.check_in_date"
                  @change="handleDateChange"
                  type="date"
                  :min="minDate"
                  :required="!form.is_open_dates"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                />
                <p v-if="errors.check_in_date" class="mt-1 text-sm text-red-600">{{ errors.check_in_date }}</p>
              </div>

              <div>
                <label for="check_out_date" class="block text-sm font-medium text-gray-700">
                  Check-out Date <span class="text-red-500">*</span>
                </label>
                <input
                  id="check_out_date"
                  v-model="form.check_out_date"
                  @change="handleDateChange"
                  type="date"
                  :min="form.check_in_date"
                  :required="!form.is_open_dates"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                />
                <p v-if="errors.check_out_date" class="mt-1 text-sm text-red-600">{{ errors.check_out_date }}</p>
              </div>
            </div>

            <!-- Availability Check Results -->
            <div v-if="availabilityChecking" class="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <svg class="animate-spin h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-blue-700">Checking availability...</span>
            </div>

            <div v-if="availabilityResult && !availabilityChecking" class="p-4 rounded-lg" :class="availabilityResult.is_available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <div class="flex items-center">
                <svg v-if="availabilityResult.is_available" class="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span :class="availabilityResult.is_available ? 'text-green-800' : 'text-red-800'" class="font-medium">
                  {{ availabilityResult.is_available ? 'Available' : 'Not Available' }}
                </span>
              </div>
              
              <div v-if="!availabilityResult.is_available" class="mt-2">
                <div v-if="availabilityResult.conflicting_bookings && availabilityResult.conflicting_bookings.length > 0" class="text-sm text-red-700">
                  <p class="font-medium">Conflicting bookings:</p>
                  <ul class="mt-1 list-disc list-inside">
                    <li v-for="booking in availabilityResult.conflicting_bookings" :key="booking.id">
                      {{ booking.client_name }} ({{ formatDate(booking.check_in_date) }} - {{ formatDate(booking.check_out_date) }})
                    </li>
                  </ul>
                </div>
                <div v-if="availabilityResult.next_available_date" class="mt-2 text-sm text-red-700">
                  <p><strong>Next available date:</strong> {{ formatDate(availabilityResult.next_available_date) }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="guests_count" class="block text-sm font-medium text-gray-700">
                  Number of Guests <span class="text-red-500">*</span>
                </label>
                <input
                  id="guests_count"
                  v-model.number="form.guests_count"
                  type="number"
                  min="1"
                  :max="selectedAccommodation?.capacity || 10"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="Number of guests"
                />
                <p v-if="errors.guests_count" class="mt-1 text-sm text-red-600">{{ errors.guests_count }}</p>
              </div>

              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">
                  Initial Status
                </label>
                <select
                  id="status"
                  v-model="form.status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                >
                  <option :value="BookingStatus.PENDING">Pending</option>
                  <option :value="BookingStatus.CONFIRMED">Confirmed</option>
                </select>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="total_amount" class="block text-sm font-medium text-gray-700">
                  Total Amount <span class="text-red-500">*</span>
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="total_amount"
                    v-model.number="form.total_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                    placeholder="0.00"
                  />
                </div>
                <p v-if="calculatedNights > 0" class="mt-1 text-sm text-gray-500">
                  {{ calculatedNights }} nights × ${{ selectedAccommodation?.price_per_night }}
                </p>
                <p v-if="errors.total_amount" class="mt-1 text-sm text-red-600">{{ errors.total_amount }}</p>
              </div>

              <div>
                <label for="paid_amount" class="block text-sm font-medium text-gray-700">
                  Initial Payment
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="paid_amount"
                    v-model.number="form.paid_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    :max="form.total_amount"
                    class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label for="comments" class="block text-sm font-medium text-gray-700">
                Comments/Notes
              </label>
              <textarea
                id="comments"
                v-model="form.comments"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                placeholder="Any additional notes about this booking..."
              ></textarea>
            </div>
          </div>

          <!-- Step 4: Inventory & Custom Items -->
          <div v-if="form.client_id && form.accommodation_id" class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Step 4: Inventory & Custom Items (Optional)
            </h4>
            
            <BookingItemsManager
              :booking-dates="bookingDates"
              mode="create"
              @update:inventory-selection="handleInventorySelection"
              @update:custom-items-selection="handleCustomItemsSelection"
            />
          </div>

          <!-- Summary -->
          <div v-if="form.client_id && form.accommodation_id" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-md font-medium text-blue-900 mb-3">Booking Summary</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span class="font-medium text-blue-700">Client:</span>
                <span class="text-blue-900 ml-1">{{ selectedClient?.first_name }} {{ selectedClient?.last_name }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-700">Accommodation:</span>
                <span class="text-blue-900 ml-1">{{ selectedAccommodation?.number }}</span>
              </div>
              <div v-if="!form.is_open_dates">
                <span class="font-medium text-blue-700">Dates:</span>
                <span class="text-blue-900 ml-1">{{ formatDate(form.check_in_date) }} - {{ formatDate(form.check_out_date) }}</span>
              </div>
              <div v-else>
                <span class="font-medium text-blue-700">Dates:</span>
                <span class="text-orange-600 ml-1 font-medium">Open Dates</span>
              </div>
              <div>
                <span class="font-medium text-blue-700">Guests:</span>
                <span class="text-blue-900 ml-1">{{ form.guests_count }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-700">Accommodation:</span>
                <span class="text-blue-900 ml-1">${{ formatCurrency(form.total_amount) }}</span>
              </div>
              <div v-if="customItemsTotal > 0">
                <span class="font-medium text-blue-700">Custom Items:</span>
                <span class="text-blue-900 ml-1">${{ formatCurrency(customItemsTotal) }}</span>
              </div>
              <div v-if="inventorySelection.length > 0">
                <span class="font-medium text-blue-700">Inventory Items:</span>
                <span class="text-blue-900 ml-1">{{ inventorySelection.length }} item(s)</span>
              </div>
              <div class="col-span-2 pt-2 border-t border-blue-200">
                <span class="font-medium text-blue-700 text-base">Total Amount:</span>
                <span class="text-blue-900 ml-1 text-base font-semibold">${{ formatCurrency(totalBookingAmount) }}</span>
              </div>
            </div>
          </div>

        </form>
      </div>

      <!-- Modal Footer - Fixed -->
      <div class="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200">
        <div class="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 touch-manipulation min-h-[44px] sm:min-h-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="loading || !isFormValid"
            class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-0"
          >
            {{ loading ? 'Creating...' : 'Create Booking' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import { ClientService } from '../../services/clientService'
import { AccommodationService } from '../../services/accommodationService'
import { AvailabilityService } from '../../services/availabilityService'
import { BookingStatus, PaymentStatus } from '../../types/booking'
import type { Client } from '../../types/client'
import type { Accommodation } from '../../types/accommodation'
import type { BookingCreate } from '../../types/booking'
import type { AccommodationAvailabilityResponse } from '../../services/availabilityService'
import BookingItemsManager from './BookingItemsManager.vue'
import type { InventoryItemSelection, CustomItemSelection } from '../../types/inventory'

interface Props {
  loading?: boolean
}

interface BookingCreateWithItems extends BookingCreate {
  inventory_items?: InventoryItemSelection[]
  custom_items?: CustomItemSelection[]
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: BookingCreateWithItems): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const clientSearch = ref('')
const clientResults = ref<Client[]>([])
const showClientResults = ref(false)
const selectedClient = ref<Client | null>(null)
const selectedAccommodation = ref<Accommodation | null>(null)
const availableAccommodations = ref<Accommodation[]>([])

// Availability checking
const availabilityChecking = ref(false)
const availabilityResult = ref<AccommodationAvailabilityResponse | null>(null)

// Inventory and custom items
const inventorySelection = ref<InventoryItemSelection[]>([])
const customItemsSelection = ref<CustomItemSelection[]>([])
const inventoryTotal = ref(0)
const customItemsTotal = ref(0)

const form = ref<BookingCreate>({
  client_id: 0,
  accommodation_id: 0,
  check_in_date: '',
  check_out_date: '',
  is_open_dates: false,
  guests_count: 1,
  status: BookingStatus.PENDING,
  payment_status: PaymentStatus.NOT_PAID,
  total_amount: 0,
  paid_amount: 0,
  comments: ''
})

const errors = ref<Record<string, string>>({})

// Computed
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const calculatedNights = computed(() => {
  if (!form.value.check_in_date || !form.value.check_out_date) return 0
  const checkIn = new Date(form.value.check_in_date)
  const checkOut = new Date(form.value.check_out_date)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
})

const bookingDates = computed(() => {
  if (form.value.is_open_dates) {
    return null
  }
  return {
    startDate: form.value.check_in_date,
    endDate: form.value.check_out_date
  }
})

const totalBookingAmount = computed(() => {
  return Number(form.value.total_amount) + inventoryTotal.value + customItemsTotal.value
})

const isFormValid = computed(() => {
  const basicValid = form.value.client_id && 
         form.value.accommodation_id && 
         Number(form.value.guests_count) > 0 && 
         Number(form.value.total_amount) > 0 &&
         (form.value.is_open_dates || (form.value.check_in_date && form.value.check_out_date))
  
  // For open dates bookings, don't check availability
  if (form.value.is_open_dates) {
    return basicValid
  }
  
  // For regular bookings, ensure availability is checked and available
  return basicValid && 
         availabilityResult.value !== null && 
         availabilityResult.value.is_available &&
         !availabilityChecking.value
})

// Methods
const searchClients = debounce(async () => {
  if (clientSearch.value.length < 2) {
    clientResults.value = []
    showClientResults.value = false
    return
  }

  try {
    const response = await ClientService.getClients({
      search: clientSearch.value,
      limit: 10
    })
    clientResults.value = response.clients
    showClientResults.value = true
  } catch (error) {
    console.error('Error searching clients:', error)
    clientResults.value = []
    showClientResults.value = false
  }
}, 300)

const selectClient = (client: Client) => {
  selectedClient.value = client
  form.value.client_id = client.id
  clientSearch.value = `${client.first_name} ${client.last_name}`
  showClientResults.value = false
}

const clearClient = () => {
  selectedClient.value = null
  form.value.client_id = 0
  clientSearch.value = ''
  showClientResults.value = false
}

const loadAccommodations = async () => {
  try {
    const accommodations = await AccommodationService.getAccommodations()
    // Filter to only available accommodations
    availableAccommodations.value = accommodations.filter(
      acc => acc.status === 'available'
    )
  } catch (error) {
    console.error('Error loading accommodations:', error)
    availableAccommodations.value = []
  }
}

const loadAccommodationDetails = () => {
  selectedAccommodation.value = availableAccommodations.value.find(
    acc => acc.id === form.value.accommodation_id
  ) || null
  
  if (selectedAccommodation.value) {
    form.value.guests_count = Math.min(form.value.guests_count, selectedAccommodation.value.capacity)
    calculateTotal()
  }
}

const calculateTotal = () => {
  if (!selectedAccommodation.value) return
  
  if (form.value.is_open_dates) {
    // For open dates, set a base price or leave for manual entry
    form.value.total_amount = Number(selectedAccommodation.value.price_per_night)
  } else if (calculatedNights.value > 0) {
    form.value.total_amount = calculatedNights.value * Number(selectedAccommodation.value.price_per_night)
  }
}

const checkAvailability = debounce(async () => {
  if (!form.value.accommodation_id || !form.value.check_in_date || !form.value.check_out_date || form.value.is_open_dates) {
    availabilityResult.value = null
    return
  }

  try {
    availabilityChecking.value = true
    availabilityResult.value = await AvailabilityService.checkAccommodationAvailability(
      form.value.accommodation_id,
      form.value.check_in_date,
      form.value.check_out_date
    )
  } catch (error) {
    console.error('Error checking availability:', error)
    availabilityResult.value = null
  } finally {
    availabilityChecking.value = false
  }
}, 500)

const handleDateChange = () => {
  calculateTotal()
  checkAvailability()
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.client_id) {
    errors.value.client_id = 'Please select a client'
  }

  if (!form.value.accommodation_id) {
    errors.value.accommodation_id = 'Please select an accommodation'
  }

  if (!form.value.is_open_dates) {
    if (!form.value.check_in_date) {
      errors.value.check_in_date = 'Check-in date is required'
    }
    if (!form.value.check_out_date) {
      errors.value.check_out_date = 'Check-out date is required'
    }
    if (form.value.check_in_date && form.value.check_out_date && 
        new Date(form.value.check_out_date) <= new Date(form.value.check_in_date)) {
      errors.value.check_out_date = 'Check-out date must be after check-in date'
    }
  }

  if (Number(form.value.guests_count) < 1) {
    errors.value.guests_count = 'At least 1 guest is required'
  }

  if (selectedAccommodation.value && Number(form.value.guests_count) > selectedAccommodation.value.capacity) {
    errors.value.guests_count = `Maximum ${selectedAccommodation.value.capacity} guests for this accommodation`
  }

  if (Number(form.value.total_amount) <= 0) {
    errors.value.total_amount = 'Total amount must be greater than 0'
  }

  // Check availability for regular bookings
  if (!form.value.is_open_dates && form.value.accommodation_id && form.value.check_in_date && form.value.check_out_date) {
    if (!availabilityResult.value) {
      errors.value.availability = 'Please wait for availability check to complete'
    } else if (!availabilityResult.value.is_available) {
      errors.value.availability = 'Selected accommodation is not available for the chosen dates'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  // Clean up the form data
  const paidAmount = Number(form.value.paid_amount) || 0
  const totalAmount = Number(form.value.total_amount)
  
  const finalTotalAmount = totalBookingAmount.value
  
  const bookingData: BookingCreateWithItems = {
    client_id: form.value.client_id,
    accommodation_id: form.value.accommodation_id,
    check_in_date: form.value.is_open_dates ? undefined : form.value.check_in_date,
    check_out_date: form.value.is_open_dates ? undefined : form.value.check_out_date,
    is_open_dates: form.value.is_open_dates,
    guests_count: Number(form.value.guests_count),
    status: form.value.status,
    payment_status: paidAmount > 0 ? 
      (paidAmount >= finalTotalAmount ? PaymentStatus.PAID : PaymentStatus.PARTIAL) : 
      PaymentStatus.NOT_PAID,
    total_amount: finalTotalAmount,
    paid_amount: paidAmount,
    comments: form.value.comments?.trim() || undefined,
    inventory_items: inventorySelection.value.length > 0 ? inventorySelection.value : undefined,
    custom_items: customItemsSelection.value.length > 0 ? customItemsSelection.value : undefined
  }

  emit('save', bookingData)
}

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: string | number): string => {
  return Number(amount).toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getClientInitials = (client: Client): string => {
  return `${client.first_name.charAt(0)}${client.last_name.charAt(0)}`.toUpperCase()
}

// Inventory and custom items handlers
const handleInventorySelection = (selection: InventoryItemSelection[]) => {
  inventorySelection.value = selection
  // Calculate total for inventory items (items are already priced through accommodation rates or separate pricing)
  inventoryTotal.value = 0 // Usually inventory items don't add to total cost, they're included
}

const handleCustomItemsSelection = (selection: CustomItemSelection[]) => {
  customItemsSelection.value = selection
  // Calculate total for custom items
  customItemsTotal.value = selection.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

// Watchers
watch(() => form.value.is_open_dates, () => {
  if (form.value.is_open_dates) {
    form.value.check_in_date = ''
    form.value.check_out_date = ''
    availabilityResult.value = null
  }
  calculateTotal()
})

watch(() => form.value.accommodation_id, () => {
  availabilityResult.value = null
  if (form.value.accommodation_id && form.value.check_in_date && form.value.check_out_date && !form.value.is_open_dates) {
    checkAvailability()
  }
})

watch(() => form.value.paid_amount, (newAmount) => {
  const paidAmount = Number(newAmount) || 0
  const totalAmount = Number(form.value.total_amount) || 0
  
  if (paidAmount > 0 && totalAmount > 0) {
    if (paidAmount >= totalAmount) {
      form.value.payment_status = PaymentStatus.PAID
    } else {
      form.value.payment_status = PaymentStatus.PARTIAL
    }
  } else {
    form.value.payment_status = PaymentStatus.NOT_PAID
  }
})

// Lifecycle
onMounted(() => {
  loadAccommodations()
  
  // Set default dates
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)
  
  form.value.check_in_date = tomorrow.toISOString().split('T')[0]
  form.value.check_out_date = dayAfter.toISOString().split('T')[0]
})

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('.relative')) {
    showClientResults.value = false
  }
})
</script>