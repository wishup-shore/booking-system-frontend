<template>
  <div class="mobile-layout min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <MobileHeader 
      :is-visible="isHeaderVisible"
      :user="authStore.user"
      @logout="handleLogout"
      @menu-toggle="toggleMenu"
      @navigate="handleNavigation"
    />

    <!-- Mobile Navigation Drawer -->
    <Transition name="slide-right">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-drawer lg:hidden"
        @click="closeMenu"
      >
        <!-- Backdrop -->
        <div class="overlay-mobile backdrop-blur-mobile" />
        
        <!-- Menu Panel -->
        <nav
          class="fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-white shadow-mobile-lg transform transition-transform duration-300 ease-out pt-safe"
          @click.stop
        >
          <!-- Menu Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center">
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
              <span class="ml-3 text-lg font-semibold text-gray-900">Booking System</span>
            </div>
            <button
              @click="closeMenu"
              class="touch-target tap-highlight-none p-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- User Info -->
          <div v-if="authStore.user" class="p-4 border-b border-gray-200">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-medium text-sm">
                  {{ getUserInitials(authStore.user.username) }}
                </span>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">{{ authStore.user.username }}</div>
                <div class="text-xs text-gray-500">{{ authStore.user.email }}</div>
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <div class="py-4 space-y-1">
            <button
              v-for="item in navigationItems"
              :key="item.name"
              @click="navigateToRoute(item.route)"
              :class="[
                'w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 tap-highlight-none touch-target',
                currentRoute === item.route
                  ? 'text-primary-600 bg-primary-50 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
              </svg>
              {{ item.name }}
            </button>
          </div>

          <!-- Menu Footer -->
          <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 pb-safe">
            <button
              @click="handleLogout"
              class="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 tap-highlight-none touch-target"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </nav>
      </div>
    </Transition>

    <!-- Main Content Area -->
    <main
      :class="[
        'mobile-content transition-all duration-300 ease-out',
        isHeaderVisible ? 'pt-16' : 'pt-0',
        isMenuOpen ? 'pointer-events-none' : '',
        'pb-20' // Add bottom padding for bottom navigation
      ]"
      :style="{ paddingTop: headerHeight + 'px' }"
    >
      <div class="min-h-screen pb-safe">
        <slot />
      </div>
    </main>

    <!-- Bottom Navigation -->
    <BottomNavigation :badges="navigationBadges" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'vue-toastification'
import MobileHeader from '../components/layout/MobileHeader.vue'
import BottomNavigation from '../components/navigation/BottomNavigation.vue'

// Composables
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// State
const isMenuOpen = ref(false)
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)
const headerHeight = ref(64) // Default header height in pixels

// Bottom navigation badges - can be updated by stores or external logic
const navigationBadges = ref<Record<string, number>>({})

// Computed
const currentRoute = computed(() => route.name as string)

// Navigation items configuration
const navigationItems = [
  {
    name: 'Dashboard',
    route: 'dashboard',
    icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
  },
  {
    name: 'Accommodations',
    route: 'accommodations',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  {
    name: 'Bookings',
    route: 'bookings',
    icon: 'M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2m-6 9l2-2m0 0l2 2m-2-2v6'
  },
  {
    name: 'Clients',
    route: 'clients',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
  },
  {
    name: 'Inventory',
    route: 'inventory',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    name: 'Custom Items',
    route: 'custom-items',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const navigateToRoute = async (routeName: string) => {
  closeMenu()
  
  // Small delay to allow menu animation to start
  await nextTick()
  setTimeout(() => {
    router.push({ name: routeName })
  }, 100)
}

const handleNavigation = (routeName: string) => {
  navigateToRoute(routeName)
}

const handleLogout = () => {
  authStore.logout()
  toast.info('You have been signed out')
  router.push('/login')
}

const getUserInitials = (username: string): string => {
  return username
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Scroll behavior for header visibility
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Only hide header when scrolling down and past initial threshold
  if (currentScrollY > 100) {
    isHeaderVisible.value = currentScrollY < lastScrollY.value
  } else {
    isHeaderVisible.value = true
  }
  
  lastScrollY.value = currentScrollY
}

// Viewport management
const updateViewportHeight = () => {
  // Set CSS custom property for actual viewport height (accounts for mobile browser bars)
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

const handleResize = () => {
  updateViewportHeight()
  
  // Close menu on large screen
  if (window.innerWidth >= 1024) {
    closeMenu()
  }
}

// Lifecycle hooks
onMounted(() => {
  // Set up viewport handling
  updateViewportHeight()
  
  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('orientationchange', updateViewportHeight, { passive: true })
  
  // Handle menu state changes for body scroll prevention
  const preventBodyScroll = () => {
    if (isMenuOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('orientationchange', updateViewportHeight)
  
  // Reset body overflow
  document.body.style.overflow = ''
})

// Watch menu state for body scroll prevention
const menuUnwatch = watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  menuUnwatch()
})
</script>

<style scoped>
/* Custom viewport height using CSS custom property */
.mobile-layout {
  min-height: calc(var(--vh, 1vh) * 100);
}

/* Smooth transitions for layout changes */
.mobile-content {
  will-change: padding-top;
}

/* Slide transition for menu */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
}

.slide-right-enter-from nav {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
}

.slide-right-leave-to nav {
  transform: translateX(-100%);
}

/* Ensure proper stacking */
.mobile-layout {
  position: relative;
  z-index: 1;
}

/* Mobile-optimized scrolling */
.mobile-content {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Fix for iOS Safari viewport issues */
@supports (-webkit-touch-callout: none) {
  .mobile-layout {
    min-height: -webkit-fill-available;
  }
}

/* Custom scrollbar for navigation */
nav {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

/* Ensure menu is above everything */
nav {
  z-index: 1000;
}
</style>