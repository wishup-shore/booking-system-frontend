import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Simple responsive composable for mobile detection
 * Uses Tailwind CSS breakpoints from the mobile-first configuration
 */
export function useResponsive() {
  const windowWidth = ref(768) // Default to tablet size for SSR
  const windowHeight = ref(1024)

  // Simple mobile detection (< 768px = mobile)
  const isMobile = computed(() => windowWidth.value < 768)
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
  const isDesktop = computed(() => windowWidth.value >= 1024)

  // Update dimensions
  const updateDimensions = () => {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
    }
  }

  // Lifecycle
  onMounted(() => {
    updateDimensions()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateDimensions, { passive: true })
      window.addEventListener('orientationchange', updateDimensions, { passive: true })
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
    }
  })

  return {
    windowWidth,
    windowHeight,
    isMobile,
    isTablet,
    isDesktop,
    updateDimensions
  }
}