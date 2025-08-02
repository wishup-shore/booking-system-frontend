import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    // Mobile-first breakpoints
    screens: {
      'xs': '320px',   // Extra small devices (small phones)
      'sm': '375px',   // Small devices (phones)
      'md': '768px',   // Medium devices (tablets)
      'lg': '1024px',  // Large devices (laptops)
      'xl': '1280px',  // Extra large devices
      '2xl': '1536px', // 2X large devices
    },
    extend: {
      colors: {
        // Professional Color System - Healthcare/Aviation-Inspired
        // Using CSS custom properties for adaptive interface modes
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: 'var(--color-primary, #1e40af)', // Reliable blue - Trust and competence
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e2a5a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0', 
          300: '#6ee7b7',
          400: '#34d399',
          500: 'var(--color-success, #059669)', // Clear green - Confirmed actions
          600: '#047857',
          700: '#059669',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d', 
          400: '#fbbf24',
          500: 'var(--color-warning, #d97706)', // Attention amber - Requires attention
          600: '#b45309',
          700: '#d97706',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171', 
          500: 'var(--color-error, #dc2626)', // Clear red - Immediate action required
          600: '#b91c1c',
          700: '#dc2626',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        neutral: {
          50: 'var(--color-neutral-50, #f8fafc)', // Calm gray - Reduced eye strain
          100: 'var(--color-neutral-100, #f1f5f9)',
          200: 'var(--color-neutral-200, #e2e8f0)',
          300: 'var(--color-neutral-300, #cbd5e1)',
          400: 'var(--color-neutral-400, #94a3b8)',
          500: 'var(--color-neutral-500, #64748b)',
          600: 'var(--color-neutral-600, #475569)',
          700: 'var(--color-neutral-700, #334155)',
          800: 'var(--color-neutral-800, #1e293b)',
          900: 'var(--color-neutral-900, #0f172a)',
        },
        // Professional interface colors
        professional: {
          bg: 'var(--color-professional-bg, #f8fafc)',
          surface: 'var(--color-professional-surface, #ffffff)',
          border: 'var(--color-professional-border, #e2e8f0)',
          text: 'var(--color-professional-text, #1e293b)',
          'text-secondary': 'var(--color-professional-text-secondary, #64748b)',
          focus: 'var(--color-professional-focus, #1e40af)',
        },
        // Adaptive mode colors
        adaptive: {
          quiet: 'var(--color-adaptive-quiet, #f8fafc)',
          rush: 'var(--color-adaptive-rush, #fef3c7)',
          crisis: 'var(--color-adaptive-crisis, #fee2e2)',
        }
      },
      // Professional spacing system with stress-responsive sizing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        // Professional touch targets - stress condition optimized
        'touch': 'var(--spacing-touch, 44px)', // Minimum professional touch target
        'touch-lg': 'var(--spacing-touch-lg, 48px)', // Enhanced for gloved hands
        'touch-xl': 'var(--spacing-touch-xl, 56px)', // Crisis mode sizing
        // Professional spacing scale
        'professional-xs': 'var(--spacing-professional-xs, 0.5rem)', // 8px
        'professional-sm': 'var(--spacing-professional-sm, 0.75rem)', // 12px
        'professional-base': 'var(--spacing-professional-base, 1rem)', // 16px
        'professional-lg': 'var(--spacing-professional-lg, 1.5rem)', // 24px
        'professional-xl': 'var(--spacing-professional-xl, 2rem)', // 32px
        'professional-2xl': 'var(--spacing-professional-2xl, 3rem)', // 48px
        // Legacy mobile spacing
        '18': '4.5rem',  // 72px - Common mobile spacing
        '22': '5.5rem',  // 88px - Large mobile spacing
      },
      // Professional typography system - stress-responsive sizing
      fontSize: {
        // Professional mobile typography - 16px+ base for professional standards
        'professional-xs': ['var(--font-size-professional-xs, 14px)', { 
          lineHeight: 'var(--line-height-professional-xs, 1.43)', // ~20px
          letterSpacing: '0.01em'
        }],
        'professional-sm': ['var(--font-size-professional-sm, 15px)', { 
          lineHeight: 'var(--line-height-professional-sm, 1.47)', // ~22px
          letterSpacing: '0.01em'
        }],
        'professional-base': ['var(--font-size-professional-base, 16px)', { 
          lineHeight: 'var(--line-height-professional-base, 1.5)', // 24px - optimal for long shifts
          letterSpacing: '0.005em'
        }],
        'professional-lg': ['var(--font-size-professional-lg, 18px)', { 
          lineHeight: 'var(--line-height-professional-lg, 1.56)', // ~28px
          letterSpacing: '0.005em'
        }],
        'professional-xl': ['var(--font-size-professional-xl, 20px)', { 
          lineHeight: 'var(--line-height-professional-xl, 1.4)', // 28px
          letterSpacing: '0'
        }],
        'professional-2xl': ['var(--font-size-professional-2xl, 24px)', { 
          lineHeight: 'var(--line-height-professional-2xl, 1.33)', // 32px
          letterSpacing: '-0.01em'
        }],
        'professional-3xl': ['var(--font-size-professional-3xl, 30px)', { 
          lineHeight: 'var(--line-height-professional-3xl, 1.2)', // 36px
          letterSpacing: '-0.02em'
        }],
        // Legacy mobile font sizes (deprecated)
        'xs-mobile': ['12px', { lineHeight: '16px' }],
        'sm-mobile': ['14px', { lineHeight: '20px' }],
        'base-mobile': ['16px', { lineHeight: '24px' }],
        'lg-mobile': ['18px', { lineHeight: '28px' }],
        'xl-mobile': ['20px', { lineHeight: '28px' }],
        '2xl-mobile': ['24px', { lineHeight: '32px' }],
      },
      // Professional font weights
      fontWeight: {
        'professional-light': 'var(--font-weight-professional-light, 300)',
        'professional-normal': 'var(--font-weight-professional-normal, 400)',
        'professional-medium': 'var(--font-weight-professional-medium, 500)',
        'professional-semibold': 'var(--font-weight-professional-semibold, 600)',
        'professional-bold': 'var(--font-weight-professional-bold, 700)',
      },
      // Mobile-first animations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.4s ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tap-feedback': 'tapFeedback 0.1s ease-in-out',
      },
      // Custom keyframes for mobile interactions
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        tapFeedback: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      // Mobile-optimized shadows
      boxShadow: {
        'mobile': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'mobile-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'mobile-bottom': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'mobile-card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      },
      // Mobile-specific border radius
      borderRadius: {
        'mobile': '12px',
        'mobile-lg': '16px',
        'mobile-xl': '20px',
      },
      // Mobile container sizes
      maxWidth: {
        'mobile': '375px',
        'mobile-lg': '414px',
      },
      // Z-index scale for mobile layers
      zIndex: {
        'modal': '1000',
        'drawer': '900',
        'dropdown': '800',
        'sticky': '700',
        'header': '600',
        'overlay': '500',
      },
    },
  },
  plugins: [
    forms,
    // Custom plugin for mobile-specific utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Safe area utilities
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.pl-safe': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.pr-safe': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.p-safe': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        },
        // Professional touch target utilities - stress condition optimized
        '.touch-target': {
          minHeight: 'var(--spacing-touch, 44px)',
          minWidth: 'var(--spacing-touch, 44px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        },
        '.touch-target-lg': {
          minHeight: 'var(--spacing-touch-lg, 48px)',
          minWidth: 'var(--spacing-touch-lg, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        },
        '.touch-target-xl': {
          minHeight: 'var(--spacing-touch-xl, 56px)',
          minWidth: 'var(--spacing-touch-xl, 56px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        },
        // Professional button patterns
        '.btn-professional': {
          minHeight: 'var(--spacing-touch, 44px)',
          paddingLeft: 'var(--spacing-professional-lg, 1.5rem)',
          paddingRight: 'var(--spacing-professional-lg, 1.5rem)',
          borderRadius: '8px',
          fontSize: 'var(--font-size-professional-base, 16px)',
          fontWeight: 'var(--font-weight-professional-medium, 500)',
          lineHeight: 'var(--line-height-professional-base, 1.5)',
          transition: 'all 0.15s ease-in-out',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        },
        // Mobile-first layout utilities
        '.mobile-container': {
          width: '100%',
          maxWidth: '375px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
        '.mobile-container-lg': {
          width: '100%',
          maxWidth: '414px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
        // Mobile scrolling utilities
        '.scroll-smooth-mobile': {
          scrollBehavior: 'smooth',
          '-webkit-overflow-scrolling': 'touch',
        },
        // Mobile tap highlights
        '.tap-highlight-none': {
          '-webkit-tap-highlight-color': 'transparent',
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          'user-select': 'none',
        },
        // Mobile backdrop blur
        '.backdrop-blur-mobile': {
          backdropFilter: 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
        },
        // Mobile sticky positioning
        '.sticky-mobile': {
          position: 'sticky',
          top: 'env(safe-area-inset-top)',
        },
        // Mobile bottom navigation
        '.bottom-nav': {
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: theme('zIndex.header'),
        },
        // Mobile overlay utilities
        '.overlay-mobile': {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: theme('zIndex.overlay'),
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}