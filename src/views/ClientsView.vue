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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-3 sm:ml-4 truncate">
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">Clients</h1>
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
              @click="activeTab = 'clients'"
              :class="[
                activeTab === 'clients'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'flex-1 sm:flex-none whitespace-nowrap py-3 sm:py-2 px-4 sm:px-1 border-b-2 font-medium text-sm sm:mr-8 text-center touch-manipulation',
              ]"
            >
              <span class="sm:hidden">Clients</span>
              <span class="hidden sm:inline">Individual Clients</span>
            </button>
            <button
              @click="activeTab = 'groups'"
              :class="[
                activeTab === 'groups'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'flex-1 sm:flex-none whitespace-nowrap py-3 sm:py-2 px-4 sm:px-1 border-b-2 font-medium text-sm text-center touch-manipulation',
              ]"
            >
              Client Groups
            </button>
          </nav>
        </div>

        <!-- Individual Clients Tab -->
        <div v-if="activeTab === 'clients'" class="space-y-4 sm:space-y-6">
          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0"
          >
            <div class="min-w-0">
              <h2 class="text-lg font-medium text-gray-900">Individual Clients</h2>
              <p class="text-sm text-gray-500 mt-1">
                Manage your client database and contact information
              </p>
            </div>
            <button
              @click="showCreateClientModal = true"
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
              Add Client
            </button>
          </div>

          <!-- Search and Filters -->
          <div class="bg-white shadow-sm rounded-lg p-4 sm:p-6">
            <div
              class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4"
            >
              <div class="flex-1">
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    :value="searchQuery"
                    @input="handleSearchInput"
                    type="text"
                    class="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search clients by name, phone, or email..."
                  />
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  @click="clearSearch"
                  v-if="searchQuery"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <!-- Clients List -->
          <div v-if="loading" class="bg-white shadow-sm rounded-lg p-8 text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"
            ></div>
            <p class="mt-2 text-sm text-gray-500">Loading clients...</p>
          </div>

          <div
            v-else-if="clients.length === 0"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              {{ searchQuery ? 'No clients found' : 'No clients yet' }}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              {{
                searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first client.'
              }}
            </p>
          </div>

          <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="client in clients"
                :key="client.id"
                class="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div
                  class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                >
                  <div class="flex items-center min-w-0 flex-1">
                    <!-- Avatar -->
                    <div class="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <img
                        v-if="client.photo_url"
                        :src="client.photo_url"
                        :alt="`${client.first_name} ${client.last_name}`"
                        class="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                      />
                      <div
                        v-else
                        class="h-10 w-10 sm:h-12 sm:w-12 bg-primary-100 rounded-full flex items-center justify-center"
                      >
                        <span class="text-sm sm:text-lg font-medium text-primary-600">
                          {{ getInitials(`${client.first_name} ${client.last_name}`) }}
                        </span>
                      </div>
                    </div>

                    <!-- Client Info -->
                    <div class="ml-4 min-w-0 flex-1">
                      <div class="flex items-center space-x-2">
                        <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">
                          {{ client.first_name }} {{ client.last_name }}
                        </h3>
                        <div v-if="client.rating" class="flex items-center">
                          <svg
                            class="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                          <span class="ml-1 text-sm text-gray-600">{{ client.rating }}/5</span>
                        </div>
                      </div>

                      <div class="mt-1 space-y-1">
                        <p v-if="client.phone" class="text-sm text-gray-600 flex items-center">
                          <svg
                            class="w-4 h-4 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {{ client.phone }}
                        </p>
                        <p v-if="client.email" class="text-sm text-gray-600 flex items-center">
                          <svg
                            class="w-4 h-4 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {{ client.email }}
                        </p>
                        <div
                          v-if="client.car_numbers && client.car_numbers.length > 0"
                          class="flex items-center"
                        >
                          <svg
                            class="w-4 h-4 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12a3 3 0 11-6 0 3 3 0 016 0zM21 12a3 3 0 11-6 0 3 3 0 016 0zM7 21V3M17 21V3"
                            />
                          </svg>
                          <div class="flex flex-wrap gap-1">
                            <span
                              v-for="carNumber in client.car_numbers"
                              :key="carNumber"
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {{ carNumber }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <button
                      @click="viewClientStats(client)"
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium py-2 px-2 sm:px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Stats
                    </button>
                    <button
                      @click="editClient(client)"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium py-2 px-2 sm:px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteClientConfirm(client)"
                      class="text-error-600 hover:text-error-900 text-sm font-medium py-2 px-2 sm:px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Pagination -->
            <div
              v-if="totalClients > pageSize"
              class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 flex justify-between sm:hidden">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage * pageSize >= totalClients"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700">
                      Showing
                      <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                      to
                      <span class="font-medium">{{
                        Math.min(currentPage * pageSize, totalClients)
                      }}</span>
                      of
                      <span class="font-medium">{{ totalClients }}</span>
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        @click="previousPage"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        @click="nextPage"
                        :disabled="currentPage * pageSize >= totalClients"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Groups Tab -->
        <div v-if="activeTab === 'groups'" class="space-y-4 sm:space-y-6">
          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0"
          >
            <div class="min-w-0">
              <h2 class="text-lg font-medium text-gray-900">Client Groups</h2>
              <p class="text-sm text-gray-500 mt-1">
                Organize clients into groups for better management
              </p>
            </div>
            <button
              @click="showCreateGroupModal = true"
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
              Add Group
            </button>
          </div>

          <!-- Groups List -->
          <div
            v-if="clientGroups.length === 0"
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No client groups</h3>
            <p class="mt-2 text-sm text-gray-500">
              Get started by creating your first client group to organize your clients.
            </p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="group in clientGroups"
              :key="group.id"
              class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-4 sm:p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center min-w-0 flex-1">
                    <div
                      :class="[
                        group.color ? `bg-${group.color}-100` : 'bg-primary-100',
                        'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      ]"
                    >
                      <svg
                        :class="[
                          group.color ? `text-${group.color}-600` : 'text-primary-600',
                          'w-6 h-6',
                        ]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                    </div>
                    <div class="ml-3 min-w-0">
                      <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">
                        {{ group.name }}
                      </h3>
                      <p class="text-sm text-gray-500">{{ group.clients_count || 0 }} clients</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <button
                      @click="editGroup(group)"
                      class="text-primary-600 hover:text-primary-900 text-sm font-medium py-2 px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteGroupConfirm(group)"
                      class="text-error-600 hover:text-error-900 text-sm font-medium py-2 px-1 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div v-if="group.description" class="text-sm text-gray-600 mb-4">
                  {{ group.description }}
                </div>

                <div class="text-xs text-gray-400">Created {{ formatDate(group.created_at) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Client Modal -->
    <ClientModal
      v-if="showCreateClientModal"
      :client="editingClient"
      @close="cancelClientForm"
      @save="handleClientSave"
      :loading="loading"
    />

    <!-- Create/Edit Group Modal -->
    <GroupModal
      v-if="showCreateGroupModal"
      :group="editingGroup"
      @close="cancelGroupForm"
      @save="handleGroupSave"
      :loading="loading"
    />

    <!-- Client Stats Modal -->
    <ClientStatsModal
      v-if="showStatsModal && selectedClient"
      :client="selectedClient"
      :stats="clientStats"
      @close="closeStatsModal"
      :loading="statsLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { debounce } from 'lodash-es'
import { useClientsStore } from '../stores/clients'
import ClientModal from '../components/clients/ClientModal.vue'
import GroupModal from '../components/clients/GroupModal.vue'
import ClientStatsModal from '../components/clients/ClientStatsModal.vue'
import type {
  Client,
  ClientCreate,
  ClientUpdate,
  ClientGroup,
  ClientGroupCreate,
  ClientGroupUpdate,
} from '../types/client'

const router = useRouter()
const toast = useToast()
const clientsStore = useClientsStore()

const activeTab = ref('clients')

// Computed properties from store
const loading = computed(() => clientsStore.loading)
const clients = computed(() => clientsStore.clients)
const clientGroups = computed(() => clientsStore.clientGroups)
const clientStats = computed(() => clientsStore.clientStats)
const totalClients = computed(() => clientsStore.total)
const currentPage = computed(() => clientsStore.currentPage)
const searchQuery = computed(() => clientsStore.searchQuery)

// Local state
const statsLoading = ref(false)
const pageSize = ref(20)

// Modals
const showCreateClientModal = ref(false)
const showCreateGroupModal = ref(false)
const showStatsModal = ref(false)

// Forms
const editingClient = ref<Client | null>(null)
const editingGroup = ref<ClientGroup | null>(null)
const selectedClient = ref<Client | null>(null)

// Methods
const loadClients = async () => {
  const result = await clientsStore.fetchClients()
  if (!result.success) {
    toast.error(result.error || 'Failed to load clients')
  }
}

const loadClientGroups = async () => {
  const result = await clientsStore.fetchClientGroups()
  if (!result.success) {
    toast.error(result.error || 'Failed to load client groups')
  }
}

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  clientsStore.updateSearch(target.value)
}

// Search is now handled by the store through the computed property
const debouncedSearch = debounce(() => {
  // Search is automatically triggered by the store when searchQuery changes
}, 300)

const clearSearch = () => {
  clientsStore.clearSearch()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    clientsStore.setPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value * pageSize.value < totalClients.value) {
    clientsStore.setPage(currentPage.value + 1)
  }
}

// Client operations
const editClient = (client: Client) => {
  editingClient.value = client
  showCreateClientModal.value = true
}

const deleteClientConfirm = (client: Client) => {
  if (confirm(`Are you sure you want to delete ${client.first_name} ${client.last_name}?`)) {
    deleteClient(client.id)
  }
}

const deleteClient = async (id: number) => {
  const result = await clientsStore.deleteClient(id)
  if (result.success) {
    toast.success('Client deleted successfully')
  } else {
    toast.error(result.error || 'Failed to delete client')
  }
}

const handleClientSave = async (clientData: ClientCreate | ClientUpdate) => {
  let result
  if (editingClient.value) {
    result = await clientsStore.updateClient(editingClient.value.id, clientData as ClientUpdate)
    if (result.success) {
      toast.success('Client updated successfully')
    }
  } else {
    result = await clientsStore.createClient(clientData as ClientCreate)
    if (result.success) {
      toast.success('Client created successfully')
    }
  }
  
  if (!result.success) {
    toast.error(result.error || `Failed to ${editingClient.value ? 'update' : 'create'} client`)
  } else {
    cancelClientForm()
  }
}

const cancelClientForm = () => {
  showCreateClientModal.value = false
  editingClient.value = null
}

const viewClientStats = async (client: Client) => {
  selectedClient.value = client
  showStatsModal.value = true
  statsLoading.value = true

  const result = await clientsStore.fetchClientStats(client.id)
  if (!result.success) {
    toast.error(result.error || 'Failed to load client statistics')
  }
  statsLoading.value = false
}

const closeStatsModal = () => {
  showStatsModal.value = false
  selectedClient.value = null
  // Stats are cleared by the store reset if needed
}

// Group operations
const editGroup = (group: ClientGroup) => {
  editingGroup.value = group
  showCreateGroupModal.value = true
}

const deleteGroupConfirm = (group: ClientGroup) => {
  if (confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
    deleteGroup(group.id)
  }
}

const deleteGroup = async (id: number) => {
  const result = await clientsStore.deleteClientGroup(id)
  if (result.success) {
    toast.success('Client group deleted successfully')
  } else {
    toast.error(result.error || 'Failed to delete client group')
  }
}

const handleGroupSave = async (groupData: ClientGroupCreate | ClientGroupUpdate) => {
  let result
  if (editingGroup.value) {
    result = await clientsStore.updateClientGroup(editingGroup.value.id, groupData as ClientGroupUpdate)
    if (result.success) {
      toast.success('Client group updated successfully')
    }
  } else {
    result = await clientsStore.createClientGroup(groupData as ClientGroupCreate)
    if (result.success) {
      toast.success('Client group created successfully')
    }
  }
  
  if (!result.success) {
    toast.error(result.error || `Failed to ${editingGroup.value ? 'update' : 'create'} client group`)
  } else {
    cancelGroupForm()
  }
}

const cancelGroupForm = () => {
  showCreateGroupModal.value = false
  editingGroup.value = null
}

// Utility functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadClients(), loadClientGroups()])
})
</script>
