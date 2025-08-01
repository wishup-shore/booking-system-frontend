<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h1 class="text-xl font-semibold text-gray-900">Booking System</h1>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              Welcome, <span class="font-medium">{{ authStore.user?.username }}</span>
            </div>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <!-- Total Bookings -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-6 9l2-2m0 0l2 2m-2-2v6" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookingsStore.total }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Available Accommodations -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Available Rooms</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ accommodationsStore.availableAccommodationsCount }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Today's Check-ins -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7a4 4 0 01-4-4v-2M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Today's Check-ins</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookingsStore.todaysCheckInsCount }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Bookings -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Pending Bookings</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bookingsStore.pendingBookings.length }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar and Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Calendar Events -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Calendar Overview</h3>
                <div class="flex space-x-2">
                  <button
                    @click="previousPeriod"
                    class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    @click="nextPeriod"
                    class="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-sm text-gray-600 mb-2">{{ currentPeriodText }}</div>
              
              <!-- Calendar Statistics -->
              <div v-if="bookingsStore.calendarStats" class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">{{ bookingsStore.calendarStats.total_bookings }}</div>
                  <div class="text-xs text-blue-500">Total Bookings</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">{{ Math.round(bookingsStore.calendarStats.occupancy_rate * 100) }}%</div>
                  <div class="text-xs text-green-500">Occupancy Rate</div>
                </div>
              </div>

              <!-- Recent Calendar Events -->
              <div class="space-y-3 max-h-60 overflow-y-auto">
                <div v-if="bookingsStore.calendarEvents.length === 0" class="text-center py-4 text-gray-500">
                  No events for this period
                </div>
                <div
                  v-for="event in bookingsStore.calendarEvents.slice(0, 5)"
                  :key="event.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                    <div class="text-xs text-gray-500">{{ event.client_name }}</div>
                    <div class="text-xs text-gray-400">{{ formatDate(event.start || '') }} - {{ formatDate(event.end || '') }}</div>
                  </div>
                  <div class="flex-shrink-0">
                    <span
                      :class="getEventStatusClass(event.status)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ event.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div class="space-y-3 max-h-80 overflow-y-auto">
                <div
                  v-for="booking in bookingsStore.bookings.slice(0, 8)"
                  :key="booking.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ booking.client_name }}</div>
                    <div class="text-xs text-gray-500">Room {{ booking.accommodation_number }}</div>
                    <div class="text-xs text-gray-400">{{ formatDate(booking.created_at) }}</div>
                  </div>
                  <div class="flex-shrink-0">
                    <span
                      :class="getBookingStatusClass(booking.status)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ booking.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Quick Actions</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Core Management -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-700 text-center">Core Management</h4>
                <div class="space-y-2">
                  <button
                    @click="$router.push('/accommodations')"
                    class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Accommodations
                  </button>
                  <button
                    @click="$router.push('/bookings')"
                    class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-6 9l2-2m0 0l2 2m-2-2v6"
                      />
                    </svg>
                    Bookings
                  </button>
                  <button
                    @click="$router.push('/clients')"
                    class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    Clients
                  </button>
                </div>
              </div>

              <!-- Inventory Management -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-700 text-center">Inventory</h4>
                <div class="space-y-2">
                  <button
                    @click="$router.push('/inventory-types')"
                    class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Inventory Types
                  </button>
                  <button
                    @click="$router.push('/inventory-items')"
                    class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    Inventory Items
                  </button>
                  <button
                    @click="$router.push('/custom-items')"
                    class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Custom Items
                  </button>
                </div>
              </div>

              <!-- Reports & Analytics -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-700 text-center">Reports</h4>
                <div class="space-y-2">
                  <button
                    disabled
                    class="w-full inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Revenue Reports
                  </button>
                  <button
                    disabled
                    class="w-full inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-6 9l2-2m0 0l2 2m-2-2v6"
                      />
                    </svg>
                    Booking Analytics
                  </button>
                  <button
                    disabled
                    class="w-full inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    Inventory Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingsStore } from '../stores/bookings'
import { useAccommodationsStore } from '../stores/accommodations'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const bookingsStore = useBookingsStore()
const accommodationsStore = useAccommodationsStore()
const toast = useToast()

// Calendar state
const currentDate = ref(new Date())

// Computed properties
const currentPeriodText = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  }
  const startDate = new Date(currentDate.value)
  startDate.setDate(1)
  
  const endDate = new Date(currentDate.value)
  endDate.setMonth(endDate.getMonth() + 1, 0)
  
  return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`
})

// Methods
const handleLogout = () => {
  authStore.logout()
  toast.info('You have been signed out')
  router.push('/login')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEventStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getBookingStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'checked_in':
      return 'bg-indigo-100 text-indigo-800'
    case 'checked_out':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const previousPeriod = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  loadCalendarData()
}

const nextPeriod = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  loadCalendarData()
}

const loadCalendarData = async () => {
  // Get start and end dates for the current month
  const startDate = new Date(currentDate.value)
  startDate.setDate(1)
  
  const endDate = new Date(currentDate.value)
  endDate.setMonth(endDate.getMonth() + 1, 0)
  
  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]
  
  // Load calendar events and statistics
  await Promise.all([
    bookingsStore.fetchCalendarEvents(startDateStr, endDateStr),
    bookingsStore.fetchCalendarStatistics(startDateStr, endDateStr)
  ])
}

const loadDashboardData = async () => {
  try {
    // Load initial data
    await Promise.all([
      bookingsStore.fetchBookings(),
      accommodationsStore.fetchAccommodations(),
      loadCalendarData()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    toast.error('Failed to load dashboard data')
  }
}

// Check authentication and load data on mount
onMounted(async () => {
  if (!(await authStore.checkAuth())) {
    router.push('/login')
    return
  }
  
  // Load dashboard data
  await loadDashboardData()
})
</script>
