<template>
  <Teleport to="body">
    <Transition
      name="slide-up"
      appear
    >
      <nav
        v-if="shouldShowNavigation"
        :class="[
          'bottom-nav bg-white border-t border-gray-200',
          'shadow-mobile-lg backdrop-blur-mobile',
          'transition-transform duration-300 ease-out',
          isVisible ? 'translate-y-0' : 'translate-y-full'
        ]"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <!-- Navigation Container -->
        <div class="flex items-center justify-around px-2 pt-2 pb-safe">
          <NavigationItem
            v-for="item in navigationItems"
            :key="item.route"
            :item="item"
            class="flex-1 max-w-[80px]"
          />
        </div>
      </nav>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import type { NavigationItem as NavigationItemType } from '@/types/mobile'
import NavigationItem from './NavigationItem.vue'

interface Props {
  /**
   * Badge counts for navigation items
   * Keys should match navigation item routes
   */
  badges?: Record<string, number>
  
  /**
   * Whether to hide navigation on scroll down
   * @default true
   */
  hideOnScroll?: boolean
  
  /**
   * Scroll threshold before hiding navigation
   * @default 50
   */
  scrollThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  badges: () => ({}),
  hideOnScroll: true,
  scrollThreshold: 50
})

// Composables
const { isDesktop } = useBreakpoint()

// State
const isVisible = ref(true)
const lastScrollY = ref(0)
const scrollDirection = ref<'up' | 'down'>('up')
const isScrolling = ref(false)
const scrollTimer = ref<number>()

// Navigation items configuration
const baseNavigationItems: NavigationItemType[] = [
  {
    name: 'Dashboard',
    route: '/dashboard',
    icon: 'HomeIcon'
  },
  {
    name: 'Calendar',
    route: '/calendar',
    icon: 'CalendarIcon'
  },
  {
    name: 'Bookings',
    route: '/bookings',
    icon: 'ClipboardDocumentListIcon'
  },
  {
    name: 'Clients',
    route: '/clients',
    icon: 'UserGroupIcon'
  },
  {
    name: 'More',
    route: '/more',
    icon: 'EllipsisHorizontalIcon'
  }
]

// Computed properties
const shouldShowNavigation = computed(() => {
  // Only show on mobile/tablet devices
  return !isDesktop.value
})

const navigationItems = computed(() => {
  // Add badges to navigation items
  return baseNavigationItems.map(item => ({
    ...item,
    badge: props.badges[item.route] || undefined
  }))
})

// Scroll handling
const handleScroll = () => {
  if (!props.hideOnScroll) return
  
  const currentScrollY = window.scrollY
  const scrollDifference = Math.abs(currentScrollY - lastScrollY.value)
  
  // Only react to significant scroll changes
  if (scrollDifference < 5) return
  
  // Determine scroll direction
  const newDirection = currentScrollY > lastScrollY.value ? 'down' : 'up'
  
  // Update visibility based on scroll direction and position
  if (currentScrollY < props.scrollThreshold) {
    // Always show when near top
    isVisible.value = true
  } else if (newDirection !== scrollDirection.value) {
    // Direction changed
    scrollDirection.value = newDirection
    isVisible.value = newDirection === 'up'
  }
  
  lastScrollY.value = currentScrollY
  isScrolling.value = true
  
  // Clear existing timer
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }
  
  // Set timer to detect end of scrolling
  scrollTimer.value = window.setTimeout(() => {
    isScrolling.value = false
    
    // Show navigation when scrolling stops if we're scrolling up
    if (scrollDirection.value === 'up') {
      isVisible.value = true
    }
  }, 150)
}

// Touch handling for better mobile experience
const handleTouchStart = () => {
  // Show navigation on touch to ensure it's accessible
  if (!isScrolling.value) {
    isVisible.value = true
  }
}

// Prevent navigation from hiding during route transitions
const handleRouteChange = () => {
  isVisible.value = true
  
  // Small delay to allow route transition to complete
  nextTick(() => {
    setTimeout(() => {
      lastScrollY.value = window.scrollY
    }, 100)
  })
}

// Lifecycle
onMounted(() => {
  // Set initial scroll position
  lastScrollY.value = window.scrollY
  
  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  
  // Listen for route changes to show navigation
  window.addEventListener('popstate', handleRouteChange)
  
  // Also listen for programmatic navigation
  const observer = new MutationObserver(() => {
    handleRouteChange()
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  })
  
  // Store observer for cleanup
  ;(window as any).__bottomNavObserver = observer
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('popstate', handleRouteChange)
  
  // Clean up timer
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }
  
  // Clean up observer
  const observer = (window as any).__bottomNavObserver
  if (observer) {
    observer.disconnect()
    delete (window as any).__bottomNavObserver
  }
})

// Expose methods for parent components
defineExpose({
  show: () => { isVisible.value = true },
  hide: () => { isVisible.value = false },
  toggle: () => { isVisible.value = !isVisible.value }
})
</script>

<style scoped>
/* Slide up animation for initial appearance */
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* Additional safe area support for inner content */
.pb-safe {
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(8px)) {
  nav {
    background-color: rgba(255, 255, 255, 0.95);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  nav {
    border-top-width: 2px;
    border-top-color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  nav,
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none !important;
  }
}

/* Z-index is handled by bottom-nav utility class */

/* iOS Safari specific fixes */
@supports (-webkit-touch-callout: none) {
  nav {
    /* Prevent iOS Safari from adding extra space */
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
}

/* Android Chrome specific fixes */
@media screen and (max-width: 767px) {
  nav {
    /* Ensure navigation doesn't get hidden by Android Chrome's dynamic UI */
    min-height: calc(60px + env(safe-area-inset-bottom));
  }
}
</style>