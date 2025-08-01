import { ref, computed, onMounted, onUnmounted, reactive, readonly } from 'vue'
import type { BreakpointConfig, BreakpointState } from '@/types/mobile'

/**
 * Enhanced breakpoint composable with Tailwind CSS integration
 * Provides reactive breakpoint detection, range matching, and mobile-first utilities
 * 
 * Features:
 * - Matches Tailwind CSS breakpoint configuration exactly
 * - Mobile-first approach with up/down/only/between utilities
 * - High-performance with minimal re-renders using computed caching
 * - SSR-safe with proper hydration
 * - Orientation-aware breakpoints
 * - Custom breakpoint definitions
 * - Debounced resize handling for performance
 */

// Default Tailwind CSS breakpoints matching tailwind.config.js
const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  xs: 320,   // Extra small devices (small phones)
  sm: 375,   // Small devices (phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (laptops)
  xl: 1280,  // Extra large devices
  '2xl': 1536 // 2X large devices
}

// Breakpoint keys for iteration
const BREAKPOINT_KEYS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
type BreakpointKey = typeof BREAKPOINT_KEYS[number]

/**
 * Custom breakpoint configuration options
 */
export interface UseBreakpointOptions {
  /**
   * Custom breakpoint configuration
   * If not provided, uses Tailwind CSS defaults
   */
  breakpoints?: Partial<BreakpointConfig>
  
  /**
   * Resize debounce delay in milliseconds
   * Default: 16ms (60fps)
   */
  debounceMs?: number
  
  /**
   * Whether to consider orientation in breakpoint calculations
   * Default: false
   */
  orientationAware?: boolean
  
  /**
   * Initial width for SSR (server-side rendering)
   * Default: 1024 (desktop assumption)
   */
  ssrWidth?: number
  
  /**
   * Initial height for SSR (server-side rendering)
   * Default: 768
   */
  ssrHeight?: number
}

/**
 * Enhanced breakpoint detection composable
 */
export function useBreakpoint(options: UseBreakpointOptions = {}) {
  const {
    breakpoints: customBreakpoints = {},
    debounceMs = 16,
    orientationAware = false,
    ssrWidth = 1024,
    ssrHeight = 768
  } = options

  // Merge custom breakpoints with defaults
  const breakpoints: BreakpointConfig = {
    ...DEFAULT_BREAKPOINTS,
    ...customBreakpoints
  }

  // Current viewport dimensions
  const width = ref(ssrWidth)
  const height = ref(ssrHeight)
  
  // Debounced resize timer
  let resizeTimer: number | undefined

  // Reactive breakpoint state
  const state = reactive<BreakpointState>({
    current: 'lg', // Default to desktop for SSR
    matches: {
      xs: false,
      sm: false,
      md: false,
      lg: true, // Default to desktop for SSR
      xl: false,
      '2xl': false
    },
    width: ssrWidth,
    height: ssrHeight
  })

  /**
   * Get the current breakpoint based on width
   */
  function getCurrentBreakpoint(currentWidth: number): BreakpointKey {
    for (let i = BREAKPOINT_KEYS.length - 1; i >= 0; i--) {
      const key = BREAKPOINT_KEYS[i]
      if (currentWidth >= breakpoints[key]) {
        return key
      }
    }
    return 'xs' // Fallback to smallest
  }

  /**
   * Update breakpoint matches based on current width
   */
  function updateBreakpointMatches(currentWidth: number) {
    const matches: Record<BreakpointKey, boolean> = {
      xs: currentWidth >= breakpoints.xs,
      sm: currentWidth >= breakpoints.sm,
      md: currentWidth >= breakpoints.md,
      lg: currentWidth >= breakpoints.lg,
      xl: currentWidth >= breakpoints.xl,
      '2xl': currentWidth >= breakpoints['2xl']
    }

    const current = getCurrentBreakpoint(currentWidth)

    // Only update if something changed to minimize reactivity
    if (state.current !== current || 
        state.width !== currentWidth || 
        Object.keys(matches).some(key => state.matches[key as BreakpointKey] !== matches[key as BreakpointKey])) {
      
      state.current = current
      state.matches = matches
      state.width = currentWidth
      state.height = height.value
    }
  }

  /**
   * Handle viewport resize with debouncing
   */
  function handleResize() {
    if (typeof window === 'undefined') return

    // Clear previous timer
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }

    // Debounce resize updates
    resizeTimer = window.setTimeout(() => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      width.value = newWidth
      height.value = newHeight
      
      updateBreakpointMatches(orientationAware ? Math.min(newWidth, newHeight) : newWidth)
    }, debounceMs)
  }

  /**
   * Handle orientation change
   */
  function handleOrientationChange() {
    // Small delay to let the browser update dimensions
    setTimeout(handleResize, 100)
  }

  // Computed breakpoint utilities
  
  /**
   * Current breakpoint name
   */
  const current = computed(() => state.current)

  /**
   * Current width and height
   */
  const viewport = computed(() => ({
    width: state.width,
    height: state.height
  }))

  /**
   * Check if current breakpoint matches or is above a given breakpoint
   * Mobile-first approach: sm includes md, lg, xl, 2xl
   */
  const up = computed(() => ({
    xs: state.matches.xs,
    sm: state.matches.sm,
    md: state.matches.md,
    lg: state.matches.lg,
    xl: state.matches.xl,
    '2xl': state.matches['2xl']
  }))

  /**
   * Check if current breakpoint is below a given breakpoint
   * Desktop-first approach: lg excludes xl, 2xl
   */
  const down = computed(() => ({
    xs: !state.matches.sm,
    sm: !state.matches.md,
    md: !state.matches.lg,
    lg: !state.matches.xl,
    xl: !state.matches['2xl'],
    '2xl': false // 2xl has no upper bound
  }))

  /**
   * Check if current breakpoint matches exactly one breakpoint
   */
  const only = computed(() => {
    const currentWidth = state.width
    return {
      xs: currentWidth >= breakpoints.xs && currentWidth < breakpoints.sm,
      sm: currentWidth >= breakpoints.sm && currentWidth < breakpoints.md,
      md: currentWidth >= breakpoints.md && currentWidth < breakpoints.lg,
      lg: currentWidth >= breakpoints.lg && currentWidth < breakpoints.xl,
      xl: currentWidth >= breakpoints.xl && currentWidth < breakpoints['2xl'],
      '2xl': currentWidth >= breakpoints['2xl']
    }
  })

  /**
   * Common device type checks
   */
  const isMobile = computed(() => state.current === 'xs' || state.current === 'sm')
  const isTablet = computed(() => state.current === 'md')
  const isDesktop = computed(() => state.current === 'lg' || state.current === 'xl' || state.current === '2xl')
  const isSmallScreen = computed(() => !state.matches.md)
  const isLargeScreen = computed(() => state.matches.lg)

  /**
   * Orientation checks
   */
  const isLandscape = computed(() => state.width > state.height)
  const isPortrait = computed(() => state.height >= state.width)

  /**
   * Aspect ratio
   */
  const aspectRatio = computed(() => state.width / state.height)

  /**
   * Check if between two breakpoints (inclusive)
   */
  function between(min: BreakpointKey, max: BreakpointKey): boolean {
    const currentWidth = state.width
    return currentWidth >= breakpoints[min] && currentWidth < breakpoints[max]
  }

  /**
   * Check if greater than or equal to a breakpoint
   */
  function greaterOrEqual(breakpoint: BreakpointKey): boolean {
    return state.width >= breakpoints[breakpoint]
  }

  /**
   * Check if less than a breakpoint
   */
  function lessThan(breakpoint: BreakpointKey): boolean {
    return state.width < breakpoints[breakpoint]
  }

  /**
   * Get the actual pixel value for a breakpoint
   */
  function getBreakpointValue(breakpoint: BreakpointKey): number {
    return breakpoints[breakpoint]
  }

  /**
   * Check if a custom width matches a breakpoint condition
   */
  function matchesBreakpoint(targetWidth: number, breakpoint: BreakpointKey, condition: 'up' | 'down' | 'only' = 'up'): boolean {
    switch (condition) {
      case 'up':
        return targetWidth >= breakpoints[breakpoint]
      case 'down':
        const nextBreakpoint = BREAKPOINT_KEYS[BREAKPOINT_KEYS.indexOf(breakpoint) + 1]
        return nextBreakpoint ? targetWidth < breakpoints[nextBreakpoint] : true
      case 'only':
        const nextOnly = BREAKPOINT_KEYS[BREAKPOINT_KEYS.indexOf(breakpoint) + 1]
        return targetWidth >= breakpoints[breakpoint] && 
               (nextOnly ? targetWidth < breakpoints[nextOnly] : true)
      default:
        return false
    }
  }

  /**
   * Force an update of breakpoint detection
   */
  function refresh() {
    if (typeof window !== 'undefined') {
      width.value = window.innerWidth
      height.value = window.innerHeight
      updateBreakpointMatches(orientationAware ? Math.min(width.value, height.value) : width.value)
    }
  }

  // Lifecycle management
  onMounted(() => {
    if (typeof window !== 'undefined') {
      // Initial measurement
      width.value = window.innerWidth
      height.value = window.innerHeight
      updateBreakpointMatches(orientationAware ? Math.min(width.value, height.value) : width.value)

      // Set up event listeners
      window.addEventListener('resize', handleResize, { passive: true })
      window.addEventListener('orientationchange', handleOrientationChange, { passive: true })
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
    
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
  })

  return {
    // Current state (readonly to prevent external mutations)
    current,
    viewport,
    state: readonly(state),
    
    // Breakpoint utilities
    up,
    down,
    only,
    
    // Device type checks
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    
    // Orientation
    isLandscape,
    isPortrait,
    aspectRatio,
    
    // Utility functions
    between,
    greaterOrEqual,
    lessThan,
    getBreakpointValue,
    matchesBreakpoint,
    refresh,
    
    // Raw values for advanced usage
    width: readonly(width),
    height: readonly(height),
    breakpoints: readonly(breakpoints),
    
    // Compatibility with existing useResponsive
    windowWidth: width,
    windowHeight: height,
    updateDimensions: refresh
  }
}

/**
 * Factory function for creating breakpoint composables with custom configurations
 * Useful for creating specialized breakpoint detectors
 */
export function createBreakpointComposable(options: UseBreakpointOptions) {
  return () => useBreakpoint(options)
}

/**
 * Pre-configured composables for common use cases
 */

/**
 * Mobile-focused breakpoint composable with smaller breakpoints
 */
export const useMobileBreakpoint = createBreakpointComposable({
  breakpoints: {
    xs: 320,
    sm: 375,
    md: 414,  // Larger phones
    lg: 768,  // Tablets
    xl: 1024, // Desktop
    '2xl': 1280
  },
  orientationAware: true
})

/**
 * Desktop-focused breakpoint composable with larger breakpoints
 */
export const useDesktopBreakpoint = createBreakpointComposable({
  breakpoints: {
    xs: 768,
    sm: 1024,
    md: 1280,
    lg: 1440,
    xl: 1920,
    '2xl': 2560
  }
})

/**
 * TV/Large screen breakpoint composable
 */
export const useTVBreakpoint = createBreakpointComposable({
  breakpoints: {
    xs: 1280,
    sm: 1440,
    md: 1920,
    lg: 2560,
    xl: 3440,
    '2xl': 4096
  }
})