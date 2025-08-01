<template>
  <header
    :class="[
      'mobile-header fixed top-0 left-0 right-0 z-header transition-transform duration-300 ease-out bg-white border-b border-gray-200 shadow-mobile',
      isVisible ? 'translate-y-0' : '-translate-y-full'
    ]"
  >
    <!-- Safe area top padding -->
    <div class="pt-safe" />
    
    <!-- Header content -->
    <div class="flex items-center justify-between h-16 px-4">
      <!-- Left side: Menu button and logo -->
      <div class="flex items-center">
        <button
          @click="$emit('menu-toggle')"
          class="touch-target tap-highlight-none p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 lg:hidden"
          aria-label="Open menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <!-- Logo and app name -->
        <div class="flex items-center ml-2">
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
          <div class="ml-3 hidden xs:block">
            <h1 class="text-lg font-semibold text-gray-900">{{ currentPageTitle }}</h1>
          </div>
        </div>
      </div>

      <!-- Right side: User menu and actions -->
      <div class="flex items-center space-x-2">
        <!-- Notifications button (placeholder) -->
        <button
          class="touch-target tap-highlight-none p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 relative"
          aria-label="Notifications"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <!-- Notification badge -->
          <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
            3
          </span>
        </button>

        <!-- User profile button -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            :class="[
              'touch-target tap-highlight-none flex items-center p-1 rounded-lg transition-colors duration-200',
              isUserMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
            ]"
            aria-label="User menu"
          >
            <div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-primary-600 font-medium text-sm">
                {{ getUserInitials(user?.username || 'U') }}
              </span>
            </div>
            <svg
              :class="[
                'w-4 h-4 ml-1 text-gray-500 transition-transform duration-200',
                isUserMenuOpen ? 'transform rotate-180' : ''
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User dropdown menu -->
          <Transition name="slide-down">
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 top-full mt-2 w-56 bg-white rounded-mobile shadow-mobile-lg border border-gray-200 py-2 z-dropdown"
              @click.stop
            >
              <!-- User info -->
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="text-sm font-medium text-gray-900">{{ user?.username }}</div>
                <div class="text-xs text-gray-500">{{ user?.email }}</div>
              </div>
              
              <!-- Menu items -->
              <div class="py-1">
                <button
                  @click="handleProfileClick"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Profile
                </button>
                
                <button
                  @click="handleSettingsClick"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                
                <div class="border-t border-gray-100 my-1" />
                
                <button
                  @click="handleLogoutClick"
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </Transition>
        </div>
      </div>
    </div>

    <!-- Click outside handler for user menu -->
    <div
      v-if="isUserMenuOpen"
      class="fixed inset-0 z-50"
      @click="closeUserMenu"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { User } from '../../types/auth'
import type { MobileHeaderProps } from '../../types/mobile'

// Props
interface Props extends MobileHeaderProps {
  user?: User | null
}

withDefaults(defineProps<Props>(), {
  isVisible: true,
  user: null
})

// Emits
const emit = defineEmits<{
  'menu-toggle': []
  logout: []
  navigate: [route: string]
}>()

// Composables
const route = useRoute()

// State
const isUserMenuOpen = ref(false)

// Computed
const currentPageTitle = computed(() => {
  const routeNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    accommodations: 'Accommodations',
    bookings: 'Bookings',
    clients: 'Clients',
    inventory: 'Inventory',
    'custom-items': 'Custom Items',
    'inventory-types': 'Inventory Types',
    'inventory-items': 'Inventory Items'
  }
  
  return routeNameMap[route.name as string] || 'Booking System'
})

// Methods
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const getUserInitials = (username: string): string => {
  return username
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleProfileClick = () => {
  closeUserMenu()
  // TODO: Navigate to profile page when implemented
  console.log('Profile clicked')
}

const handleSettingsClick = () => {
  closeUserMenu()
  // TODO: Navigate to settings page when implemented
  console.log('Settings clicked')
}

const handleLogoutClick = () => {
  closeUserMenu()
  emit('logout')
}

// Close user menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  const userMenu = document.querySelector('.relative')
  
  if (userMenu && !userMenu.contains(target)) {
    closeUserMenu()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Header height accounting for safe area */
.mobile-header {
  height: calc(4rem + env(safe-area-inset-top));
}

/* Slide down animation for dropdown */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease-out;
  transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

/* Ensure proper layering */
.mobile-header {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Mobile-optimized touch interactions */
@media (hover: none) {
  .mobile-header button:hover {
    background-color: initial;
  }
  
  .mobile-header button:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

/* Custom scrollbar for dropdown if needed */
.z-dropdown {
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.z-dropdown::-webkit-scrollbar {
  width: 4px;
}

.z-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.z-dropdown::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

/* Fix for iOS Safari bounce effect */
@supports (-webkit-touch-callout: none) {
  .mobile-header {
    -webkit-user-select: none;
    user-select: none;
  }
}

/* Ensure notification badge is properly positioned */
.relative .absolute {
  pointer-events: none;
}
</style>