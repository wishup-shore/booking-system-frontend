<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <div class="flex items-center min-w-0 flex-1">
            <div class="flex-shrink-0">
              <div class="h-7 w-7 sm:h-8 sm:w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4">
                  </path>
                </svg>
              </div>
            </div>
            <div class="ml-3 sm:ml-4 truncate">
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">Inventory Items</h1>
            </div>
          </div>

          <div class="flex items-center ml-4">
            <button
              @click="router.push('/dashboard')"
              class="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 text-xs sm:text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 touch-manipulation"
            >
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Actions Bar -->
      <div class="mb-6 flex flex-col gap-4">
        <!-- Search and Filters Row -->
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <div class="relative max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="store.filters.search"
              @input="handleSearch"
              type="text"
              placeholder="Search inventory items..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
          </div>

          <select
            v-model="typeFilter"
            @change="handleTypeFilterChange"
            class="block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option :value="undefined">All Types</option>
            <option v-for="type in inventoryTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>

          <select
            v-model="conditionFilter"
            @change="handleConditionFilterChange"
            class="block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option :value="[]">All Conditions</option>
            <option v-for="condition in conditionOptions" :key="condition.value" :value="[condition.value]">
              {{ condition.label }}
            </option>
          </select>

          <select
            v-model="activeFilter"
            @change="handleActiveFilterChange"
            class="block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option :value="undefined">All Status</option>
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <!-- Action Buttons Row -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3 flex-wrap">
            <button
              v-if="store.hasSelectedInventoryItems"
              @click="bulkUpdateCondition(InventoryCondition.OK)"
              :disabled="store.loading"
              class="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Mark OK
            </button>

            <button
              v-if="store.hasSelectedInventoryItems"
              @click="bulkUpdateCondition(InventoryCondition.MINOR_ISSUE)"
              :disabled="store.loading"
              class="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              Minor Issue
            </button>

            <button
              v-if="store.hasSelectedInventoryItems"
              @click="bulkUpdateCondition(InventoryCondition.CRITICAL)"
              :disabled="store.loading"
              class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Critical
            </button>

            <button
              v-if="store.hasSelectedInventoryItems"
              @click="bulkToggleActive(false)"
              :disabled="store.loading"
              class="inline-flex items-center px-3 py-2 border border-orange-300 text-sm font-medium rounded-lg text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deactivate
            </button>

            <button
              v-if="store.hasSelectedInventoryItems"
              @click="bulkToggleActive(true)"
              :disabled="store.loading"
              class="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Activate
            </button>

            <button
              v-if="store.hasSelectedInventoryItems"
              @click="confirmBulkDelete"
              :disabled="store.loading"
              class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </button>
          </div>

          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Item
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Total Items</p>
              <p class="text-lg font-semibold text-gray-900">{{ store.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">OK</p>
              <p class="text-lg font-semibold text-gray-900">{{ store.itemsByCondition.ok }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Minor Issues</p>
              <p class="text-lg font-semibold text-gray-900">{{ store.itemsByCondition.minor }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Critical</p>
              <p class="text-lg font-semibold text-gray-900">{{ store.itemsByCondition.critical }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Selected</p>
              <p class="text-lg font-semibold text-gray-900">{{ store.selectedInventoryItemIds.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div v-if="store.loading" class="flex items-center justify-center py-12">
          <div class="flex items-center space-x-2 text-gray-500">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading inventory items...</span>
          </div>
        </div>

        <div v-else-if="store.error" class="p-6 text-center text-red-600">
          <p>{{ store.error }}</p>
          <button
            @click="store.fetchInventoryItems()"
            class="mt-2 text-sm text-primary-600 hover:text-primary-500"
          >
            Try again
          </button>
        </div>

        <div v-else-if="store.inventoryItems.length === 0" class="p-6 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No inventory items</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new inventory item.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add inventory item
            </button>
          </div>
        </div>

        <div v-else>
          <!-- Table Header -->
          <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="store.hasSelectedInventoryItems && store.selectedInventoryItemIds.length === store.inventoryItems.length"
                :indeterminate="store.hasSelectedInventoryItems && store.selectedInventoryItemIds.length < store.inventoryItems.length"
                @change="toggleSelectAll"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              >
              <label class="ml-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                Select All
              </label>
            </div>
          </div>

          <!-- Table Body -->
          <div class="divide-y divide-gray-200">
            <div
              v-for="item in store.inventoryItems"
              :key="item.id"
              class="px-6 py-4 hover:bg-gray-50"
            >
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="store.selectedInventoryItemIds.includes(item.id)"
                  @change="store.toggleInventoryItemSelection(item.id)"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3">
                        <h3 class="text-sm font-medium text-gray-900">{{ item.number }}</h3>
                        <span
                          :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getConditionClass(item.condition)
                          ]"
                        >
                          {{ getConditionLabel(item.condition) }}
                        </span>
                        <span
                          :class="[
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            item.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          ]"
                        >
                          {{ item.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </div>
                      
                      <div class="mt-1 flex items-center space-x-4">
                        <span class="text-sm text-gray-600">
                          Type: <span class="font-medium">{{ item.inventory_type?.name || 'Unknown' }}</span>
                        </span>
                      </div>
                      
                      <p v-if="item.notes" class="mt-1 text-sm text-gray-500">
                        {{ item.notes }}
                      </p>
                      <div class="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                        <span>Created: {{ formatDate(item.created_at) }}</span>
                        <span>Updated: {{ formatDate(item.updated_at) }}</span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="editInventoryItem(item)"
                        class="text-primary-600 hover:text-primary-500 p-1"
                        title="Edit"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(item)"
                        class="text-red-600 hover:text-red-500 p-1"
                        title="Delete"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="store.totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (store.currentPage - 1) * store.itemsPerPage + 1 }} to 
          {{ Math.min(store.currentPage * store.itemsPerPage, store.total) }} of 
          {{ store.total }} results
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="store.setPage(store.currentPage - 1)"
            :disabled="store.currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="store.setPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg',
                page === store.currentPage
                  ? 'text-white bg-primary-600 border border-primary-600'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="store.setPage(store.currentPage + 1)"
            :disabled="store.currentPage === store.totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <InventoryItemModal
      v-if="showCreateModal || showEditModal"
      :inventory-item="editingInventoryItem"
      :is-edit="showEditModal"
      @close="closeModals"
      @save="handleSave"
    />

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-if="showDeleteConfirm"
      :title="deleteConfirmTitle"
      :message="deleteConfirmMessage"
      :confirm-text="'Delete'"
      :confirm-class="'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useInventoryItemsStore } from '../stores/inventoryItems'
import { useInventoryTypesStore } from '../stores/inventoryTypes'
import InventoryItemModal from '../components/inventory/InventoryItemModal.vue'
import ConfirmationDialog from '../components/shared/ConfirmationDialog.vue'
import type { InventoryItemWithType } from '../types/inventory'
import { InventoryCondition } from '../types/inventory'

const router = useRouter()
const toast = useToast()
const store = useInventoryItemsStore()
const typesStore = useInventoryTypesStore()

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingInventoryItem = ref<InventoryItemWithType | null>(null)

// Delete confirmation
const showDeleteConfirm = ref(false)
const deleteTarget = ref<InventoryItemWithType | null>(null)
const isBulkDelete = ref(false)

// Filters
const typeFilter = ref<number | undefined>(undefined)
const conditionFilter = ref<InventoryCondition[]>([])
const activeFilter = ref<boolean | undefined>(undefined)

// Inventory types for filter dropdown
const inventoryTypes = ref<any[]>([])

// Search debounce
const searchTimeout = ref<number | null>(null)

// Condition options
const conditionOptions = [
  { value: InventoryCondition.OK, label: 'OK' },
  { value: InventoryCondition.MINOR_ISSUE, label: 'Minor Issue' },
  { value: InventoryCondition.CRITICAL, label: 'Critical' },
]

// Computed
const visiblePages = computed(() => {
  const pages = []
  const current = store.currentPage
  const total = store.totalPages
  const delta = 2

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

const deleteConfirmTitle = computed(() => {
  if (isBulkDelete.value) {
    return `Delete ${store.selectedInventoryItemIds.length} inventory items?`
  }
  return `Delete "${deleteTarget.value?.number}"?`
})

const deleteConfirmMessage = computed(() => {
  if (isBulkDelete.value) {
    return `Are you sure you want to delete ${store.selectedInventoryItemIds.length} inventory items? This action cannot be undone.`
  }
  return `Are you sure you want to delete "${deleteTarget.value?.number}"? This action cannot be undone.`
})

// Methods
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    store.updateFilters({ search: store.filters.search })
  }, 300)
}

const handleTypeFilterChange = () => {
  store.updateFilters({ type_id: typeFilter.value })
}

const handleConditionFilterChange = () => {
  store.updateFilters({ condition: conditionFilter.value })
}

const handleActiveFilterChange = () => {
  store.updateFilters({ is_active: activeFilter.value })
}

const toggleSelectAll = () => {
  if (store.hasSelectedInventoryItems && store.selectedInventoryItemIds.length === store.inventoryItems.length) {
    store.clearSelection()
  } else {
    store.selectAllInventoryItems()
  }
}

const editInventoryItem = (item: InventoryItemWithType) => {
  editingInventoryItem.value = item
  showEditModal.value = true
}

const confirmDelete = (item: InventoryItemWithType) => {
  deleteTarget.value = item
  isBulkDelete.value = false
  showDeleteConfirm.value = true
}

const confirmBulkDelete = () => {
  isBulkDelete.value = true
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  try {
    if (isBulkDelete.value) {
      const result = await store.bulkDelete()
      if (result.success) {
        toast.success(`Successfully deleted ${store.selectedInventoryItemIds.length} inventory items`)
      } else {
        toast.error(result.error || 'Failed to delete inventory items')
      }
    } else if (deleteTarget.value) {
      const result = await store.deleteInventoryItem(deleteTarget.value.id)
      if (result.success) {
        toast.success('Inventory item deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete inventory item')
      }
    }
  } catch (error) {
    console.error('Delete error:', error)
    toast.error('An unexpected error occurred')
  } finally {
    showDeleteConfirm.value = false
    deleteTarget.value = null
    isBulkDelete.value = false
  }
}

const bulkToggleActive = async (isActive: boolean) => {
  try {
    const result = await store.bulkToggleActive(isActive)
    if (result.success) {
      const action = isActive ? 'activated' : 'deactivated'
      toast.success(`Successfully ${action} ${store.selectedInventoryItemIds.length} inventory items`)
    } else {
      toast.error(result.error || 'Failed to update inventory items')
    }
  } catch (error) {
    console.error('Bulk toggle error:', error)
    toast.error('An unexpected error occurred')
  }
}

const bulkUpdateCondition = async (condition: InventoryCondition) => {
  try {
    const result = await store.bulkUpdateCondition(condition)
    if (result.success) {
      toast.success(`Successfully updated ${store.selectedInventoryItemIds.length} inventory items to ${getConditionLabel(condition)}`)
    } else {
      toast.error(result.error || 'Failed to update inventory items condition')
    }
  } catch (error) {
    console.error('Bulk condition update error:', error)
    toast.error('An unexpected error occurred')
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingInventoryItem.value = null
}

const handleSave = async (data: any) => {
  try {
    let result
    if (showEditModal.value && editingInventoryItem.value) {
      result = await store.updateInventoryItem(editingInventoryItem.value.id, data)
    } else {
      result = await store.createInventoryItem(data)
    }

    if (result.success) {
      const action = showEditModal.value ? 'updated' : 'created'
      toast.success(`Inventory item ${action} successfully`)
      closeModals()
    } else {
      toast.error(result.error || `Failed to ${showEditModal.value ? 'update' : 'create'} inventory item`)
    }
  } catch (error) {
    console.error('Save error:', error)
    toast.error('An unexpected error occurred')
  }
}

const getConditionClass = (condition: InventoryCondition) => {
  switch (condition) {
    case InventoryCondition.OK:
      return 'bg-green-100 text-green-800'
    case InventoryCondition.MINOR_ISSUE:
      return 'bg-yellow-100 text-yellow-800'
    case InventoryCondition.CRITICAL:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getConditionLabel = (condition: InventoryCondition) => {
  switch (condition) {
    case InventoryCondition.OK:
      return 'OK'
    case InventoryCondition.MINOR_ISSUE:
      return 'Minor Issue'
    case InventoryCondition.CRITICAL:
      return 'Critical'
    default:
      return 'Unknown'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
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
  await Promise.all([
    store.fetchInventoryItems(),
    loadInventoryTypes()
  ])
})

// Watch for filter changes
watch(typeFilter, (newValue) => {
  store.updateFilters({ type_id: newValue })
})

watch(conditionFilter, (newValue) => {
  store.updateFilters({ condition: newValue })
})

watch(activeFilter, (newValue) => {
  store.updateFilters({ is_active: newValue })
})
</script>