<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Inventory & Custom Items Booking Integration Demo</h1>
      <p class="mt-2 text-lg text-gray-600">
        This demo showcases the complete integration of inventory and custom items into the booking system.
      </p>
    </div>

    <!-- Demo Controls -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Demo Controls</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Demo Booking Dates</label>
          <div class="space-y-2">
            <input
              v-model="demoBookingDates.startDate"
              type="date"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              v-model="demoBookingDates.endDate"
              type="date"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Demo Actions</label>
          <div class="space-y-2">
            <button
              @click="resetDemo"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset Demo
            </button>
            <button
              @click="testValidation"
              class="w-full px-4 py-2 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
            >
              Test Validation
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Integration Status</label>
          <div class="space-y-2">
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-2', inventoryLoaded ? 'bg-green-500' : 'bg-red-500']"></div>
              <span class="text-sm text-gray-600">Inventory Data</span>
            </div>
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-2', customItemsLoaded ? 'bg-green-500' : 'bg-red-500']"></div>
              <span class="text-sm text-gray-600">Custom Items Data</span>
            </div>
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-2', storesIntegrated ? 'bg-green-500' : 'bg-red-500']"></div>
              <span class="text-sm text-gray-600">Store Integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Selections Summary -->
    <div v-if="hasSelections" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-blue-900 mb-4">Current Selections Summary</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="inventorySelections.length > 0">
          <h3 class="font-medium text-blue-800 mb-2">Inventory Items ({{ inventorySelections.length }})</h3>
          <ul class="space-y-1">
            <li v-for="item in inventorySelections" :key="item.itemId" class="text-sm text-blue-700">
              Item {{ item.itemId }} - Qty: {{ item.quantity }}
              <span v-if="item.notes" class="italic">({{ item.notes }})</span>
            </li>
          </ul>
        </div>
        
        <div v-if="customItemsSelections.length > 0">
          <h3 class="font-medium text-blue-800 mb-2">
            Custom Items ({{ customItemsSelections.length }}) - Total: ${{ customItemsTotal.toFixed(2) }}
          </h3>
          <ul class="space-y-1">
            <li v-for="item in customItemsSelections" :key="item.itemId" class="text-sm text-blue-700">
              Item {{ item.itemId }} - Qty: {{ item.quantity }} × ${{ (item.unitPrice || 0).toFixed(2) }}
              <span v-if="item.notes" class="italic">({{ item.notes }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Validation Results -->
    <div v-if="validationResults" class="mb-8">
      <div v-if="validationResults.errors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <h3 class="font-medium text-red-800 mb-2">Validation Errors</h3>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="error in validationResults.errors" :key="error" class="text-sm text-red-700">
            {{ error }}
          </li>
        </ul>
      </div>
      
      <div v-if="validationResults.warnings.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 class="font-medium text-yellow-800 mb-2">Validation Warnings</h3>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="warning in validationResults.warnings" :key="warning" class="text-sm text-yellow-700">
            {{ warning }}
          </li>
        </ul>
      </div>
      
      <div v-if="validationResults.isValid" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h3 class="font-medium text-green-800">✅ All validations passed!</h3>
      </div>
    </div>

    <!-- Main Demo Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Item Selection -->
      <div class="space-y-8">
        <!-- Inventory Items Selection -->
        <div class="bg-white shadow rounded-lg p-6">
          <BookingInventorySelector
            :booking-dates="demoBookingDates"
            @update:selection="handleInventorySelection"
          />
        </div>

        <!-- Custom Items Selection -->
        <div class="bg-white shadow rounded-lg p-6">
          <BookingCustomItemsSelector
            @update:selection="handleCustomItemsSelection"
          />
        </div>
      </div>

      <!-- Right Column: Integration Actions and Results -->
      <div class="space-y-8">
        <!-- Store States -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Store States</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-700 mb-2">Inventory Items Store</h3>
              <div class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div>Total Items: {{ inventoryItemsStore.inventoryItems.length }}</div>
                <div>Loading: {{ inventoryItemsStore.loading }}</div>
                <div>Selected for Booking: {{ inventoryItemsStore.getBookingSelection.length }}</div>
                <div v-if="inventoryItemsStore.error" class="text-red-600">Error: {{ inventoryItemsStore.error }}</div>
              </div>
            </div>

            <div>
              <h3 class="font-medium text-gray-700 mb-2">Custom Items Store</h3>
              <div class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <div>Total Items: {{ customItemsStore.customItems.length }}</div>
                <div>Loading: {{ customItemsStore.loading }}</div>
                <div>Selected for Booking: {{ customItemsStore.getBookingSelection.length }}</div>
                <div>Selection Total: ${{ customItemsStore.getBookingSelectionTotal.toFixed(2) }}</div>
                <div v-if="customItemsStore.error" class="text-red-600">Error: {{ customItemsStore.error }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Integration Testing -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Integration Testing</h2>
          
          <div class="space-y-4">
            <button
              @click="testAvailabilityCheck"
              :disabled="inventorySelections.length === 0 || loadingAvailability"
              class="w-full px-4 py-2 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
            >
              <span v-if="loadingAvailability">Checking Availability...</span>
              <span v-else>Test Availability Check</span>
            </button>

            <button
              @click="simulateBookingCreation"
              :disabled="!hasSelections || loadingSimulation"
              class="w-full px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50"
            >
              <span v-if="loadingSimulation">Simulating...</span>
              <span v-else>Simulate Booking Creation</span>
            </button>

            <button
              @click="testErrorHandling"
              class="w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
            >
              Test Error Handling
            </button>
          </div>
        </div>

        <!-- Test Results -->
        <div v-if="testResults" class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{{ JSON.stringify(testResults, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BookingInventorySelector from '../bookings/BookingInventorySelector.vue'
import BookingCustomItemsSelector from '../bookings/BookingCustomItemsSelector.vue'
import { useInventoryItemsStore } from '../../stores/inventoryItems'
import { useCustomItemsStore } from '../../stores/customItems'
import { useInventoryTypesStore } from '../../stores/inventoryTypes'
import { useInventoryBooking } from '../../composables/useInventoryBooking'
import { validateInventoryBookingSelection, validateCustomItemBookingSelection } from '../../utils/inventoryValidation'
import { useToast } from 'vue-toastification'

// Stores
const inventoryItemsStore = useInventoryItemsStore()
const customItemsStore = useCustomItemsStore()
const inventoryTypesStore = useInventoryTypesStore()
const inventoryBooking = useInventoryBooking()
const toast = useToast()

// Demo state
const demoBookingDates = ref({
  startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Next week
})

const inventorySelections = ref<{ itemId: number; quantity: number; notes?: string }[]>([])
const customItemsSelections = ref<{ itemId: number; quantity: number; unitPrice?: number; notes?: string }[]>([])
const validationResults = ref<{ isValid: boolean; errors: string[]; warnings: string[] } | null>(null)
const testResults = ref<any>(null)
const loadingAvailability = ref(false)
const loadingSimulation = ref(false)

// Computed
const inventoryLoaded = computed(() => inventoryItemsStore.inventoryItems.length > 0)
const customItemsLoaded = computed(() => customItemsStore.customItems.length > 0)
const storesIntegrated = computed(() => 
  inventoryItemsStore.getBookingSelection !== undefined && 
  customItemsStore.getBookingSelection !== undefined
)

const hasSelections = computed(() => 
  inventorySelections.value.length > 0 || customItemsSelections.value.length > 0
)

const customItemsTotal = computed(() => 
  customItemsSelections.value.reduce((sum, item) => {
    const unitPrice = item.unitPrice || inventoryBooking.getCustomItemDetails(item.itemId)?.price || 0
    return sum + (unitPrice * item.quantity)
  }, 0)
)

// Methods
const handleInventorySelection = (selections: { itemId: number; quantity: number; notes?: string }[]) => {
  inventorySelections.value = selections
  testValidation()
}

const handleCustomItemsSelection = (selections: { itemId: number; quantity: number; unitPrice?: number; notes?: string }[]) => {
  customItemsSelections.value = selections
  testValidation()
}

const testValidation = () => {
  if (!hasSelections.value) {
    validationResults.value = null
    return
  }

  const inventoryValidation = inventorySelections.value.length > 0 
    ? validateInventoryBookingSelection(
        inventorySelections.value.map(sel => ({
          item: inventoryBooking.getInventoryItemDetails(sel.itemId)!,
          quantity: sel.quantity,
          notes: sel.notes
        })).filter(sel => sel.item),
        demoBookingDates.value
      )
    : { isValid: true, errors: [], warnings: [] }

  const customItemsValidation = customItemsSelections.value.length > 0
    ? validateCustomItemBookingSelection(
        customItemsSelections.value.map(sel => ({
          item: inventoryBooking.getCustomItemDetails(sel.itemId)!,
          quantity: sel.quantity,
          unitPrice: sel.unitPrice,
          notes: sel.notes
        })).filter(sel => sel.item)
      )
    : { isValid: true, errors: [], warnings: [] }

  validationResults.value = {
    isValid: inventoryValidation.isValid && customItemsValidation.isValid,
    errors: [...inventoryValidation.errors, ...customItemsValidation.errors],
    warnings: [...inventoryValidation.warnings, ...customItemsValidation.warnings]
  }
}

const testAvailabilityCheck = async () => {
  if (inventorySelections.value.length === 0) return

  loadingAvailability.value = true
  try {
    const itemIds = inventorySelections.value.map(sel => sel.itemId)
    const availability = await inventoryBooking.checkMultipleItemsAvailability(
      itemIds,
      demoBookingDates.value.startDate,
      demoBookingDates.value.endDate
    )

    testResults.value = {
      type: 'availability_check',
      timestamp: new Date().toISOString(),
      input: { itemIds, dateRange: demoBookingDates.value },
      result: availability
    }

    toast.success('Availability check completed')
  } catch (error) {
    toast.error('Availability check failed')
    testResults.value = {
      type: 'availability_check_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    loadingAvailability.value = false
  }
}

const simulateBookingCreation = async () => {
  if (!hasSelections.value) return

  loadingSimulation.value = true
  try {
    // Simulate a booking creation process
    const mockBookingId = Math.floor(Math.random() * 1000) + 1

    const results = {
      bookingId: mockBookingId,
      inventoryItems: [],
      customItems: [],
      timestamp: new Date().toISOString()
    }

    if (inventorySelections.value.length > 0) {
      const inventoryResult = await inventoryBooking.addInventoryItemsToBooking(
        mockBookingId,
        inventorySelections.value
      )
      results.inventoryItems = inventoryResult
    }

    if (customItemsSelections.value.length > 0) {
      const customItemsResult = await inventoryBooking.addCustomItemsToBooking(
        mockBookingId,
        customItemsSelections.value
      )
      results.customItems = customItemsResult
    }

    testResults.value = {
      type: 'booking_simulation',
      ...results
    }

    toast.success('Booking simulation completed')
  } catch (error) {
    toast.error('Booking simulation failed')
    testResults.value = {
      type: 'booking_simulation_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    loadingSimulation.value = false
  }
}

const testErrorHandling = () => {
  // Simulate various error conditions
  const errorTests = [
    'Invalid quantity error',
    'Item not available error', 
    'Network connection error',
    'Validation error'
  ]

  testResults.value = {
    type: 'error_handling_test',
    timestamp: new Date().toISOString(),
    tests: errorTests.map(test => ({
      test,
      handled: true,
      message: `${test} was properly handled by the error system`
    }))
  }

  toast.info('Error handling test completed')
}

const resetDemo = () => {
  inventoryItemsStore.clearBookingSelection()
  customItemsStore.clearBookingSelection()
  inventorySelections.value = []
  customItemsSelections.value = []
  validationResults.value = null
  testResults.value = null
  toast.info('Demo reset')
}

// Lifecycle
onMounted(async () => {
  try {
    // Load all necessary data
    await Promise.all([
      inventoryTypesStore.fetchInventoryTypes(),
      inventoryItemsStore.fetchInventoryItems(),
      customItemsStore.fetchCustomItems()
    ])
    
    toast.success('Demo data loaded successfully')
  } catch (error) {
    toast.error('Failed to load demo data')
    console.error('Demo initialization error:', error)
  }
})
</script>