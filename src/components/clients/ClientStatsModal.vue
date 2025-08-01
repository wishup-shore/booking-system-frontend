<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6"
  >
    <div
      class="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border max-h-full overflow-y-auto"
    >
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Client Statistics</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Loading client statistics...</p>
        </div>

        <div v-else-if="stats" class="space-y-6">
          <!-- Client Info Header -->
          <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div class="h-16 w-16 flex-shrink-0">
              <img
                v-if="client.photo_url"
                :src="client.photo_url"
                :alt="`${client.first_name} ${client.last_name}`"
                class="h-16 w-16 rounded-full object-cover"
              />
              <div
                v-else
                class="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center"
              >
                <span class="text-xl font-medium text-primary-600">
                  {{ getInitials(`${client.first_name} ${client.last_name}`) }}
                </span>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-xl font-semibold text-gray-900">
                {{ client.first_name }} {{ client.last_name }}
              </h4>
              <div class="mt-1 space-y-1">
                <p v-if="client.phone" class="text-sm text-gray-600 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ client.phone }}
                </p>
                <p v-if="client.email" class="text-sm text-gray-600 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ client.email }}
                </p>
              </div>
            </div>
            <div v-if="client.rating" class="flex items-center">
              <div class="flex items-center">
                <svg
                  v-for="star in 5"
                  :key="star"
                  :class="[
                    star <= (client.rating || 0) ? 'text-yellow-400' : 'text-gray-300',
                    'w-5 h-5'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-sm font-medium text-gray-700">{{ client.rating }}/5</span>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- Total Visits -->
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6 border border-blue-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-blue-800">Total Visits</dt>
                  <dd class="mt-1 text-2xl font-semibold text-blue-900">{{ stats.visits_count }}</dd>
                </div>
              </div>
            </div>

            <!-- Total Spent -->
            <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 sm:p-6 border border-green-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-green-800">Total Spent</dt>
                  <dd class="mt-1 text-2xl font-semibold text-green-900">${{ formatAmount(stats.total_spent) }}</dd>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-4">
            <h5 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Additional Information
            </h5>

            <!-- Group Information -->
            <div v-if="client.group" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div :class="[
                    client.group.color ? `bg-${client.group.color}-100 text-${client.group.color}-600` : 'bg-primary-100 text-primary-600',
                    'h-8 w-8 rounded-lg flex items-center justify-center'
                  ]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Member of Group</p>
                  <p class="text-sm text-gray-600">{{ client.group.name }}</p>
                </div>
              </div>
            </div>

            <!-- Car Numbers -->
            <div v-if="client.car_numbers && client.car_numbers.length > 0" class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12a3 3 0 11-6 0 3 3 0 016 0zM21 12a3 3 0 11-6 0 3 3 0 016 0zM7 21V3M17 21V3" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Vehicle Numbers</p>
                <div class="mt-1 flex flex-wrap gap-1">
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

            <!-- Social Links -->
            <div v-if="client.social_links && Object.keys(client.social_links).length > 0" class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Social Links</p>
                <div class="mt-1 space-y-1">
                  <div
                    v-for="(url, platform) in client.social_links"
                    :key="platform"
                    class="flex items-center text-sm"
                  >
                    <span class="text-gray-600 mr-2">{{ platform }}:</span>
                    <a
                      :href="url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary-600 hover:text-primary-800 underline"
                    >
                      {{ url }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comments -->
            <div v-if="client.comments" class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Comments/Notes</p>
                <p class="mt-1 text-sm text-gray-600">{{ client.comments }}</p>
              </div>
            </div>

            <!-- Member Since -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 012-2h4a1 1 0 012 2v4m0 0V7a1 1 0 011 1v3a1 1 0 01-.236.636L17 12l-.236.236A1 1 0 0117 13v3a1 1 0 01-1 1H8a1 1 0 01-1-1v-3a1 1 0 01.236-.636L7 12l-.236-.236A1 1 0 017 11V8a1 1 0 011-1z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Member Since</p>
                <p class="text-sm text-gray-600">{{ formatDate(client.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No statistics available</h3>
          <p class="mt-2 text-sm text-gray-500">Statistics could not be loaded for this client.</p>
        </div>

        <!-- Close Button -->
        <div class="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Client, ClientStats } from '../../types/client'

interface Props {
  client: Client
  stats: ClientStats | null
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>