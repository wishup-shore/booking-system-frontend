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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-3 sm:ml-4 truncate">
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Inventory
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
              <span class="hidden sm:inline">Inventory Types</span>
            </button>
            <button
              @click="activeTab = 'items'"
              :class="[
                activeTab === 'items'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'flex-1 sm:flex-none whitespace-nowrap py-3 sm:py-2 px-4 sm:px-1 border-b-2 font-medium text-sm text-center touch-manipulation',
              ]"
            >
              <span class="sm:hidden">Items</span>
              <span class="hidden sm:inline">Inventory Items</span>
            </button>
          </nav>
        </div>

        <!-- Inventory Types Tab -->
        <div v-if="activeTab === 'types'" class="space-y-4 sm:space-y-6">
          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0"
          >
            <div class="min-w-0">
              <h2 class="text-lg font-medium text-gray-900">Inventory Types</h2>
              <p class="text-sm text-gray-500 mt-1">
                Manage different types of inventory items (equipment, supplies, etc.)
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

          <!-- Search and Filters for Types -->
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <div class="relative max-w-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="typesStore.filters.search"
                @input="handleTypesSearch"
                type="text"
                placeholder="Search inventory types..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
            </div>

            <select
              v-model="typesActiveFilter"
              @change="handleTypesActiveFilterChange"
              class="block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="undefined">All Status</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>

            <!-- Bulk Actions for Types -->
            <div class="flex items-center gap-3">
              <button
                v-if="typesStore.hasSelectedInventoryTypes"
                @click="bulkToggleActiveTypes(false)"
                :disabled="typesStore.loading"
                class="inline-flex items-center px-3 py-2 border border-orange-300 text-sm font-medium rounded-lg text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deactivate
              </button>

              <button
                v-if="typesStore.hasSelectedInventoryTypes"
                @click="bulkToggleActiveTypes(true)"
                :disabled="typesStore.loading"
                class="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Activate
              </button>

              <button
                v-if="typesStore.hasSelectedInventoryTypes"
                @click="confirmBulkDeleteTypes"
                :disabled="typesStore.loading"
                class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Stats Cards for Types -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-500">Total Types</p>
                  <p class="text-lg font-semibold text-gray-900">{{ typesStore.total }}</p>
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
                  <p class="text-sm font-medium text-gray-500">Active</p>
                  <p class="text-lg font-semibold text-gray-900">{{ typesStore.activeInventoryTypes.length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-500">Inactive</p>
                  <p class="text-lg font-semibold text-gray-900">{{ typesStore.total - typesStore.activeInventoryTypes.length }}</p>
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
                  <p class="text-lg font-semibold text-gray-900">{{ typesStore.selectedInventoryTypeIds.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Types List -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div v-if="typesStore.loading" class="flex items-center justify-center py-12">
              <div class="flex items-center space-x-2 text-gray-500">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading inventory types...</span>
              </div>
            </div>

            <div v-else-if="typesStore.error" class="p-6 text-center text-red-600">
              <p>{{ typesStore.error }}</p>
              <button
                @click="typesStore.fetchInventoryTypes()"
                class="mt-2 text-sm text-primary-600 hover:text-primary-500"
              >
                Try again
              </button>
            </div>

            <div v-else-if="typesStore.inventoryTypes.length === 0" class="p-6 text-center text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No inventory types</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by creating a new inventory type.</p>
              <div class="mt-6">
                <button
                  @click="showCreateTypeModal = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add inventory type
                </button>
              </div>
            </div>

            <div v-else>
              <!-- Table Header for Types -->
              <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="typesStore.hasSelectedInventoryTypes && typesStore.selectedInventoryTypeIds.length === typesStore.inventoryTypes.length"
                    :indeterminate="typesStore.hasSelectedInventoryTypes && typesStore.selectedInventoryTypeIds.length < typesStore.inventoryTypes.length"
                    @change="toggleSelectAllTypes"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  >
                  <label class="ml-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Select All
                  </label>
                </div>
              </div>

              <!-- Table Body for Types -->
              <div class="divide-y divide-gray-200">
                <div
                  v-for="inventoryType in typesStore.inventoryTypes"
                  :key="inventoryType.id"
                  class="px-6 py-4 hover:bg-gray-50"
                >
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      :checked="typesStore.selectedInventoryTypeIds.includes(inventoryType.id)"
                      @change="typesStore.toggleInventoryTypeSelection(inventoryType.id)"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    >
                    <div class="ml-4 flex-1">
                      <div class="flex items-center justify-between">
                        <div class="flex-1">
                          <div class="flex items-center">
                            <h3 class="text-sm font-medium text-gray-900">{{ inventoryType.name }}</h3>
                            <span
                              :class="[
                                'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                inventoryType.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              ]"
                            >
                              {{ inventoryType.is_active ? 'Active' : 'Inactive' }}
                            </span>
                          </div>
                          <p v-if="inventoryType.description" class="mt-1 text-sm text-gray-500">
                            {{ inventoryType.description }}
                          </p>
                          <div class="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                            <span>Items: {{ itemCountsByType[inventoryType.id] || 0 }}</span>
                            <span>Created: {{ formatDate(inventoryType.created_at) }}</span>
                            <span>Updated: {{ formatDate(inventoryType.updated_at) }}</span>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button
                            @click="switchToItemsWithTypeFilter(inventoryType)"
                            class="text-primary-600 hover:text-primary-500 p-1 text-sm font-medium"
                            :title="`View ${itemCountsByType[inventoryType.id] || 0} items of this type`"
                          >
                            View Items ({{ itemCountsByType[inventoryType.id] || 0 }})
                          </button>
                          <button
                            @click="editInventoryType(inventoryType)"
                            class="text-primary-600 hover:text-primary-500 p-1"
                            title="Edit"
                          >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            @click="confirmDeleteType(inventoryType)"
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

          <!-- Pagination for Types -->
          <div v-if="typesStore.totalPages > 1" class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ (typesStore.currentPage - 1) * typesStore.itemsPerPage + 1 }} to 
              {{ Math.min(typesStore.currentPage * typesStore.itemsPerPage, typesStore.total) }} of 
              {{ typesStore.total }} results
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="typesStore.setPage(typesStore.currentPage - 1)"
                :disabled="typesStore.currentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div class="flex items-center space-x-1">
                <button
                  v-for="page in visibleTypesPages"
                  :key="page"
                  @click="typesStore.setPage(page)"
                  :class="[
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    page === typesStore.currentPage
                      ? 'text-white bg-primary-600 border border-primary-600'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="typesStore.setPage(typesStore.currentPage + 1)"
                :disabled="typesStore.currentPage === typesStore.totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- Inventory Items Tab -->
        <div v-if="activeTab === 'items'" class="space-y-4 sm:space-y-6">
          <div
            class="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0"
          >
            <div class="min-w-0">
              <h2 class="text-lg font-medium text-gray-900">Inventory Items</h2>
              <p class="text-sm text-gray-500 mt-1">Manage individual inventory items and their conditions</p>
            </div>
            <button
              @click="showCreateItemModal = true"
              :disabled="typesStore.loading || typesStore.activeInventoryTypes.length === 0"
              class="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 touch-manipulation min-h-[44px] sm:min-h-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              <span class="hidden sm:inline">Add Item</span>
              <span class="sm:hidden">Add</span>
            </button>
          </div>

          <!-- Show empty state if no types exist -->
          <div v-if="!typesStore.loading && typesStore.activeInventoryTypes.length === 0" class="bg-white shadow-sm rounded-lg p-8 text-center">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No inventory types available</h3>
            <p class="mt-2 text-sm text-gray-500">
              You need to create inventory types first before adding individual items.
            </p>
            <button
              @click="activeTab = 'types'"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go to Inventory Types
            </button>
          </div>

          <!-- Items content (only show if types exist) -->
          <div v-else>
            <!-- Search and Filters for Items -->
            <div class="flex flex-col gap-4">
              <div class="flex flex-col sm:flex-row gap-4 flex-1">
                <div class="relative max-w-md">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="itemsStore.filters.search"
                    @input="handleItemsSearch"
                    type="text"
                    placeholder="Search inventory items..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                </div>

                <select
                  v-model="itemTypeFilter"
                  @change="handleItemTypeFilterChange"
                  class="block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option :value="undefined">All Types</option>
                  <option v-for="type in typesStore.activeInventoryTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>

                <select
                  v-model="itemConditionFilter"
                  @change="handleItemConditionFilterChange"
                  class="block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option :value="[]">All Conditions</option>
                  <option v-for="condition in conditionOptions" :key="condition.value" :value="[condition.value]">
                    {{ condition.label }}
                  </option>
                </select>

                <select
                  v-model="itemActiveFilter"
                  @change="handleItemActiveFilterChange"
                  class="block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option :value="undefined">All Status</option>
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>

              <!-- Bulk Actions for Items -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex items-center gap-3 flex-wrap">
                  <button
                    v-if="itemsStore.hasSelectedInventoryItems"
                    @click="bulkUpdateCondition(InventoryCondition.OK)"
                    :disabled="itemsStore.loading"
                    class="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mark OK
                  </button>

                  <button
                    v-if="itemsStore.hasSelectedInventoryItems"
                    @click="bulkUpdateCondition(InventoryCondition.MINOR_ISSUE)"
                    :disabled="itemsStore.loading"
                    class="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    Minor Issue
                  </button>

                  <button
                    v-if="itemsStore.hasSelectedInventoryItems"
                    @click="bulkUpdateCondition(InventoryCondition.CRITICAL)"
                    :disabled="itemsStore.loading"
                    class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Critical
                  </button>

                  <button
                    v-if="itemsStore.hasSelectedInventoryItems"
                    @click="bulkToggleActiveItems(false)"
                    :disabled="itemsStore.loading"
                    class="inline-flex items-center px-3 py-2 border border-orange-300 text-sm font-medium rounded-lg text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Deactivate
                  </button>

                  <button
                    v-if="itemsStore.hasSelectedInventoryItems"
                    @click="bulkToggleActiveItems(true)"
                    :disabled="itemsStore.loading"
                    class="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Activate
                  </button>

                  <button
                    v-if="itemsStore.hasSelectedInventoryItems"
                    @click="confirmBulkDeleteItems"
                    :disabled="itemsStore.loading"
                    class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Stats Cards for Items -->
            <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <p class="text-lg font-semibold text-gray-900">{{ itemsStore.total }}</p>
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
                    <p class="text-lg font-semibold text-gray-900">{{ itemsStore.itemsByCondition.ok }}</p>
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
                    <p class="text-lg font-semibold text-gray-900">{{ itemsStore.itemsByCondition.minor }}</p>
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
                    <p class="text-lg font-semibold text-gray-900">{{ itemsStore.itemsByCondition.critical }}</p>
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
                    <p class="text-lg font-semibold text-gray-900">{{ itemsStore.selectedInventoryItemIds.length }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Items Table -->
            <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div v-if="itemsStore.loading" class="flex items-center justify-center py-12">
                <div class="flex items-center space-x-2 text-gray-500">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading inventory items...</span>
                </div>
              </div>

              <div v-else-if="itemsStore.error" class="p-6 text-center text-red-600">
                <p>{{ itemsStore.error }}</p>
                <button
                  @click="itemsStore.fetchInventoryItems()"
                  class="mt-2 text-sm text-primary-600 hover:text-primary-500"
                >
                  Try again
                </button>
              </div>

              <div v-else-if="itemsStore.inventoryItems.length === 0" class="p-6 text-center text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No inventory items</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new inventory item.</p>
                <div class="mt-6">
                  <button
                    @click="showCreateItemModal = true"
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
                <!-- Table Header for Items -->
                <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      :checked="itemsStore.hasSelectedInventoryItems && itemsStore.selectedInventoryItemIds.length === itemsStore.inventoryItems.length"
                      :indeterminate="itemsStore.hasSelectedInventoryItems && itemsStore.selectedInventoryItemIds.length < itemsStore.inventoryItems.length"
                      @change="toggleSelectAllItems"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    >
                    <label class="ml-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Select All
                    </label>
                  </div>
                </div>

                <!-- Table Body for Items -->
                <div class="divide-y divide-gray-200">
                  <div
                    v-for="item in itemsStore.inventoryItems"
                    :key="item.id"
                    class="px-6 py-4 hover:bg-gray-50"
                  >
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        :checked="itemsStore.selectedInventoryItemIds.includes(item.id)"
                        @change="itemsStore.toggleInventoryItemSelection(item.id)"
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
                              @click="confirmDeleteItem(item)"
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

            <!-- Pagination for Items -->
            <div v-if="itemsStore.totalPages > 1" class="mt-6 flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Showing {{ (itemsStore.currentPage - 1) * itemsStore.itemsPerPage + 1 }} to 
                {{ Math.min(itemsStore.currentPage * itemsStore.itemsPerPage, itemsStore.total) }} of 
                {{ itemsStore.total }} results
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="itemsStore.setPage(itemsStore.currentPage - 1)"
                  :disabled="itemsStore.currentPage === 1"
                  class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div class="flex items-center space-x-1">
                  <button
                    v-for="page in visibleItemsPages"
                    :key="page"
                    @click="itemsStore.setPage(page)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-lg',
                      page === itemsStore.currentPage
                        ? 'text-white bg-primary-600 border border-primary-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  @click="itemsStore.setPage(itemsStore.currentPage + 1)"
                  :disabled="itemsStore.currentPage === itemsStore.totalPages"
                  class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Type Modal -->
    <InventoryTypeModal
      v-if="showCreateTypeModal || showEditTypeModal"
      :inventory-type="editingInventoryType"
      :is-edit="showEditTypeModal"
      @close="closeTypeModals"
      @save="handleTypeSave"
    />

    <!-- Create/Edit Item Modal -->
    <InventoryItemModal
      v-if="showCreateItemModal || showEditItemModal"
      :inventory-item="editingInventoryItem"
      :is-edit="showEditItemModal"
      @close="closeItemModals"
      @save="handleItemSave"
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
import { useInventoryTypesStore } from '../stores/inventoryTypes'
import { useInventoryItemsStore } from '../stores/inventoryItems'
import InventoryTypeModal from '../components/inventory/InventoryTypeModal.vue'
import InventoryItemModal from '../components/inventory/InventoryItemModal.vue'
import ConfirmationDialog from '../components/shared/ConfirmationDialog.vue'
import type { InventoryType, InventoryItemWithType } from '../types/inventory'
import { InventoryCondition } from '../types/inventory'

const router = useRouter()
const toast = useToast()
const typesStore = useInventoryTypesStore()
const itemsStore = useInventoryItemsStore()

// Tab state
const activeTab = ref('types')

// Types modal states
const showCreateTypeModal = ref(false)
const showEditTypeModal = ref(false)
const editingInventoryType = ref<InventoryType | null>(null)

// Items modal states
const showCreateItemModal = ref(false)
const showEditItemModal = ref(false)
const editingInventoryItem = ref<InventoryItemWithType | null>(null)

// Delete confirmation
const showDeleteConfirm = ref(false)
const deleteTarget = ref<InventoryType | InventoryItemWithType | null>(null)
const isBulkDelete = ref(false)
const isTypeDelete = ref(false)

// Filters for types
const typesActiveFilter = ref<boolean | undefined>(undefined)

// Filters for items
const itemTypeFilter = ref<number | undefined>(undefined)
const itemConditionFilter = ref<InventoryCondition[]>([])
const itemActiveFilter = ref<boolean | undefined>(undefined)

// Search debounce timers
const typesSearchTimeout = ref<number | null>(null)
const itemsSearchTimeout = ref<number | null>(null)

// Condition options
const conditionOptions = [
  { value: InventoryCondition.OK, label: 'OK' },
  { value: InventoryCondition.MINOR_ISSUE, label: 'Minor Issue' },
  { value: InventoryCondition.CRITICAL, label: 'Critical' },
]

// Computed
const visibleTypesPages = computed(() => {
  const pages = []
  const current = typesStore.currentPage
  const total = typesStore.totalPages
  const delta = 2

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

const visibleItemsPages = computed(() => {
  const pages = []
  const current = itemsStore.currentPage
  const total = itemsStore.totalPages
  const delta = 2

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

const deleteConfirmTitle = computed(() => {
  if (isBulkDelete.value) {
    if (isTypeDelete.value) {
      return `Delete ${typesStore.selectedInventoryTypeIds.length} inventory types?`
    } else {
      return `Delete ${itemsStore.selectedInventoryItemIds.length} inventory items?`
    }
  }
  if (isTypeDelete.value) {
    return `Delete "${(deleteTarget.value as InventoryType)?.name}"?`
  } else {
    return `Delete "${(deleteTarget.value as InventoryItemWithType)?.number}"?`
  }
})

const deleteConfirmMessage = computed(() => {
  if (isBulkDelete.value) {
    if (isTypeDelete.value) {
      return `Are you sure you want to delete ${typesStore.selectedInventoryTypeIds.length} inventory types? This action cannot be undone.`
    } else {
      return `Are you sure you want to delete ${itemsStore.selectedInventoryItemIds.length} inventory items? This action cannot be undone.`
    }
  }
  if (isTypeDelete.value) {
    return `Are you sure you want to delete "${(deleteTarget.value as InventoryType)?.name}"? This action cannot be undone.`
  } else {
    return `Are you sure you want to delete "${(deleteTarget.value as InventoryItemWithType)?.number}"? This action cannot be undone.`
  }
})

const itemCountsByType = computed(() => {
  const counts: { [key: number]: number } = {}
  
  itemsStore.inventoryItems.forEach(item => {
    if (item.type_id) {
      counts[item.type_id] = (counts[item.type_id] || 0) + 1
    }
  })
  
  return counts
})

// Methods for Types
const handleTypesSearch = () => {
  if (typesSearchTimeout.value) {
    clearTimeout(typesSearchTimeout.value)
  }
  typesSearchTimeout.value = window.setTimeout(() => {
    typesStore.updateFilters({ search: typesStore.filters.search })
  }, 300)
}

const handleTypesActiveFilterChange = () => {
  typesStore.updateFilters({ is_active: typesActiveFilter.value })
}

const toggleSelectAllTypes = () => {
  if (typesStore.hasSelectedInventoryTypes && typesStore.selectedInventoryTypeIds.length === typesStore.inventoryTypes.length) {
    typesStore.clearSelection()
  } else {
    typesStore.selectAllInventoryTypes()
  }
}

const editInventoryType = (inventoryType: InventoryType) => {
  editingInventoryType.value = inventoryType
  showEditTypeModal.value = true
}

const confirmDeleteType = (inventoryType: InventoryType) => {
  deleteTarget.value = inventoryType
  isBulkDelete.value = false
  isTypeDelete.value = true
  showDeleteConfirm.value = true
}

const confirmBulkDeleteTypes = () => {
  isBulkDelete.value = true
  isTypeDelete.value = true
  showDeleteConfirm.value = true
}

const bulkToggleActiveTypes = async (isActive: boolean) => {
  try {
    const result = await typesStore.bulkToggleActive(isActive)
    if (result.success) {
      const action = isActive ? 'activated' : 'deactivated'
      toast.success(`Successfully ${action} ${typesStore.selectedInventoryTypeIds.length} inventory types`)
      // Refresh items if we're on the items tab to reflect type status changes
      if (activeTab.value === 'items') {
        await itemsStore.fetchInventoryItems()
      }
    } else {
      toast.error(result.error || 'Failed to update inventory types')
    }
  } catch (error) {
    console.error('Bulk toggle error:', error)
    toast.error('An unexpected error occurred')
  }
}

const closeTypeModals = () => {
  showCreateTypeModal.value = false
  showEditTypeModal.value = false
  editingInventoryType.value = null
}

const handleTypeSave = async (data: any) => {
  try {
    let result
    if (showEditTypeModal.value && editingInventoryType.value) {
      result = await typesStore.updateInventoryType(editingInventoryType.value.id, data)
    } else {
      result = await typesStore.createInventoryType(data)
    }

    if (result.success) {
      const action = showEditTypeModal.value ? 'updated' : 'created'
      toast.success(`Inventory type ${action} successfully`)
      closeTypeModals()
      // Refresh items if we're on the items tab to get updated types
      if (activeTab.value === 'items') {
        await itemsStore.fetchInventoryItems()
      }
    } else {
      toast.error(result.error || `Failed to ${showEditTypeModal.value ? 'update' : 'create'} inventory type`)
    }
  } catch (error) {
    console.error('Save error:', error)
    toast.error('An unexpected error occurred')
  }
}

// Methods for Items
const handleItemsSearch = () => {
  if (itemsSearchTimeout.value) {
    clearTimeout(itemsSearchTimeout.value)
  }
  itemsSearchTimeout.value = window.setTimeout(() => {
    itemsStore.updateFilters({ search: itemsStore.filters.search })
  }, 300)
}

const handleItemTypeFilterChange = () => {
  itemsStore.updateFilters({ type_id: itemTypeFilter.value })
}

const handleItemConditionFilterChange = () => {
  itemsStore.updateFilters({ condition: itemConditionFilter.value })
}

const handleItemActiveFilterChange = () => {
  itemsStore.updateFilters({ is_active: itemActiveFilter.value })
}

const toggleSelectAllItems = () => {
  if (itemsStore.hasSelectedInventoryItems && itemsStore.selectedInventoryItemIds.length === itemsStore.inventoryItems.length) {
    itemsStore.clearSelection()
  } else {
    itemsStore.selectAllInventoryItems()
  }
}

const editInventoryItem = (item: InventoryItemWithType) => {
  editingInventoryItem.value = item
  showEditItemModal.value = true
}

const confirmDeleteItem = (item: InventoryItemWithType) => {
  deleteTarget.value = item
  isBulkDelete.value = false
  isTypeDelete.value = false
  showDeleteConfirm.value = true
}

const confirmBulkDeleteItems = () => {
  isBulkDelete.value = true
  isTypeDelete.value = false
  showDeleteConfirm.value = true
}

const bulkToggleActiveItems = async (isActive: boolean) => {
  try {
    const result = await itemsStore.bulkToggleActive(isActive)
    if (result.success) {
      const action = isActive ? 'activated' : 'deactivated'
      toast.success(`Successfully ${action} ${itemsStore.selectedInventoryItemIds.length} inventory items`)
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
    const result = await itemsStore.bulkUpdateCondition(condition)
    if (result.success) {
      toast.success(`Successfully updated ${itemsStore.selectedInventoryItemIds.length} inventory items to ${getConditionLabel(condition)}`)
    } else {
      toast.error(result.error || 'Failed to update inventory items condition')
    }
  } catch (error) {
    console.error('Bulk condition update error:', error)
    toast.error('An unexpected error occurred')
  }
}

const closeItemModals = () => {
  showCreateItemModal.value = false
  showEditItemModal.value = false
  editingInventoryItem.value = null
}

const handleItemSave = async (data: any) => {
  try {
    let result
    if (showEditItemModal.value && editingInventoryItem.value) {
      result = await itemsStore.updateInventoryItem(editingInventoryItem.value.id, data)
    } else {
      result = await itemsStore.createInventoryItem(data)
    }

    if (result.success) {
      const action = showEditItemModal.value ? 'updated' : 'created'
      toast.success(`Inventory item ${action} successfully`)
      closeItemModals()
    } else {
      toast.error(result.error || `Failed to ${showEditItemModal.value ? 'update' : 'create'} inventory item`)
    }
  } catch (error) {
    console.error('Save error:', error)
    toast.error('An unexpected error occurred')
  }
}

// Shared methods
const handleDelete = async () => {
  try {
    if (isBulkDelete.value) {
      if (isTypeDelete.value) {
        const result = await typesStore.bulkDelete()
        if (result.success) {
          toast.success(`Successfully deleted ${typesStore.selectedInventoryTypeIds.length} inventory types`)
          // Refresh items if we're on the items tab to reflect type changes
          if (activeTab.value === 'items') {
            await itemsStore.fetchInventoryItems()
          }
        } else {
          toast.error(result.error || 'Failed to delete inventory types')
        }
      } else {
        const result = await itemsStore.bulkDelete()
        if (result.success) {
          toast.success(`Successfully deleted ${itemsStore.selectedInventoryItemIds.length} inventory items`)
        } else {
          toast.error(result.error || 'Failed to delete inventory items')
        }
      }
    } else if (deleteTarget.value) {
      if (isTypeDelete.value) {
        const result = await typesStore.deleteInventoryType(deleteTarget.value.id)
        if (result.success) {
          toast.success('Inventory type deleted successfully')
          // Refresh items if we're on the items tab to reflect type changes
          if (activeTab.value === 'items') {
            await itemsStore.fetchInventoryItems()
          }
        } else {
          toast.error(result.error || 'Failed to delete inventory type')
        }
      } else {
        const result = await itemsStore.deleteInventoryItem(deleteTarget.value.id)
        if (result.success) {
          toast.success('Inventory item deleted successfully')
        } else {
          toast.error(result.error || 'Failed to delete inventory item')
        }
      }
    }
  } catch (error) {
    console.error('Delete error:', error)
    toast.error('An unexpected error occurred')
  } finally {
    showDeleteConfirm.value = false
    deleteTarget.value = null
    isBulkDelete.value = false
    isTypeDelete.value = false
  }
}

const switchToItemsWithTypeFilter = (inventoryType: InventoryType) => {
  activeTab.value = 'items'
  itemTypeFilter.value = inventoryType.id
  itemsStore.updateFilters({ type_id: inventoryType.id })
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

// Lifecycle
onMounted(async () => {
  // Load both stores independently to allow partial success
  const loadingPromises = [
    typesStore.fetchInventoryTypes().catch(error => {
      console.error('Failed to load inventory types:', error)
      toast.error('Failed to load inventory types. Some features may not work properly.')
    }),
    itemsStore.fetchInventoryItems().catch(error => {
      console.error('Failed to load inventory items:', error)
      toast.error('Failed to load inventory items. Some features may not work properly.')
    })
  ]
  
  await Promise.allSettled(loadingPromises)
})

// Watch for filter changes
watch(typesActiveFilter, (newValue) => {
  typesStore.updateFilters({ is_active: newValue })
})

watch(itemTypeFilter, (newValue) => {
  itemsStore.updateFilters({ type_id: newValue })
})

watch(itemConditionFilter, (newValue) => {
  itemsStore.updateFilters({ condition: newValue })
})

watch(itemActiveFilter, (newValue) => {
  itemsStore.updateFilters({ is_active: newValue })
})
</script>