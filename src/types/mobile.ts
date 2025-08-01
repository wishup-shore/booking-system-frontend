/**
 * Mobile layout and responsive design types
 */

export interface MobileBreakpoint {
  xs: boolean
  sm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  '2xl': boolean
}

export interface MobileHeaderProps {
  isVisible?: boolean
  user?: {
    id: number
    username: string
    email: string
  } | null
}

export interface MobileLayoutProps {
  showHeader?: boolean
  enableScrollHiding?: boolean
}

export interface NavigationItem {
  name: string
  route: string
  icon: string
  badge?: number
}

export interface ScrollState {
  isScrollingDown: boolean
  lastScrollY: number
  headerVisible: boolean
}

export interface ViewportInfo {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
}

/**
 * Touch capabilities and support levels
 */
export interface TouchCapabilities {
  hasTouch: boolean
  isPrimary: boolean // Touch is primary input method
  isSecondary: boolean // Touch available but not primary
  maxTouchPoints: number
  touchType: 'none' | 'stylus' | 'direct' | 'unknown'
}

/**
 * Hover capabilities detection
 */
export interface HoverCapabilities {
  canHover: boolean
  isPrecise: boolean // True mouse-like hover vs imprecise touch simulation
  hasCoarsePointer: boolean
}

/**
 * Platform and browser detection
 */
export interface PlatformInfo {
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown'
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'unknown'
  engine: 'webkit' | 'blink' | 'gecko' | 'unknown'
  isWebView: boolean
  isPWA: boolean
  version: string
}

/**
 * Network status and capabilities
 */
export interface NetworkInfo {
  isOnline: boolean
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown'
  downlink: number // Mbps estimate
  rtt: number // Round trip time in ms
  saveData: boolean // Data saver mode
}

/**
 * Device orientation information
 */
export interface OrientationInfo {
  current: 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary' | 'unknown'
  angle: number
  isLocked: boolean
  canLock: boolean
}

/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  prefersReducedMotion: boolean
  prefersHighContrast: boolean
  prefersColorScheme: 'light' | 'dark' | 'no-preference'
  prefersReducedTransparency: boolean
  forcedColors: 'none' | 'active'
}

/**
 * Hardware capabilities
 */
export interface HardwareInfo {
  deviceMemory: number // GB estimate
  hardwareConcurrency: number // CPU cores
  devicePixelRatio: number
  colorDepth: number
  colorGamut: 'srgb' | 'p3' | 'rec2020' | 'unknown'
}

/**
 * Viewport and visual info
 */
export interface VisualViewportInfo {
  width: number
  height: number
  offsetLeft: number
  offsetTop: number
  pageLeft: number
  pageTop: number
  scale: number
  isKeyboardVisible: boolean
}

/**
 * Safe area information
 */
export interface SafeAreaInfo {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Battery status (when available)
 */
export interface BatteryInfo {
  isCharging: boolean
  level: number // 0-1
  chargingTime: number // seconds or Infinity
  dischargingTime: number // seconds or Infinity
  isSupported: boolean
}

/**
 * Breakpoint configuration
 */
export interface BreakpointConfig {
  xs: number // 320px
  sm: number // 375px
  md: number // 768px
  lg: number // 1024px
  xl: number // 1280px
  '2xl': number // 1536px
}

/**
 * Current breakpoint state
 */
export interface BreakpointState {
  current: keyof BreakpointConfig
  matches: Record<keyof BreakpointConfig, boolean>
  width: number
  height: number
}

/**
 * Device type classification
 */
export type DeviceType = 
  | 'mobile-phone'
  | 'mobile-tablet' 
  | 'desktop-laptop'
  | 'desktop-monitor'
  | 'hybrid-tablet' // iPad with keyboard, Surface
  | 'hybrid-laptop' // Touch laptop
  | 'tv'
  | 'unknown'

/**
 * Comprehensive device capabilities
 */
export interface DeviceCapabilities {
  // Device classification
  deviceType: DeviceType
  isHybrid: boolean // Has both touch and precise hover
  
  // Input capabilities
  touch: TouchCapabilities
  hover: HoverCapabilities
  
  // Platform info
  platform: PlatformInfo
  
  // Network info
  network: NetworkInfo
  
  // Orientation
  orientation: OrientationInfo
  
  // Accessibility
  accessibility: AccessibilityPreferences
  
  // Hardware
  hardware: HardwareInfo
  
  // Visual viewport
  visualViewport: VisualViewportInfo
  
  // Safe areas
  safeArea: SafeAreaInfo
  
  // Battery (optional)
  battery: BatteryInfo | null
  
  // Viewport dimensions
  viewport: {
    width: number
    height: number
    availableWidth: number
    availableHeight: number
  }
}