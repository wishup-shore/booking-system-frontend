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
                    d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-6 9l2-2m0 0l2 2m-2-2v6"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="ml-3 sm:ml-4 truncate">
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">Bookings</h1>
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
        <!-- Header and Add Button -->
        <div class="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-4 sm:mb-6">
          <div class="min-w-0">
            <h2 class="text-lg font-medium text-gray-900">Booking Management</h2>
            <p class="text-sm text-gray-500 mt-1">
              Manage reservations, check-ins, and payment status
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="showCreateBookingModal = true"
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
              New Booking
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div v-if="stats" class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 mb-4 sm:mb-6">
          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.total_bookings }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.pending_bookings }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.confirmed_bookings }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Check-ins</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.todays_checkins }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Check-outs</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.todays_checkouts }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                    <dd class="text-lg font-medium text-gray-900">${{ formatCurrency(stats.total_revenue) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div class="space-y-4">
            <!-- Search Bar -->
            <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
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
                    v-model="bookingsStore.filters.search"
                    @input="debouncedSearch"
                    type="text"
                    class="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by client name, accommodation, or booking ID..."
                  />
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <button
                  @click="bookingsStore.clearFilters()"
                  v-if="hasActiveFilters"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Clear Filters
                </button>
                <button
                  @click="showFilters = !showFilters"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
                  </svg>
                  Filters
                  <span v-if="activeFiltersCount > 0" class="ml-1 bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs">
                    {{ activeFiltersCount }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Filter Options -->
            <div v-if="showFilters" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4 border-t border-gray-200">
              <!-- Status Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div class="space-y-2">
                  <label v-for="status in Object.values(BookingStatus)" :key="status" class="flex items-center">
                    <input
                      v-model="bookingsStore.filters.status"
                      :value="status"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-600">
                      {{ formatStatusLabel(status) }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Payment Status Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <div class="space-y-2">
                  <label v-for="status in Object.values(PaymentStatus)" :key="status" class="flex items-center">
                    <input
                      v-model="bookingsStore.filters.paymentStatus"
                      :value="status"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-600">
                      {{ formatPaymentStatusLabel(status) }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Date Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div class="space-y-2">
                  <input
                    v-model="bookingsStore.filters.dateFrom"
                    @change="bookingsStore.fetchBookings(true)"
                    type="date"
                    class="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="From"
                  />
                  <input
                    v-model="bookingsStore.filters.dateTo"
                    @change="bookingsStore.fetchBookings(true)"
                    type="date"
                    class="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="To"
                  />
                </div>
              </div>

              <!-- Open Dates Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="openDatesOnly"
                      @change="updateOpenDatesFilter"
                      type="checkbox"
                      class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-600">Open Dates Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk Actions Bar -->
        <div v-if="bookingsStore.hasSelectedBookings" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 sm:mb-6">
          <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div class="flex items-center">
              <span class="text-sm text-blue-700">
                {{ bookingsStore.selectedBookingIds.length }} booking(s) selected
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="bulkConfirm"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Confirm Selected
              </button>
              <button
                @click="bulkCancel"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Selected
              </button>
              <button
                @click="bookingsStore.clearSelection()"
                class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>

        <!-- Bookings List -->
        <div v-if="bookingsStore.loading" class="bg-white shadow-sm rounded-lg p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Loading bookings...</p>
        </div>

        <div
          v-else-if="bookingsStore.bookings.length === 0"
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
              d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-6 9l2-2m0 0l2 2m-2-2v6"
            ></path>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            {{ hasActiveFilters ? 'No bookings found' : 'No bookings yet' }}
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            {{ hasActiveFilters ? 'Try adjusting your search criteria' : 'Get started by creating your first booking.' }}
          </p>
        </div>

        <!-- Desktop Table -->
        <div v-else class="hidden lg:block bg-white shadow-sm rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    @change="toggleSelectAll"
                    type="checkbox"
                    class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    :checked="allSelected"
                  />
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="bookingsStore.updateSort('client_name')">
                  <div class="flex items-center space-x-1">
                    <span>Client</span>
                    <svg v-if="bookingsStore.sortOptions.field === 'client_name'" class="w-4 h-4" :class="bookingsStore.sortOptions.order === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="bookingsStore.updateSort('accommodation_number')">
                  <div class="flex items-center space-x-1">
                    <span>Accommodation</span>
                    <svg v-if="bookingsStore.sortOptions.field === 'accommodation_number'" class="w-4 h-4" :class="bookingsStore.sortOptions.order === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="bookingsStore.updateSort('check_in_date')">
                  <div class="flex items-center space-x-1">
                    <span>Dates</span>
                    <svg v-if="bookingsStore.sortOptions.field === 'check_in_date'" class="w-4 h-4" :class="bookingsStore.sortOptions.order === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="bookingsStore.updateSort('total_amount')">
                  <div class="flex items-center space-x-1">
                    <span>Amount</span>
                    <svg v-if="bookingsStore.sortOptions.field === 'total_amount'" class="w-4 h-4" :class="bookingsStore.sortOptions.order === 'asc' ? 'transform rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="booking in bookingsStore.bookings" :key="booking.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    @change="bookingsStore.toggleBookingSelection(booking.id)"
                    type="checkbox"
                    class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    :checked="bookingsStore.selectedBookingIds.includes(booking.id)"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ booking.client_name || `Client #${booking.client_id}` }}</div>
                      <div v-if="booking.client_phone" class="text-sm text-gray-500">{{ booking.client_phone }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.accommodation_number || `Room #${booking.accommodation_id}` }}</div>
                  <div class="text-sm text-gray-500">{{ booking.accommodation_type || 'Unknown Type' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="!booking.is_open_dates" class="text-sm text-gray-900">
                    <div>{{ formatDate(booking.check_in_date) }}</div>
                    <div class="text-gray-500">{{ formatDate(booking.check_out_date) }}</div>
                  </div>
                  <div v-else class="text-sm text-orange-600 font-medium">
                    Open Dates
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ booking.guests_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusBadgeClass(booking.status)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ formatStatusLabel(booking.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getPaymentStatusBadgeClass(booking.payment_status)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ formatPaymentStatusLabel(booking.payment_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>${{ formatCurrency(booking.total_amount) }}</div>
                  <div v-if="Number(booking.paid_amount) > 0" class="text-xs text-green-600">
                    Paid: ${{ formatCurrency(booking.paid_amount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewBookingDetails(booking)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </button>
                    <button
                      @click="editBooking(booking)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      v-if="canCheckIn(booking)"
                      @click="quickCheckIn(booking)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Check In
                    </button>
                    <button
                      v-if="canCheckOut(booking)"
                      @click="quickCheckOut(booking)"
                      class="text-purple-600 hover:text-purple-900"
                    >
                      Check Out
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="bookingsStore.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  @click="bookingsStore.setPage(bookingsStore.currentPage - 1)"
                  :disabled="bookingsStore.currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  @click="bookingsStore.setPage(bookingsStore.currentPage + 1)"
                  :disabled="bookingsStore.currentPage >= bookingsStore.totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">{{ (bookingsStore.currentPage - 1) * bookingsStore.itemsPerPage + 1 }}</span>
                    to
                    <span class="font-medium">{{ Math.min(bookingsStore.currentPage * bookingsStore.itemsPerPage, bookingsStore.total) }}</span>
                    of
                    <span class="font-medium">{{ bookingsStore.total }}</span>
                    results
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      @click="bookingsStore.setPage(bookingsStore.currentPage - 1)"
                      :disabled="bookingsStore.currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      @click="bookingsStore.setPage(bookingsStore.currentPage + 1)"
                      :disabled="bookingsStore.currentPage >= bookingsStore.totalPages"
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

        <!-- Mobile List -->
        <div v-if="bookingsStore.bookings.length > 0" class="lg:hidden bg-white shadow-sm rounded-lg overflow-hidden">
          <ul class="divide-y divide-gray-200">
            <li v-for="booking in bookingsStore.bookings" :key="booking.id" class="p-4 hover:bg-gray-50">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <input
                    @change="bookingsStore.toggleBookingSelection(booking.id)"
                    type="checkbox"
                    class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded mr-3"
                    :checked="bookingsStore.selectedBookingIds.includes(booking.id)"
                  />
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">{{ booking.client_name || `Client #${booking.client_id}` }}</h3>
                    <p class="text-xs text-gray-500">{{ booking.accommodation_number || `Room #${booking.accommodation_id}` }} • {{ booking.accommodation_type || 'Unknown Type' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    :class="getStatusBadgeClass(booking.status)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ formatStatusLabel(booking.status) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between mb-2">
                <div class="text-sm text-gray-600">
                  <div v-if="!booking.is_open_dates">
                    {{ formatDate(booking.check_in_date) }} - {{ formatDate(booking.check_out_date) }}
                  </div>
                  <div v-else class="text-orange-600 font-medium">Open Dates</div>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  ${{ formatCurrency(booking.total_amount) }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-xs text-gray-500">{{ booking.guests_count }} guests</span>
                  <span
                    :class="getPaymentStatusBadgeClass(booking.payment_status)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ formatPaymentStatusLabel(booking.payment_status) }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewBookingDetails(booking)"
                    class="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    @click="editBooking(booking)"
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Booking Modal (Create/Edit/View) -->
    <BookingModal
      v-if="showBookingModal"
      :booking="selectedBooking"
      :mode="modalMode"
      @close="closeBookingModal"
      @save="handleBookingSave"
      @check-in="handleCheckIn"
      @check-out="handleCheckOut"
      @process-payment="handleProcessPayment"
      :loading="bookingsStore.loading"
    />

    <!-- Create Booking Modal -->
    <CreateBookingModal
      v-if="showCreateBookingModal"
      @close="showCreateBookingModal = false"
      @save="handleBookingCreate"
      :loading="bookingsStore.loading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { debounce } from 'lodash-es'
import { useBookingsStore } from '../stores/bookings'
import BookingModal from '../components/bookings/BookingModal.vue'
import CreateBookingModal from '../components/bookings/CreateBookingModal.vue'
import { BookingStatus, PaymentStatus } from '../types/booking'
import type { BookingListItem, BookingCreate, BookingUpdate, BookingCheckIn, BookingCheckOut, BookingPayment, BookingStats } from '../types/booking'

const router = useRouter()
const toast = useToast()
const bookingsStore = useBookingsStore()

// Component state
const showFilters = ref(false)
const showBookingModal = ref(false)
const showCreateBookingModal = ref(false)
const selectedBooking = ref<BookingListItem | null>(null)
const modalMode = ref<'view' | 'edit'>('view')
const openDatesOnly = ref(false)
const stats = ref<BookingStats | null>(null)

// Computed properties
const hasActiveFilters = computed(() => {
  const filters = bookingsStore.filters
  return !!(
    filters.search ||
    filters.status.length > 0 ||
    filters.paymentStatus.length > 0 ||
    filters.accommodationId ||  
    filters.clientId ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.isOpenDates !== undefined
  )
})

const activeFiltersCount = computed(() => {
  let count = 0
  const filters = bookingsStore.filters
  if (filters.search) count++
  if (filters.status.length > 0) count++
  if (filters.paymentStatus.length > 0) count++
  if (filters.accommodationId) count++
  if (filters.clientId) count++
  if (filters.dateFrom || filters.dateTo) count++
  if (filters.isOpenDates !== undefined) count++
  return count
})

const allSelected = computed(() => {
  return bookingsStore.bookings.length > 0 && 
         bookingsStore.selectedBookingIds.length === bookingsStore.bookings.length
})

// Methods
const debouncedSearch = debounce(() => {
  bookingsStore.fetchBookings(true)
}, 300)

const updateOpenDatesFilter = () => {
  bookingsStore.updateFilters({ 
    isOpenDates: openDatesOnly.value ? true : undefined 
  })
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    bookingsStore.clearSelection()
  } else {
    bookingsStore.selectAllBookings()
  }
}

// Booking actions
const viewBookingDetails = (booking: BookingListItem) => {
  selectedBooking.value = booking
  modalMode.value = 'view'
  showBookingModal.value = true
}

const editBooking = (booking: BookingListItem) => {
  selectedBooking.value = booking
  modalMode.value = 'edit'
  showBookingModal.value = true
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedBooking.value = null
  modalMode.value = 'view'
}

const handleBookingSave = async (bookingData: BookingUpdate) => {
  if (!selectedBooking.value) return
  
  const result = await bookingsStore.updateBooking(selectedBooking.value.id, bookingData)
  if (result.success) {
    toast.success('Booking updated successfully')
    closeBookingModal()
  } else {
    toast.error(result.error || 'Failed to update booking')
  }
}

const handleBookingCreate = async (bookingData: any) => {
  let result
  
  // Check if we have inventory or custom items
  const hasInventoryItems = bookingData.inventory_items && bookingData.inventory_items.length > 0
  const hasCustomItems = bookingData.custom_items && bookingData.custom_items.length > 0
  
  if (hasInventoryItems || hasCustomItems) {
    // Prepare inventory items for the store method
    const inventoryItems = (bookingData.inventory_items || []).map((item: any) => ({
      itemId: item.inventory_item_id,
      quantity: item.quantity,
      notes: item.notes
    }))
    
    // Prepare custom items for the store method
    const customItems = (bookingData.custom_items || []).map((item: any) => ({
      itemId: item.custom_item_id,
      quantity: item.quantity,
      unitPrice: item.price,
      notes: item.notes
    }))
    
    // Remove inventory/custom items from booking data before creating
    const { inventory_items, custom_items, ...cleanBookingData } = bookingData
    
    result = await bookingsStore.createBookingWithItems(cleanBookingData, inventoryItems, customItems)
  } else {
    // Standard booking creation without items
    result = await bookingsStore.createBooking(bookingData)
  }
  
  if (result.success) {
    toast.success('Booking created successfully')
    showCreateBookingModal.value = false
  } else {
    toast.error(result.error || 'Failed to create booking')
  }
}

const handleCheckIn = async (data: BookingCheckIn) => {
  if (!selectedBooking.value) return
  
  const result = await bookingsStore.checkInBooking(selectedBooking.value.id, data)
  if (result.success) {
    toast.success('Booking checked in successfully')
    closeBookingModal()
  } else {
    toast.error(result.error || 'Failed to check in booking')
  }
}

const handleCheckOut = async (data: BookingCheckOut) => {
  if (!selectedBooking.value) return
  
  const result = await bookingsStore.checkOutBooking(selectedBooking.value.id, data)
  if (result.success) {
    toast.success('Booking checked out successfully')
    closeBookingModal()
  } else {
    toast.error(result.error || 'Failed to check out booking')
  }
}

const handleProcessPayment = async (data: BookingPayment) => {
  if (!selectedBooking.value) return
  
  const result = await bookingsStore.processPayment(selectedBooking.value.id, data)
  if (result.success) {
    toast.success('Payment processed successfully')
    closeBookingModal()
  } else {
    toast.error(result.error || 'Failed to process payment')
  }
}

// Quick actions
const quickCheckIn = (booking: BookingListItem) => {
  const checkInData: BookingCheckIn = {
    actual_check_in: new Date().toISOString(),
    guests_count: booking.guests_count
  }
  
  bookingsStore.checkInBooking(booking.id, checkInData).then(result => {
    if (result.success) {
      toast.success('Booking checked in successfully')
    } else {
      toast.error(result.error || 'Failed to check in booking')
    }
  })
}

const quickCheckOut = (booking: BookingListItem) => {
  const checkOutData: BookingCheckOut = {
    actual_check_out: new Date().toISOString()
  }
  
  bookingsStore.checkOutBooking(booking.id, checkOutData).then(result => {
    if (result.success) {
      toast.success('Booking checked out successfully')
    } else {
      toast.error(result.error || 'Failed to check out booking')
    }
  })
}

// Bulk actions
const bulkConfirm = async () => {
  const result = await bookingsStore.bulkUpdateStatus(BookingStatus.CONFIRMED)
  if (result.success) {
    toast.success('Selected bookings confirmed')
  } else {
    toast.error(result.error || 'Failed to confirm bookings')
  }
}

const bulkCancel = async () => {
  const result = await bookingsStore.bulkUpdateStatus(BookingStatus.CANCELLED)
  if (result.success) {
    toast.success('Selected bookings cancelled')
  } else {
    toast.error(result.error || 'Failed to cancel bookings')
  }
}

// Helper functions
const canCheckIn = (booking: BookingListItem): boolean => {
  return booking.status === BookingStatus.CONFIRMED && !booking.is_open_dates
}

const canCheckOut = (booking: BookingListItem): boolean => {
  return booking.status === BookingStatus.CHECKED_IN
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: string | number): string => {
  return Number(amount).toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

const formatStatusLabel = (status: BookingStatus): string => {
  const labels = {
    [BookingStatus.PENDING]: 'Pending',
    [BookingStatus.CONFIRMED]: 'Confirmed',
    [BookingStatus.CHECKED_IN]: 'Checked In',
    [BookingStatus.CHECKED_OUT]: 'Checked Out',
    [BookingStatus.CANCELLED]: 'Cancelled'
  }
  return labels[status] || status
}

const formatPaymentStatusLabel = (status: PaymentStatus): string => {
  const labels = {
    [PaymentStatus.NOT_PAID]: 'Not Paid',
    [PaymentStatus.PARTIAL]: 'Partial',
    [PaymentStatus.PAID]: 'Paid'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: BookingStatus): string => {
  const classes = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [BookingStatus.CHECKED_IN]: 'bg-green-100 text-green-800',
    [BookingStatus.CHECKED_OUT]: 'bg-gray-100 text-gray-800',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusBadgeClass = (status: PaymentStatus): string => {
  const classes = {
    [PaymentStatus.NOT_PAID]: 'bg-red-100 text-red-800',
    [PaymentStatus.PARTIAL]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.PAID]: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    bookingsStore.fetchBookings(),
    bookingsStore.fetchStats()
  ])
  stats.value = bookingsStore.stats
})

// Watch for filter changes
watch(
  () => [bookingsStore.filters.status, bookingsStore.filters.paymentStatus],
  () => {
    bookingsStore.fetchBookings(true)
  },
  { deep: true }
)
</script>