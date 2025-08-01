<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Select Inventory Items</h3>
      <div class="text-sm text-gray-500">
        {{ selectedItems.length }} item{{ selectedItems.length !== 1 ? 's' : '' }} selected
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label class="sr-only">Search inventory items</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search inventory items..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div class="w-full sm:w-48">
        <select
          v-model="selectedTypeId"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Types</option>
          <option v-for="type in inventoryTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Availability Check -->
    <div v-if="bookingDates" class="bg-blue-50 border border-blue-200 rounded-md p-4">
      <div class="flex items-center">
        <InformationCircleIcon class="h-5 w-5 text-blue-400 mr-2" />
        <span class="text-sm text-blue-700">
          Showing available items for {{ formatDate(bookingDates.startDate) }} - {{ formatDate(bookingDates.endDate) }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500">Loading inventory items...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-400 mr-2" />
        <div class="text-sm text-red-700">{{ error }}</div>
      </div>
    </div>

    <!-- Inventory Items Grid -->
    <div v-else-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
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
            <h4 class="text-sm font-medium text-gray-900 truncate">
              {{ item.inventory_type?.name }} - {{ item.number }}
            </h4>
            <p class="text-sm text-gray-500">{{ item.inventory_type?.name }}</p>
          </div>
          <div class="ml-2 flex-shrink-0">
            <div
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getConditionClasses(item.condition)
              ]"
            >
              {{ item.condition }}
            </div>
          </div>
        </div>

        <!-- Selection Controls -->
        <div v-if="isItemSelected(item.id)" class="space-y-3">
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
              Notes (optional)
            </label>
            <textarea
              v-model="getSelectedItem(item.id)!.notes"
              rows="2"
              placeholder="Add notes..."
              class="block w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <!-- Item Notes -->
        <div v-if="item.notes" class="mt-3 pt-3 border-t border-gray-200">
          <p class="text-xs text-gray-600">{{ item.notes }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria.
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
            <span class="text-sm text-gray-500 ml-2">
              Qty: {{ selection.quantity }}
            </span>
          </div>
          <button
            @click="removeItemFromSelection(selection.itemId)"
            class="text-red-600 hover:text-red-700 p-1"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useInventoryTypesStore } from '../../stores/inventoryTypes'
import { useInventoryItemsStore } from '../../stores/inventoryItems'
import type { InventoryItemWithType } from '../../types/inventory'

interface Props {
  bookingDates?: {
    startDate: string
    endDate: string
  }
  preselectedItems?: { itemId: number; quantity: number; notes?: string }[]
}

interface Emits {
  (e: 'update:selection', selection: { itemId: number; quantity: number; notes?: string }[]): void
}

const props = withDefaults(defineProps<Props>(), {
  preselectedItems: () => []
})

const emit = defineEmits<Emits>()

// Stores
const inventoryTypesStore = useInventoryTypesStore()
const inventoryItemsStore = useInventoryItemsStore()

// Local state
const searchQuery = ref('')
const selectedTypeId = ref<number | ''>('')
const availableItems = ref<InventoryItemWithType[]>([])

// Computed
const inventoryTypes = computed(() => inventoryTypesStore.activeInventoryTypes)
const loading = computed(() => inventoryItemsStore.loading || inventoryTypesStore.loading)
const error = computed(() => inventoryItemsStore.error || inventoryTypesStore.error)
const selectedItems = computed(() => inventoryItemsStore.getBookingSelection)

const filteredItems = computed(() => {
  let items = availableItems.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item =>
      item.number.toLowerCase().includes(query) ||
      item.inventory_type?.name.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query)
    )
  }

  // Filter by type
  if (selectedTypeId.value) {
    items = items.filter(item => item.type_id === selectedTypeId.value)
  }

  return items
})

// Methods
const fetchAvailableItems = async () => {
  if (props.bookingDates) {
    // Fetch available items for the booking period
    availableItems.value = await inventoryItemsStore.getAvailableItems(
      selectedTypeId.value || undefined,
      props.bookingDates.startDate,
      props.bookingDates.endDate
    )
  } else {
    // Fetch all active items
    availableItems.value = await inventoryItemsStore.getItemsByType(
      selectedTypeId.value as number,
      true
    )
  }
}

const isItemSelected = (itemId: number): boolean => {
  return selectedItems.value.some(item => item.itemId === itemId)
}

const getSelectedItem = (itemId: number) => {
  return selectedItems.value.find(item => item.itemId === itemId)
}

const toggleItemSelection = (item: InventoryItemWithType) => {
  if (isItemSelected(item.id)) {
    inventoryItemsStore.removeItemFromBookingSelection(item.id)
  } else {
    inventoryItemsStore.addItemToBookingSelection(item.id, 1)
  }
}

const removeItemFromSelection = (itemId: number) => {
  inventoryItemsStore.removeItemFromBookingSelection(itemId)
}

const getItemName = (itemId: number): string => {
  const item = availableItems.value.find(i => i.id === itemId)
  return item ? `${item.inventory_type?.name} - ${item.number}` : 'Unknown Item'
}

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

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

// Watchers
watch(selectedTypeId, fetchAvailableItems)
watch(
  () => props.bookingDates,
  fetchAvailableItems,
  { deep: true }
)
watch(
  selectedItems,
  (newSelection) => {
    emit('update:selection', newSelection)
  },
  { deep: true }
)

// Lifecycle
onMounted(async () => {
  // Load inventory types
  await inventoryTypesStore.fetchInventoryTypes()
  
  // Load initial items
  await fetchAvailableItems()
  
  // Set preselected items
  if (props.preselectedItems.length > 0) {
    inventoryItemsStore.clearBookingSelection()
    props.preselectedItems.forEach(item => {
      inventoryItemsStore.addItemToBookingSelection(item.itemId, item.quantity, item.notes)
    })
  }
})
</script>