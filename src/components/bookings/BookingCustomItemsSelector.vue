<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Select Custom Items & Services</h3>
      <div class="text-sm text-gray-500">
        {{ selectedItems.length }} item{{ selectedItems.length !== 1 ? 's' : '' }} selected
        <span v-if="totalAmount > 0" class="ml-2 font-medium text-gray-900">
          Total: ${{ totalAmount.toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search custom items and services..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500">Loading custom items...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mr-2" />
        <div class="text-sm text-red-700">{{ error }}</div>
      </div>
    </div>

    <!-- Custom Items List -->
    <div v-else-if="filteredItems.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        :class="[
          'border rounded-lg p-4 cursor-pointer transition-all duration-200',
          isItemSelected(item.id)
            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        ]"
        @click="toggleItemSelection(item)"
      >
        <!-- Item Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
            <p class="text-sm text-gray-600 mt-1">${{ item.price.toFixed(2) }}</p>
          </div>
          <div class="flex-shrink-0">
            <div
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ item.is_active ? 'Active' : 'Inactive' }}
            </div>
          </div>
        </div>

        <!-- Selection Controls -->
        <div v-if="isItemSelected(item.id)" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                v-model.number="getSelectedItem(item.id)!.quantity"
                type="number"
                min="1"
                class="block w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                Unit Price
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 text-sm">$</span>
                </div>
                <input
                  v-model.number="getSelectedItem(item.id)!.unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  :placeholder="item.price.toFixed(2)"
                  class="block w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              v-model="getSelectedItem(item.id)!.notes"
              rows="2"
              placeholder="Add notes..."
              class="block w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Item Total -->
          <div class="pt-3 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Item Total:</span>
              <span class="text-sm font-bold text-gray-900">
                ${{ getItemTotal(item.id).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No custom items found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search criteria.
      </p>
    </div>

    <!-- Selected Items Summary -->
    <div v-if="selectedItems.length > 0" class="border-t pt-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Selected Items ({{ selectedItems.length }})</h4>
      <div class="space-y-2">
        <div
          v-for="selection in selectedItems"
          :key="selection.itemId"
          class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
        >
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-900">
              {{ getItemName(selection.itemId) }}
            </span>
            <div class="text-xs text-gray-500">
              Qty: {{ selection.quantity }} × ${{ (selection.unitPrice || getItemPrice(selection.itemId)).toFixed(2) }}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-900">
              ${{ getItemTotal(selection.itemId).toFixed(2) }}
            </span>
            <button
              @click="removeItemFromSelection(selection.itemId)"
              class="text-red-600 hover:text-red-700 p-1"
            >
              <XMarkIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Grand Total -->
      <div class="mt-4 pt-4 border-t border-gray-300">
        <div class="flex justify-between items-center">
          <span class="text-base font-semibold text-gray-900">Total Amount:</span>
          <span class="text-lg font-bold text-indigo-600">
            ${{ totalAmount.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useCustomItemsStore } from '../../stores/customItems'
import type { CustomItem } from '../../types/inventory'

interface Props {
  preselectedItems?: { itemId: number; quantity: number; unitPrice?: number; notes?: string }[]
}

interface Emits {
  (e: 'update:selection', selection: { itemId: number; quantity: number; unitPrice?: number; notes?: string }[]): void
}

const props = withDefaults(defineProps<Props>(), {
  preselectedItems: () => []
})

const emit = defineEmits<Emits>()

// Store
const customItemsStore = useCustomItemsStore()

// Local state
const searchQuery = ref('')

// Computed
const customItems = computed(() => customItemsStore.activeCustomItems)
const loading = computed(() => customItemsStore.loading)
const error = computed(() => customItemsStore.error)
const selectedItems = computed(() => customItemsStore.getBookingSelection)
const totalAmount = computed(() => customItemsStore.getBookingSelectionTotal)

const filteredItems = computed(() => {
  let items = customItems.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query)
    )
  }

  return items
})

// Methods
const isItemSelected = (itemId: number): boolean => {
  return selectedItems.value.some(item => item.itemId === itemId)
}

const getSelectedItem = (itemId: number) => {
  return selectedItems.value.find(item => item.itemId === itemId)
}

const toggleItemSelection = (item: CustomItem) => {
  if (isItemSelected(item.id)) {
    customItemsStore.removeItemFromBookingSelection(item.id)
  } else {
    customItemsStore.addItemToBookingSelection(item.id, 1, item.price)
  }
}

const removeItemFromSelection = (itemId: number) => {
  customItemsStore.removeItemFromBookingSelection(itemId)
}

const getItemName = (itemId: number): string => {
  const item = customItems.value.find(i => i.id === itemId)
  return item?.name || 'Unknown Item'
}

const getItemPrice = (itemId: number): number => {
  const item = customItems.value.find(i => i.id === itemId)
  return item?.price || 0
}

const getItemTotal = (itemId: number): number => {
  const selection = getSelectedItem(itemId)
  if (!selection) return 0
  
  const unitPrice = selection.unitPrice || getItemPrice(itemId)
  return unitPrice * selection.quantity
}

// Watchers
watch(
  selectedItems,
  (newSelection) => {
    emit('update:selection', newSelection)
  },
  { deep: true }
)

// Lifecycle
onMounted(async () => {
  // Load custom items
  await customItemsStore.fetchCustomItems()
  
  // Set preselected items
  if (props.preselectedItems.length > 0) {
    customItemsStore.clearBookingSelection()
    props.preselectedItems.forEach(item => {
      customItemsStore.addItemToBookingSelection(item.itemId, item.quantity, item.unitPrice, item.notes)
    })
  }
})
</script>