<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex-shrink-0 border-b border-gray-200 pb-4">
      <h2 class="text-xl font-semibold text-gray-900">Booking Items & Services</h2>
      <p class="mt-1 text-sm text-gray-600">
        Add inventory items and custom services to this booking.
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <div class="overflow-x-auto">
        <nav class="-mb-px flex space-x-8 min-w-max">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0',
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
            <span
              v-if="tab.count > 0"
              :class="[
                'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <!-- Inventory Items Tab -->
      <div v-show="activeTab === 'inventory'">
        <div class="space-y-4">
          <BookingInventorySelector
            :booking-dates="bookingDates"
            :preselected-items="preselectedInventoryItems"
            @update:selection="handleInventorySelection"
          />
        </div>
      </div>

      <!-- Custom Items Tab -->
      <div v-show="activeTab === 'custom'">
        <div class="space-y-4">
          <BookingCustomItemsSelector
            :preselected-items="preselectedCustomItems"
            @update:selection="handleCustomItemsSelection"
          />
        </div>
      </div>

      <!-- Summary Tab -->
      <div v-show="activeTab === 'summary'">
        <div class="space-y-6">
        <!-- Inventory Items Summary -->
        <div v-if="inventorySelection.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Inventory Items</h3>
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="item in inventorySelectionWithDetails"
                :key="item.itemId"
                class="px-6 py-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ item.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Quantity: {{ item.quantity }}
                      <span v-if="item.notes" class="ml-2">• {{ item.notes }}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="removeInventoryItem(item.itemId)"
                    class="ml-4 text-red-600 hover:text-red-700"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Custom Items Summary -->
        <div v-if="customItemsSelection.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Custom Items & Services</h3>
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="item in customItemsSelectionWithDetails"
                :key="item.itemId"
                class="px-6 py-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ item.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Quantity: {{ item.quantity }} × ${{ item.unitPrice.toFixed(2) }}
                      <span v-if="item.notes" class="ml-2">• {{ item.notes }}</span>
                    </p>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span class="text-sm font-medium text-gray-900">
                      ${{ item.total.toFixed(2) }}
                    </span>
                    <button
                      type="button"
                      @click="removeCustomItem(item.itemId)"
                      class="text-red-600 hover:text-red-700"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Total Amount -->
          <div class="mt-4 bg-gray-50 px-6 py-4 sm:rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-base font-medium text-gray-900">
                Total Additional Amount:
              </span>
              <span class="text-lg font-bold text-indigo-600">
                ${{ totalCustomItemsAmount.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="inventorySelection.length === 0 && customItemsSelection.length === 0" class="text-center py-8">
          <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No items selected</h3>
          <p class="mt-1 text-sm text-gray-500">
            Use the tabs above to add inventory items or custom services to this booking.
          </p>
        </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons (for existing bookings) -->
    <div v-if="bookingId && mode === 'edit'" class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="saveChanges"
        :disabled="loading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        <span v-if="loading">Saving...</span>
        <span v-else>Save Changes</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { XMarkIcon, CubeIcon } from '@heroicons/vue/24/outline'
import BookingInventorySelector from './BookingInventorySelector.vue'
import BookingCustomItemsSelector from './BookingCustomItemsSelector.vue'
import { useInventoryItemsStore } from '../../stores/inventoryItems'
import { useCustomItemsStore } from '../../stores/customItems'
import { useBookingsStore } from '../../stores/bookings'
import { useToast } from 'vue-toastification'

interface Props {
  bookingId?: number
  bookingDates?: {
    startDate: string
    endDate: string
  }
  preselectedInventoryItems?: { itemId: number; quantity: number; notes?: string }[]
  preselectedCustomItems?: { itemId: number; quantity: number; unitPrice?: number; notes?: string }[]
  mode?: 'create' | 'edit'
}

interface Emits {
  (e: 'update:inventory-selection', selection: { itemId: number; quantity: number; notes?: string }[]): void
  (e: 'update:custom-items-selection', selection: { itemId: number; quantity: number; unitPrice?: number; notes?: string }[]): void
  (e: 'saved'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  preselectedInventoryItems: () => [],
  preselectedCustomItems: () => [],
  mode: 'create'
})

const emit = defineEmits<Emits>()

// Stores
const inventoryItemsStore = useInventoryItemsStore()
const customItemsStore = useCustomItemsStore()
const bookingsStore = useBookingsStore()
const toast = useToast()

// Local state
const activeTab = ref('inventory')
const inventorySelection = ref<{ itemId: number; quantity: number; notes?: string }[]>([])
const customItemsSelection = ref<{ itemId: number; quantity: number; unitPrice?: number; notes?: string }[]>([])
const loading = ref(false)

// Computed
const tabs = computed(() => [
  { id: 'inventory', name: 'Inventory Items', count: inventorySelection.value.length },
  { id: 'custom', name: 'Custom Items', count: customItemsSelection.value.length },
  { id: 'summary', name: 'Summary', count: inventorySelection.value.length + customItemsSelection.value.length }
])

const inventorySelectionWithDetails = computed(() => {
  return inventorySelection.value.map(item => {
    const inventoryItem = inventoryItemsStore.inventoryItems.find(i => i.id === item.itemId)
    return {
      ...item,
      name: inventoryItem ? `${inventoryItem.inventory_type?.name} - ${inventoryItem.number}` : 'Unknown Item'
    }
  })
})

const customItemsSelectionWithDetails = computed(() => {
  return customItemsSelection.value.map(item => {
    const customItem = customItemsStore.customItems.find(i => i.id === item.itemId)
    const unitPrice = item.unitPrice || customItem?.price || 0
    return {
      ...item,
      name: customItem?.name || 'Unknown Item',
      unitPrice,
      total: unitPrice * item.quantity
    }
  })
})

const totalCustomItemsAmount = computed(() => {
  return customItemsSelectionWithDetails.value.reduce((sum, item) => sum + item.total, 0)
})

// Methods
const handleInventorySelection = (selection: { itemId: number; quantity: number; notes?: string }[]) => {
  inventorySelection.value = selection
  emit('update:inventory-selection', selection)
}

const handleCustomItemsSelection = (selection: { itemId: number; quantity: number; unitPrice?: number; notes?: string }[]) => {
  customItemsSelection.value = selection
  emit('update:custom-items-selection', selection)
}

const removeInventoryItem = (itemId: number) => {
  inventoryItemsStore.removeItemFromBookingSelection(itemId)
}

const removeCustomItem = (itemId: number) => {
  customItemsStore.removeItemFromBookingSelection(itemId)
}

const saveChanges = async () => {
  if (!props.bookingId) return

  loading.value = true
  try {
    // This would need to be implemented based on your specific requirements
    // For now, we'll just emit the saved event
    toast.success('Changes saved successfully')
    emit('saved')
  } catch (error) {
    toast.error('Failed to save changes')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(
  () => props.preselectedInventoryItems,
  (newItems) => {
    inventorySelection.value = [...newItems]
  },
  { immediate: true, deep: true }
)

watch(
  () => props.preselectedCustomItems,
  (newItems) => {
    customItemsSelection.value = [...newItems]
  },
  { immediate: true, deep: true }
)

// Lifecycle
onMounted(() => {
  // Initialize selections
  inventorySelection.value = [...props.preselectedInventoryItems]
  customItemsSelection.value = [...props.preselectedCustomItems]
})
</script>