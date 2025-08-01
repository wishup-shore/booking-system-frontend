<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Booking Items & Services</h3>
      <div v-if="canEdit" class="flex space-x-2">
        <button
          @click="$emit('edit-items')"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit Items
        </button>
        <button
          @click="showAddItems = true"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Add Items
        </button>
      </div>
    </div>

    <!-- Inventory Items -->
    <div v-if="inventoryItems.length > 0">
      <h4 class="text-base font-medium text-gray-900 mb-3">Inventory Items</h4>
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="item in inventoryItems"
            :key="item.id"
            class="px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ item.inventory_item?.inventory_type?.name }} - {{ item.inventory_item?.number }}
                    </p>
                    <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Quantity: {{ item.quantity }}</span>
                      <span v-if="item.inventory_item?.condition" class="inline-flex items-center">
                        <span
                          :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getConditionClasses(item.inventory_item.condition)
                          ]"
                        >
                          {{ item.inventory_item.condition }}
                        </span>
                      </span>
                    </div>
                    <p v-if="item.notes" class="mt-1 text-sm text-gray-600">
                      <span class="font-medium">Notes:</span> {{ item.notes }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-if="canEdit" class="flex items-center space-x-2">
                <button
                  @click="removeInventoryItem(item)"
                  class="text-red-600 hover:text-red-700 p-1"
                  :disabled="loading"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Custom Items -->
    <div v-if="customItems.length > 0">
      <h4 class="text-base font-medium text-gray-900 mb-3">Custom Items & Services</h4>
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="item in customItems"
            :key="item.id"
            class="px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ item.custom_item?.name }}
                </p>
                <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Quantity: {{ item.quantity }}</span>
                  <span>Unit Price: ${{ item.unit_price.toFixed(2) }}</span>
                  <span class="font-medium text-gray-900">
                    Total: ${{ (item.quantity * item.unit_price).toFixed(2) }}
                  </span>
                </div>
                <p v-if="item.notes" class="mt-1 text-sm text-gray-600">
                  <span class="font-medium">Notes:</span> {{ item.notes }}
                </p>
              </div>
              <div v-if="canEdit" class="flex items-center space-x-2">
                <button
                  @click="removeCustomItem(item)"
                  class="text-red-600 hover:text-red-700 p-1"
                  :disabled="loading"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Custom Items Total -->
      <div class="mt-4 bg-gray-50 px-6 py-3 sm:rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">
            Custom Items Total:
          </span>
          <span class="text-lg font-bold text-indigo-600">
            ${{ customItemsTotal.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="inventoryItems.length === 0 && customItems.length === 0" class="text-center py-8">
      <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No items added</h3>
      <p class="mt-1 text-sm text-gray-500">
        No inventory items or custom services have been added to this booking yet.
      </p>
      <div v-if="canEdit" class="mt-6">
        <button
          @click="showAddItems = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Items
        </button>
      </div>
    </div>

    <!-- Add Items Modal -->
    <TransitionRoot :show="showAddItems" as="template">
      <Dialog
        as="div"
        class="fixed inset-0 z-50 overflow-y-auto"
        @close="showAddItems = false"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] flex flex-col">
              <!-- Modal Header - Fixed -->
              <div class="flex-shrink-0 px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-lg font-medium text-gray-900">
                    Add Items to Booking
                  </DialogTitle>
                  <button
                    @click="showAddItems = false"
                    class="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <!-- Modal Content - Scrollable -->
              <div class="flex-1 min-h-0 px-4 pb-4 sm:px-6 sm:pb-6">
                <BookingItemsManager
                  :booking-id="bookingId"
                  :booking-dates="bookingDates"
                  mode="edit"
                  @saved="handleItemsSaved"
                  @cancel="showAddItems = false"
                />
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import BookingItemsManager from './BookingItemsManager.vue'
import { useBookingsStore } from '../../stores/bookings'
import { useToast } from 'vue-toastification'
import type { BookingInventoryItemWithDetails, BookingCustomItemWithDetails } from '../../types/inventory'

interface Props {
  bookingId: number
  inventoryItems: BookingInventoryItemWithDetails[]
  customItems: BookingCustomItemWithDetails[]
  canEdit?: boolean
  bookingDates?: {
    startDate: string
    endDate: string
  }
}

interface Emits {
  (e: 'edit-items'): void
  (e: 'items-updated'): void
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false
})

const emit = defineEmits<Emits>()

// Stores and composables
const bookingsStore = useBookingsStore()
const toast = useToast()

// Local state
const showAddItems = ref(false)
const loading = ref(false)

// Computed
const customItemsTotal = computed(() => {
  return props.customItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
})

// Methods
const getConditionClasses = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'ok':
      return 'bg-green-100 text-green-800'
    case 'minor_issue':
      return 'bg-yellow-100 text-yellow-800'
    case 'critical':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const removeInventoryItem = async (item: BookingInventoryItemWithDetails) => {
  if (!item.inventory_item?.id) return

  loading.value = true
  try {
    const result = await bookingsStore.removeInventoryItemFromBooking(props.bookingId, item.inventory_item.id)
    if (result.success) {
      toast.success('Inventory item removed successfully')
      emit('items-updated')
    } else {
      toast.error(result.error || 'Failed to remove inventory item')
    }
  } catch (error) {
    toast.error('Failed to remove inventory item')
  } finally {
    loading.value = false
  }
}

const removeCustomItem = async (item: BookingCustomItemWithDetails) => {
  loading.value = true
  try {
    const result = await bookingsStore.removeCustomItemFromBooking(item.id, props.bookingId)
    if (result.success) {
      toast.success('Custom item removed successfully')
      emit('items-updated')
    } else {
      toast.error(result.error || 'Failed to remove custom item')
    }
  } catch (error) {
    toast.error('Failed to remove custom item')
  } finally {
    loading.value = false
  }
}

const handleItemsSaved = () => {
  showAddItems.value = false
  emit('items-updated')
}
</script>