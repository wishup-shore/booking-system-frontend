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
        // Primary colors from design plan
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Primary Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a', // Secondary Navy
          900: '#1e3a8a',
        },
        // Status colors from design plan
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#059669', // Success Green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d97706', // Warning Amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626', // Error Red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      // Mobile-specific spacing utilities
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'touch': '44px', // Minimum touch target size (iOS Human Interface Guidelines)
        '18': '4.5rem',  // 72px - Common mobile spacing
        '22': '5.5rem',  // 88px - Large mobile spacing
      },
      // Mobile-optimized font sizes
      fontSize: {
        'xs-mobile': ['12px', { lineHeight: '16px' }],
        'sm-mobile': ['14px', { lineHeight: '20px' }],
        'base-mobile': ['16px', { lineHeight: '24px' }],
        'lg-mobile': ['18px', { lineHeight: '28px' }],
        'xl-mobile': ['20px', { lineHeight: '28px' }],
        '2xl-mobile': ['24px', { lineHeight: '32px' }],
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
        // Touch target utilities
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },
        '.touch-target-lg': {
          minHeight: '48px',
          minWidth: '48px',
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