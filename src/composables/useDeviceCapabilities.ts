import { computed, onMounted, onUnmounted, reactive, readonly } from 'vue'
import type {
  DeviceCapabilities,
  TouchCapabilities,
  HoverCapabilities,
  PlatformInfo,
  NetworkInfo,
  OrientationInfo,
  AccessibilityPreferences,
  HardwareInfo,
  VisualViewportInfo,
  SafeAreaInfo,
  BatteryInfo,
  DeviceType
} from '@/types/mobile'

/**
 * Comprehensive device capabilities detection composable
 * Provides deep insight into device capabilities, input methods, and user preferences
 * 
 * Features:
 * - Touch vs hover detection with hybrid device support
 * - Platform and browser identification
 * - Network status and quality monitoring
 * - Accessibility preference detection
 * - Hardware capability assessment
 * - Visual viewport tracking
 * - Safe area detection
 * - Battery status (when available)
 * - SSR-safe with performance optimizations
 */
export function useDeviceCapabilities() {
  // Reactive state for all capabilities
  const capabilities = reactive<DeviceCapabilities>({
    deviceType: 'unknown',
    isHybrid: false,
    touch: {
      hasTouch: false,
      isPrimary: false,
      isSecondary: false,
      maxTouchPoints: 0,
      touchType: 'none'
    },
    hover: {
      canHover: false,
      isPrecise: false,
      hasCoarsePointer: false
    },
    platform: {
      os: 'unknown',
      browser: 'unknown',
      engine: 'unknown',
      isWebView: false,
      isPWA: false,
      version: 'unknown'
    },
    network: {
      isOnline: true,
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false
    },
    orientation: {
      current: 'unknown',
      angle: 0,
      isLocked: false,
      canLock: false
    },
    accessibility: {
      prefersReducedMotion: false,
      prefersHighContrast: false,
      prefersColorScheme: 'no-preference',
      prefersReducedTransparency: false,
      forcedColors: 'none'
    },
    hardware: {
      deviceMemory: 4,
      hardwareConcurrency: 4,
      devicePixelRatio: 1,
      colorDepth: 24,
      colorGamut: 'srgb'
    },
    visualViewport: {
      width: 0,
      height: 0,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      isKeyboardVisible: false
    },
    safeArea: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    battery: null,
    viewport: {
      width: 0,
      height: 0,
      availableWidth: 0,
      availableHeight: 0
    }
  })

  // Event listeners for cleanup
  const listeners: Array<() => void> = []

  /**
   * Detect touch capabilities with sophisticated analysis
   */
  function detectTouchCapabilities(): TouchCapabilities {
    if (typeof window === 'undefined') {
      return { hasTouch: false, isPrimary: false, isSecondary: false, maxTouchPoints: 0, touchType: 'none' }
    }

    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const maxTouchPoints = navigator.maxTouchPoints || 0
    
    // Detect if touch is primary input method
    const isPrimary = hasTouch && (
      window.matchMedia('(pointer: coarse)').matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    )
    
    const isSecondary = hasTouch && !isPrimary

    // Detect touch type
    let touchType: TouchCapabilities['touchType'] = 'none'
    if (hasTouch) {
      if (maxTouchPoints === 1) {
        touchType = 'stylus'
      } else if (maxTouchPoints > 1) {
        touchType = 'direct'
      } else {
        touchType = 'unknown'
      }
    }

    return {
      hasTouch,
      isPrimary,
      isSecondary,
      maxTouchPoints,
      touchType
    }
  }

  /**
   * Detect hover capabilities with precision detection
   */
  function detectHoverCapabilities(): HoverCapabilities {
    if (typeof window === 'undefined') {
      return { canHover: false, isPrecise: false, hasCoarsePointer: false }
    }

    const canHover = window.matchMedia('(hover: hover)').matches
    const isPrecise = window.matchMedia('(pointer: fine)').matches
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches

    return {
      canHover,
      isPrecise,
      hasCoarsePointer
    }
  }

  /**
   * Comprehensive platform and browser detection
   */
  function detectPlatformInfo(): PlatformInfo {
    if (typeof window === 'undefined') {
      return {
        os: 'unknown',
        browser: 'unknown',
        engine: 'unknown',
        isWebView: false,
        isPWA: false,
        version: 'unknown'
      }
    }

    const userAgent = navigator.userAgent
    // Handle deprecated vendor property with fallback
    const vendor = (navigator as any).vendor || ''

    // OS detection
    let os: PlatformInfo['os'] = 'unknown'
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      os = 'ios'
    } else if (/Android/.test(userAgent)) {
      os = 'android'
    } else if (/Mac/.test(userAgent)) {
      os = 'macos'
    } else if (/Win/.test(userAgent)) {
      os = 'windows'
    } else if (/Linux/.test(userAgent)) {
      os = 'linux'
    }

    // Browser detection
    let browser: PlatformInfo['browser'] = 'unknown'
    let engine: PlatformInfo['engine'] = 'unknown'
    
    if (/Safari/.test(userAgent) && /Apple/.test(vendor)) {
      browser = 'safari'
      engine = 'webkit'
    } else if (/Chrome/.test(userAgent) && /Google/.test(vendor)) {
      browser = 'chrome'
      engine = 'blink'
    } else if (/Firefox/.test(userAgent)) {
      browser = 'firefox'
      engine = 'gecko'
    } else if (/Edg/.test(userAgent)) {
      browser = 'edge'
      engine = 'blink'
    }

    // WebView detection
    const isWebView = (
      (os === 'android' && /wv/.test(userAgent)) ||
      (os === 'ios' && !(/Safari/.test(userAgent) && /Version/.test(userAgent)))
    )

    // PWA detection
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.matchMedia('(display-mode: fullscreen)').matches ||
                  (window.navigator as any).standalone === true

    // Version extraction (simplified)
    let version = 'unknown'
    const versionMatch = userAgent.match(/(Chrome|Safari|Firefox|Edg)\/(\d+\.\d+)/)
    if (versionMatch) {
      version = versionMatch[2]
    }

    return {
      os,
      browser,
      engine,
      isWebView,
      isPWA,
      version
    }
  }

  /**
   * Network status detection with connection quality
   */
  function detectNetworkInfo(): NetworkInfo {
    if (typeof window === 'undefined') {
      return {
        isOnline: true,
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
        saveData: false
      }
    }

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    return {
      isOnline: navigator.onLine,
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false
    }
  }

  /**
   * Device orientation detection
   */
  function detectOrientationInfo(): OrientationInfo {
    if (typeof window === 'undefined' || !window.screen?.orientation) {
      return {
        current: 'unknown',
        angle: 0,
        isLocked: false,
        canLock: false
      }
    }

    const orientation = window.screen.orientation

    return {
      current: orientation.type as OrientationInfo['current'],
      angle: orientation.angle,
      isLocked: false, // Cannot detect if locked
      canLock: 'lock' in orientation
    }
  }

  /**
   * Accessibility preferences detection
   */
  function detectAccessibilityPreferences(): AccessibilityPreferences {
    if (typeof window === 'undefined') {
      return {
        prefersReducedMotion: false,
        prefersHighContrast: false,
        prefersColorScheme: 'no-preference',
        prefersReducedTransparency: false,
        forcedColors: 'none'
      }
    }

    return {
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' :
                         window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'no-preference',
      prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
      forcedColors: window.matchMedia('(forced-colors: active)').matches ? 'active' : 'none'
    }
  }

  /**
   * Hardware capabilities detection
   */
  function detectHardwareInfo(): HardwareInfo {
    if (typeof window === 'undefined') {
      return {
        deviceMemory: 4,
        hardwareConcurrency: 4,
        devicePixelRatio: 1,
        colorDepth: 24,
        colorGamut: 'srgb'
      }
    }

    // Color gamut detection
    let colorGamut: HardwareInfo['colorGamut'] = 'srgb'
    if (window.matchMedia('(color-gamut: rec2020)').matches) {
      colorGamut = 'rec2020'
    } else if (window.matchMedia('(color-gamut: p3)').matches) {
      colorGamut = 'p3'
    }

    return {
      deviceMemory: (navigator as any).deviceMemory || 4,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      devicePixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen?.colorDepth || 24,
      colorGamut
    }
  }

  /**
   * Visual viewport information
   */
  function detectVisualViewportInfo(): VisualViewportInfo {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: 0,
        pageTop: 0,
        scale: 1,
        isKeyboardVisible: false
      }
    }

    const visualViewport = window.visualViewport
    const windowHeight = window.innerHeight
    const viewportHeight = visualViewport?.height || windowHeight

    return {
      width: visualViewport?.width || window.innerWidth,
      height: viewportHeight,
      offsetLeft: visualViewport?.offsetLeft || 0,
      offsetTop: visualViewport?.offsetTop || 0,
      pageLeft: visualViewport?.pageLeft || 0,
      pageTop: visualViewport?.pageTop || 0,
      scale: visualViewport?.scale || 1,
      // Keyboard is likely visible if viewport height is significantly smaller than window height
      isKeyboardVisible: viewportHeight < windowHeight * 0.75
    }
  }

  /**
   * Safe area detection using CSS environment variables
   */
  function detectSafeAreaInfo(): SafeAreaInfo {
    if (typeof window === 'undefined') {
      return { top: 0, right: 0, bottom: 0, left: 0 }
    }

    // Create a temporary element to measure safe area values
    const testElement = document.createElement('div')
    testElement.style.position = 'fixed'
    testElement.style.top = '0'
    testElement.style.left = '0'
    testElement.style.visibility = 'hidden'
    testElement.style.pointerEvents = 'none'
    
    // Apply safe area padding
    testElement.style.paddingTop = 'env(safe-area-inset-top, 0px)'
    testElement.style.paddingRight = 'env(safe-area-inset-right, 0px)'
    testElement.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)'
    testElement.style.paddingLeft = 'env(safe-area-inset-left, 0px)'
    
    document.body.appendChild(testElement)
    
    const computedStyle = window.getComputedStyle(testElement)
    const safeArea = {
      top: parseInt(computedStyle.paddingTop, 10) || 0,
      right: parseInt(computedStyle.paddingRight, 10) || 0,
      bottom: parseInt(computedStyle.paddingBottom, 10) || 0,
      left: parseInt(computedStyle.paddingLeft, 10) || 0
    }
    
    document.body.removeChild(testElement)
    
    return safeArea
  }

  /**
   * Battery status detection (when available)
   */
  async function detectBatteryInfo(): Promise<BatteryInfo | null> {
    if (typeof window === 'undefined' || !('getBattery' in navigator)) {
      return null
    }

    try {
      const battery = await (navigator as any).getBattery()
      return {
        isCharging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        isSupported: true
      }
    } catch {
      return null
    }
  }

  /**
   * Viewport dimensions detection
   */
  function detectViewportInfo() {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        availableWidth: 0,
        availableHeight: 0
      }
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      availableWidth: window.screen?.availWidth || window.innerWidth,
      availableHeight: window.screen?.availHeight || window.innerHeight
    }
  }

  /**
   * Classify device type based on all available information
   */
  function classifyDeviceType(
    touch: TouchCapabilities,
    hover: HoverCapabilities,
    platform: PlatformInfo,
    viewport: { width: number; height: number }
  ): DeviceType {
    const { width } = viewport
    const { hasTouch, isPrimary: touchIsPrimary } = touch
    const { canHover, isPrecise } = hover
    const { os } = platform

    // TV detection
    if (width > 1920 && !hasTouch) {
      return 'tv'
    }

    // Mobile phone
    if (touchIsPrimary && width < 768 && (os === 'ios' || os === 'android')) {
      return 'mobile-phone'
    }

    // Hybrid devices (iPad with keyboard, Surface, etc.)
    if (hasTouch && canHover && isPrecise) {
      if (width >= 768 && width < 1024) {
        return 'hybrid-tablet'
      } else if (width >= 1024) {
        return 'hybrid-laptop'
      }
    }

    // Mobile tablet (touch-primary, larger screen)
    if (touchIsPrimary && width >= 768 && width < 1024) {
      return 'mobile-tablet'
    }

    // Desktop classification
    if (!touchIsPrimary && canHover && isPrecise) {
      if (width >= 1024 && width < 1920) {
        return 'desktop-laptop'
      } else if (width >= 1920) {
        return 'desktop-monitor'
      }
    }

    return 'unknown'
  }

  /**
   * Update all capabilities
   */
  function updateCapabilities() {
    const touch = detectTouchCapabilities()
    const hover = detectHoverCapabilities()
    const platform = detectPlatformInfo()
    const network = detectNetworkInfo()
    const orientation = detectOrientationInfo()
    const accessibility = detectAccessibilityPreferences()
    const hardware = detectHardwareInfo()
    const visualViewport = detectVisualViewportInfo()
    const safeArea = detectSafeAreaInfo()
    const viewport = detectViewportInfo()

    const deviceType = classifyDeviceType(touch, hover, platform, viewport)
    const isHybrid = touch.hasTouch && hover.canHover && hover.isPrecise

    Object.assign(capabilities, {
      deviceType,
      isHybrid,
      touch,
      hover,
      platform,
      network,
      orientation,
      accessibility,
      hardware,
      visualViewport,
      safeArea,
      viewport
    })
  }

  /**
   * Set up event listeners for dynamic updates
   */
  function setupEventListeners() {
    if (typeof window === 'undefined') return

    // Viewport changes
    const handleResize = () => {
      capabilities.viewport = detectViewportInfo()
      capabilities.visualViewport = detectVisualViewportInfo()
      capabilities.deviceType = classifyDeviceType(
        capabilities.touch,
        capabilities.hover,
        capabilities.platform,
        capabilities.viewport
      )
    }

    // Network changes
    const handleOnlineChange = () => {
      capabilities.network = detectNetworkInfo()
    }

    // Orientation changes  
    const handleOrientationChange = () => {
      capabilities.orientation = detectOrientationInfo()
    }

    // Visual viewport changes (keyboard show/hide)
    const handleVisualViewportChange = () => {
      capabilities.visualViewport = detectVisualViewportInfo()
    }

    // Media query changes for accessibility
    const setupMediaQueryListeners = () => {
      const mediaQueries = [
        '(prefers-reduced-motion: reduce)',
        '(prefers-contrast: high)',
        '(prefers-color-scheme: dark)',
        '(prefers-color-scheme: light)',
        '(prefers-reduced-transparency: reduce)',
        '(forced-colors: active)'
      ]

      mediaQueries.forEach(query => {
        const mql = window.matchMedia(query)
        const handler = () => {
          capabilities.accessibility = detectAccessibilityPreferences()
        }
        mql.addEventListener('change', handler)
        listeners.push(() => mql.removeEventListener('change', handler))
      })
    }

    // Attach listeners
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })
    window.addEventListener('online', handleOnlineChange, { passive: true })
    window.addEventListener('offline', handleOnlineChange, { passive: true })

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange, { passive: true })
      window.visualViewport.addEventListener('scroll', handleVisualViewportChange, { passive: true })
    }

    setupMediaQueryListeners()

    // Store cleanup functions
    listeners.push(
      () => window.removeEventListener('resize', handleResize),
      () => window.removeEventListener('orientationchange', handleOrientationChange),
      () => window.removeEventListener('online', handleOnlineChange),
      () => window.removeEventListener('offline', handleOnlineChange)
    )

    if (window.visualViewport) {
      listeners.push(
        () => window.visualViewport!.removeEventListener('resize', handleVisualViewportChange),
        () => window.visualViewport!.removeEventListener('scroll', handleVisualViewportChange)
      )
    }
  }

  // Computed properties for common use cases
  const isMobile = computed(() => 
    capabilities.deviceType === 'mobile-phone' || capabilities.deviceType === 'mobile-tablet'
  )

  const isDesktop = computed(() => 
    capabilities.deviceType === 'desktop-laptop' || capabilities.deviceType === 'desktop-monitor'
  )

  const isTablet = computed(() => 
    capabilities.deviceType === 'mobile-tablet' || capabilities.deviceType === 'hybrid-tablet'
  )

  const isHybridDevice = computed(() => capabilities.isHybrid)

  const isTouchPrimary = computed(() => capabilities.touch.isPrimary)

  const canHover = computed(() => capabilities.hover.canHover)

  const supportsTouch = computed(() => capabilities.touch.hasTouch)

  const isLowEndDevice = computed(() => 
    capabilities.hardware.deviceMemory <= 2 || capabilities.hardware.hardwareConcurrency <= 2
  )

  const hasSlowConnection = computed(() => 
    capabilities.network.effectiveType === '2g' || capabilities.network.effectiveType === 'slow-2g'
  )

  const prefersReducedMotion = computed(() => capabilities.accessibility.prefersReducedMotion)

  const isDarkMode = computed(() => capabilities.accessibility.prefersColorScheme === 'dark')

  const isKeyboardVisible = computed(() => capabilities.visualViewport.isKeyboardVisible)

  // Lifecycle
  onMounted(async () => {
    updateCapabilities()
    setupEventListeners()

    // Detect battery info asynchronously
    try {
      capabilities.battery = await detectBatteryInfo()
    } catch {
      capabilities.battery = null
    }
  })

  onUnmounted(() => {
    listeners.forEach(cleanup => cleanup())
    listeners.length = 0
  })

  return {
    // Raw capabilities object (readonly to prevent external mutations)
    capabilities: readonly(capabilities),
    
    // Convenient computed properties
    isMobile,
    isDesktop,
    isTablet,
    isHybridDevice,
    isTouchPrimary,
    canHover,
    supportsTouch,
    isLowEndDevice,
    hasSlowConnection,
    prefersReducedMotion,
    isDarkMode,
    isKeyboardVisible,
    
    // Manual refresh function
    refresh: updateCapabilities
  }
}