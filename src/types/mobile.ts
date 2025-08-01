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