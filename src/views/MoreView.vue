<template>
  <div class="more-view p-4">
    <div class="text-center py-12 mb-8">
      <div class="mb-4">
        <EllipsisHorizontalIcon class="w-16 h-16 text-gray-300 mx-auto" />
      </div>
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">More</h2>
      <p class="text-gray-500">
        Additional features and settings
      </p>
    </div>

    <!-- Feature Grid -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- Settings -->
      <router-link
        to="/settings"
        class="flex flex-col items-center p-6 bg-white rounded-mobile shadow-mobile border tap-highlight-none touch-target transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
      >
        <CogIcon class="w-8 h-8 text-gray-600 mb-2" />
        <span class="text-sm font-medium text-gray-900">Settings</span>
      </router-link>

      <!-- Reports -->
      <router-link
        to="/reports"
        class="flex flex-col items-center p-6 bg-white rounded-mobile shadow-mobile border tap-highlight-none touch-target transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
      >
        <ChartBarIcon class="w-8 h-8 text-gray-600 mb-2" />
        <span class="text-sm font-medium text-gray-900">Reports</span>
      </router-link>

      <!-- Accommodations -->
      <router-link
        to="/accommodations"
        class="flex flex-col items-center p-6 bg-white rounded-mobile shadow-mobile border tap-highlight-none touch-target transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
      >
        <BuildingOfficeIcon class="w-8 h-8 text-gray-600 mb-2" />
        <span class="text-sm font-medium text-gray-900">Accommodations</span>
      </router-link>

      <!-- Inventory -->
      <router-link
        to="/inventory"
        class="flex flex-col items-center p-6 bg-white rounded-mobile shadow-mobile border tap-highlight-none touch-target transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
      >
        <CubeIcon class="w-8 h-8 text-gray-600 mb-2" />
        <span class="text-sm font-medium text-gray-900">Inventory</span>
      </router-link>
    </div>

    <!-- Additional Options -->
    <div class="space-y-2">
      <div class="bg-white rounded-mobile shadow-mobile border">
        <button class="w-full flex items-center justify-between p-4 tap-highlight-none touch-target transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100">
          <div class="flex items-center">
            <QuestionMarkCircleIcon class="w-5 h-5 text-gray-500 mr-3" />
            <span class="text-sm font-medium text-gray-900">Help & Support</span>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div class="bg-white rounded-mobile shadow-mobile border">
        <button class="w-full flex items-center justify-between p-4 tap-highlight-none touch-target transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100">
          <div class="flex items-center">
            <InformationCircleIcon class="w-5 h-5 text-gray-500 mr-3" />
            <span class="text-sm font-medium text-gray-900">About</span>
          </div>
          <ChevronRightIcon class="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EllipsisHorizontalIcon,
  CogIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CubeIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
</script>