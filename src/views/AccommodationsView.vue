<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <div class="flex items-center min-w-0 flex-1">
            <div class="flex-shrink-0">
              <div
                class="h-7 w-7 sm:h-8 sm:w-8 bg-primary-600 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-3 sm:ml-4 truncate">
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Accommodations
              </h1>
            </div>
          </div>

          <div class="flex items-center ml-4">
            <button
              @click="router.push('/dashboard')"
              class="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 text-xs sm:text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 touch-manipulation"
            >
              <svg
                class="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              <span class="hidden sm:inline">Back to Dashboard</span>
              <span class="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-4 sm:py-6 sm:px-6 lg:px-8">
      <div class="px-4 sm:px-0">
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-4 sm:mb-6">
          <nav class="-mb-px flex" aria-label="Tabs">
            <button
              @click="activeTab = 'types'"
              :class="[
                activeTab === 'types'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'flex-1 sm:flex-none whitespace-nowrap py-3 sm:py-2 px-4 sm:px-1 border-b-2 font-medium text-sm sm:mr-8 text-center touch-manipulation',
              ]"
            >
              <span class="sm:hidden">Types</span>
              <span class="hidden sm:inline">Accommodation Types</span>
            </button>
            <button
              @click="activeTab = 'accommodations'"
              :class="[
                activeTab === 'accommodations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'flex-1 sm:flex-none whitespace-nowrap py-3 sm:py-2 px-4 sm:px-1 border-b-2 font-medium text-sm text-center touch-manipulation',
              ]"
            >
              Accommodations
            </button>
          </nav>
        </div>

        <!-- Accommodation Types Tab -->
        <div v-if="activeTab === 'types'" class="space-y-4 sm:space-y-6">
          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0"
          >
            <div class="min-w-0">
              <h2 class="text-lg font-medium text-gray-900">Accommodation Types</h2>
              <p class="text-sm text-gray-500 mt-1">
                Manage different types of accommodations (tents, cabins, etc.)
              </p>
            </div>
            <button
              @click="showCreateTypeModal = true"
              class="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 touch-manipulation min-h-[44px] sm:min-h-0"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add Type
            </button>
          </div>

          <!-- Types List -->
          <div class="bg-white shadow-sm rounded-lg overflow-hidden">
            <div v-if="accommodationTypes.length === 0" class="p-8 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">No accommodation types</h3>
              <p class="mt-2 text-sm text-gray-500">
                Get started by creating your first accommodation type.
              </p>
            </div>
            <ul v-else class="divide-y divide-gray-200">
              <li v-for="type in accommodationTypes" :key="type.id" class="p-4 sm:p-6">
                <div
                  class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                >
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                      <h3 class="text-base sm:text-lg font-medium text-gray-900">
                        {{ type.name }}
                      </h3>
                      <span
                        :class="[
                          type.is_active
                            ? 'bg-success-100 text-success-800'
                            : 'bg-gray-100 text-gray-800',
                          'sm:ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start',
                        ]"
                      >
                        {{ type.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                    <p v-if="type.description" class="mt-1 text-sm text-gray-500">
                      {{ type.description }}
                    </p>
                    <div class="mt-2 text-sm text-gray-600">
                      Default capacity: {{ type.default_capacity }} guests
                    </div>
                  </div>
                  <div class="flex items-center justify-end space-x-1 sm:space-x-2">
                    <button
                      @click="editType(type)"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium py-2 px-2 sm:px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteTypeConfirm(type)"
                      class="text-error-600 hover:text-error-900 text-sm font-medium py-2 px-2 sm:px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Accommodations Tab -->
        <div v-if="activeTab === 'accommodations'" class="space-y-4 sm:space-y-6">
          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0"
          >
            <div class="min-w-0">
              <h2 class="text-lg font-medium text-gray-900">Accommodations</h2>
              <p class="text-sm text-gray-500 mt-1">Manage individual accommodation units</p>
            </div>
            <button
              @click="showCreateAccommodationModal = true"
              class="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 touch-manipulation min-h-[44px] sm:min-h-0"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span class="hidden sm:inline">Add Accommodation</span>
              <span class="sm:hidden">Add Unit</span>
            </button>
          </div>

          <!-- Accommodations Grid -->
          <div
            v-if="accommodations.length === 0"
            class="bg-white shadow-sm rounded-lg p-8 text-center"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No accommodations</h3>
            <p class="mt-2 text-sm text-gray-500">
              Create accommodation types first, then add individual accommodations.
            </p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="accommodation in accommodations"
              :key="accommodation.id"
              class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-4 sm:p-6">
                <div
                  class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4"
                >
                  <div class="flex items-center min-w-0">
                    <div
                      class="h-9 w-9 sm:h-10 sm:w-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                    </div>
                    <div class="ml-3 min-w-0">
                      <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">
                        {{ accommodation.number }}
                      </h3>
                      <p class="text-sm text-gray-500 truncate">{{ accommodation.type.name }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <button
                      @click="editAccommodation(accommodation)"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium py-2 px-2 sm:px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteAccommodationConfirm(accommodation)"
                      class="text-error-600 hover:text-error-900 text-sm font-medium py-2 px-2 sm:px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Capacity:</span>
                    <span class="text-gray-900">{{ accommodation.capacity }} guests</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Price per night:</span>
                    <span class="text-gray-900">${{ accommodation.price_per_night }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Status:</span>
                    <span
                      :class="[
                        getStatusColor(accommodation.status),
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      ]"
                    >
                      {{ getStatusLabel(accommodation.status) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Condition:</span>
                    <span
                      :class="[
                        getConditionColor(accommodation.condition),
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      ]"
                    >
                      {{ getConditionLabel(accommodation.condition) }}
                    </span>
                  </div>
                </div>

                <div v-if="accommodation.comments" class="mt-4 text-sm text-gray-600">
                  <p class="italic">"{{ accommodation.comments }}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Type Modal -->
    <div
      v-if="showCreateTypeModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg border max-h-full overflow-y-auto"
      >
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 pr-8">
            {{ editingType ? 'Edit Accommodation Type' : 'Create Accommodation Type' }}
          </h3>
          <form @submit.prevent="submitType" class="space-y-4">
            <div>
              <label for="type-name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="type-name"
                v-model="typeForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                placeholder="e.g., Tent, Cabin, RV Site"
              />
            </div>
            <div>
              <label for="type-description" class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                id="type-description"
                v-model="typeForm.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                placeholder="Optional description"
              ></textarea>
            </div>
            <div>
              <label for="type-capacity" class="block text-sm font-medium text-gray-700"
                >Default Capacity</label
              >
              <input
                id="type-capacity"
                v-model.number="typeForm.default_capacity"
                type="number"
                min="1"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              />
            </div>
            <div class="flex items-center">
              <input
                id="type-active"
                v-model="typeForm.is_active"
                type="checkbox"
                class="h-5 w-5 sm:h-4 sm:w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="type-active" class="ml-2 block text-sm text-gray-900">Active</label>
            </div>
            <div
              class="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-6"
            >
              <button
                type="button"
                @click="cancelTypeForm"
                class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 touch-manipulation min-h-[44px] sm:min-h-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 touch-manipulation min-h-[44px] sm:min-h-0"
              >
                {{ loading ? 'Saving...' : editingType ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Create Accommodation Modal -->
    <div
      v-if="showCreateAccommodationModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg border max-h-full overflow-y-auto"
      >
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 pr-8">
            {{ editingAccommodation ? 'Edit Accommodation' : 'Create Accommodation' }}
          </h3>
          <form @submit.prevent="submitAccommodation" class="space-y-4">
            <div>
              <label for="acc-number" class="block text-sm font-medium text-gray-700"
                >Number/Name</label
              >
              <input
                id="acc-number"
                v-model="accommodationForm.number"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                placeholder="e.g., T-01, Cabin-A, Site-12"
              />
            </div>
            <div>
              <label for="acc-type" class="block text-sm font-medium text-gray-700">Type</label>
              <select
                id="acc-type"
                v-model="accommodationForm.type_id"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              >
                <option value="">Select type</option>
                <option
                  v-for="type in accommodationTypes.filter((t) => t.is_active)"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="acc-capacity" class="block text-sm font-medium text-gray-700"
                >Capacity</label
              >
              <input
                id="acc-capacity"
                v-model.number="accommodationForm.capacity"
                type="number"
                min="1"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              />
            </div>
            <div>
              <label for="acc-price" class="block text-sm font-medium text-gray-700"
                >Price per night</label
              >
              <input
                id="acc-price"
                v-model.number="accommodationForm.price_per_night"
                type="number"
                min="0"
                step="0.01"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              />
            </div>
            <div>
              <label for="acc-status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="acc-status"
                v-model="accommodationForm.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_order">Out of Order</option>
              </select>
            </div>
            <div>
              <label for="acc-condition" class="block text-sm font-medium text-gray-700"
                >Condition</label
              >
              <select
                id="acc-condition"
                v-model="accommodationForm.condition"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
              >
                <option value="ok">OK</option>
                <option value="minor">Minor Issues</option>
                <option value="critical">Critical Issues</option>
              </select>
            </div>
            <div>
              <label for="acc-comments" class="block text-sm font-medium text-gray-700"
                >Comments</label
              >
              <textarea
                id="acc-comments"
                v-model="accommodationForm.comments"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                placeholder="Optional comments"
              ></textarea>
            </div>
            <div
              class="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-6"
            >
              <button
                type="button"
                @click="cancelAccommodationForm"
                class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 touch-manipulation min-h-[44px] sm:min-h-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 touch-manipulation min-h-[44px] sm:min-h-0"
              >
                {{ loading ? 'Saving...' : editingAccommodation ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { AccommodationService } from '../services/accommodationService'
import type {
  AccommodationType,
  AccommodationTypeCreate,
  Accommodation,
  AccommodationCreate,
  AccommodationStatus,
  AccommodationCondition,
} from '../types/accommodation'

const router = useRouter()
const toast = useToast()

const activeTab = ref('types')
const loading = ref(false)

// Data
const accommodationTypes = ref<AccommodationType[]>([])
const accommodations = ref<Accommodation[]>([])

// Modals
const showCreateTypeModal = ref(false)
const showCreateAccommodationModal = ref(false)

// Forms
const editingType = ref<AccommodationType | null>(null)
const editingAccommodation = ref<Accommodation | null>(null)

const typeForm = ref<AccommodationTypeCreate>({
  name: '',
  description: '',
  default_capacity: 2,
  is_active: true,
})

const accommodationForm = ref<AccommodationCreate>({
  number: '',
  type_id: 0,
  capacity: 2,
  price_per_night: 0,
  status: 'available' as AccommodationStatus,
  condition: 'ok' as AccommodationCondition,
  comments: '',
})

// Methods
const loadAccommodationTypes = async () => {
  try {
    accommodationTypes.value = await AccommodationService.getAccommodationTypes()
  } catch (error) {
    toast.error('Failed to load accommodation types')
    console.error('Error loading accommodation types:', error)
  }
}

const loadAccommodations = async () => {
  try {
    accommodations.value = await AccommodationService.getAccommodations()
  } catch (error) {
    toast.error('Failed to load accommodations')
    console.error('Error loading accommodations:', error)
  }
}

const editType = (type: AccommodationType) => {
  editingType.value = type
  typeForm.value = {
    name: type.name,
    description: type.description || '',
    default_capacity: type.default_capacity,
    is_active: type.is_active,
  }
  showCreateTypeModal.value = true
}

const submitType = async () => {
  loading.value = true
  try {
    if (editingType.value) {
      await AccommodationService.updateAccommodationType(editingType.value.id, typeForm.value)
      toast.success('Accommodation type updated successfully')
    } else {
      await AccommodationService.createAccommodationType(typeForm.value)
      toast.success('Accommodation type created successfully')
    }
    await loadAccommodationTypes()
    cancelTypeForm()
  } catch (error) {
    toast.error('Failed to save accommodation type')
    console.error('Error saving accommodation type:', error)
  } finally {
    loading.value = false
  }
}

const cancelTypeForm = () => {
  showCreateTypeModal.value = false
  editingType.value = null
  typeForm.value = {
    name: '',
    description: '',
    default_capacity: 2,
    is_active: true,
  }
}

const editAccommodation = (accommodation: Accommodation) => {
  editingAccommodation.value = accommodation
  accommodationForm.value = {
    number: accommodation.number,
    type_id: accommodation.type_id,
    capacity: accommodation.capacity,
    price_per_night: parseFloat(accommodation.price_per_night),
    status: accommodation.status,
    condition: accommodation.condition,
    comments: accommodation.comments || '',
  }
  showCreateAccommodationModal.value = true
}

const submitAccommodation = async () => {
  loading.value = true
  try {
    if (editingAccommodation.value) {
      await AccommodationService.updateAccommodation(
        editingAccommodation.value.id,
        accommodationForm.value,
      )
      toast.success('Accommodation updated successfully')
    } else {
      await AccommodationService.createAccommodation(accommodationForm.value)
      toast.success('Accommodation created successfully')
    }
    await loadAccommodations()
    cancelAccommodationForm()
  } catch (error) {
    toast.error('Failed to save accommodation')
    console.error('Error saving accommodation:', error)
  } finally {
    loading.value = false
  }
}

const cancelAccommodationForm = () => {
  showCreateAccommodationModal.value = false
  editingAccommodation.value = null
  accommodationForm.value = {
    number: '',
    type_id: 0,
    capacity: 2,
    price_per_night: 0,
    status: 'available' as AccommodationStatus,
    condition: 'ok' as AccommodationCondition,
    comments: '',
  }
}

const deleteTypeConfirm = (type: AccommodationType) => {
  if (confirm(`Are you sure you want to delete the accommodation type "${type.name}"?`)) {
    deleteType(type.id)
  }
}

const deleteType = async (id: number) => {
  loading.value = true
  try {
    await AccommodationService.deleteAccommodationType(id)
    toast.success('Accommodation type deleted successfully')
    await loadAccommodationTypes()
  } catch (error) {
    toast.error('Failed to delete accommodation type')
    console.error('Error deleting accommodation type:', error)
  } finally {
    loading.value = false
  }
}

const deleteAccommodationConfirm = (accommodation: Accommodation) => {
  if (
    confirm(`Are you sure you want to delete ${accommodation.type.name} ${accommodation.number}?`)
  ) {
    deleteAccommodation(accommodation.id)
  }
}

const deleteAccommodation = async (id: number) => {
  loading.value = true
  try {
    await AccommodationService.deleteAccommodation(id)
    toast.success('Accommodation deleted successfully')
    await loadAccommodations()
  } catch (error) {
    toast.error('Failed to delete accommodation')
    console.error('Error deleting accommodation:', error)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: AccommodationStatus): string => {
  const colors = {
    available: 'bg-success-100 text-success-800',
    occupied: 'bg-warning-100 text-warning-800',
    maintenance: 'bg-warning-100 text-warning-800',
    out_of_order: 'bg-error-100 text-error-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: AccommodationStatus): string => {
  const labels = {
    available: 'Available',
    occupied: 'Occupied',
    maintenance: 'Maintenance',
    out_of_order: 'Out of Order',
  }
  return labels[status] || status
}

const getConditionColor = (condition: AccommodationCondition): string => {
  const colors = {
    ok: 'bg-success-100 text-success-800',
    minor: 'bg-warning-100 text-warning-800',
    critical: 'bg-error-100 text-error-800',
  }
  return colors[condition] || 'bg-gray-100 text-gray-800'
}

const getConditionLabel = (condition: AccommodationCondition): string => {
  const labels = {
    ok: 'Good',
    minor: 'Minor Issues',
    critical: 'Critical',
  }
  return labels[condition] || condition
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadAccommodationTypes(), loadAccommodations()])
})
</script>
