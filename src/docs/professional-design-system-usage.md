# Professional Design System Usage Guide

This guide demonstrates how to use the foundational professional design system for accommodation management software.

## Core Principles

- **Cognitive Relief Through Predictable Excellence**: Every interaction should reduce cognitive load
- **Stress-Responsive Design**: Interface adapts to operational stress levels
- **Professional Mobile Standards**: 44px+ touch targets, 16px+ typography, high contrast
- **Interruption-Resilient**: Tasks can be interrupted and resumed seamlessly

## CSS Classes and Utilities

### Professional Typography

```css
/* Professional typography classes */
.text-professional-xs     /* 14px */
.text-professional-sm     /* 15px */
.text-professional-base   /* 16px - minimum professional baseline */
.text-professional-lg     /* 18px */
.text-professional-xl     /* 20px */
.text-professional-2xl    /* 24px */
.text-professional-3xl    /* 30px */

/* Professional font weights */
.font-professional-light     /* 300 */
.font-professional-normal    /* 400 */
.font-professional-medium    /* 500 */
.font-professional-semibold  /* 600 */
.font-professional-bold      /* 700 */
```

### Professional Touch Targets

```css
/* Stress-optimized touch targets */
.touch-target     /* 44px minimum (quiet mode) */
.touch-target-lg  /* 48px (rush mode) */
.touch-target-xl  /* 56px (crisis mode) */

/* Professional button base */
.btn-professional /* Complete button foundation */
```

### Professional Components

```css
/* Professional card component */
.card-professional

/* Professional form inputs */
.input-professional

/* Professional button variants */
.btn-primary
.btn-secondary  
.btn-success
.btn-warning
.btn-error

/* Professional status indicators */
.status-indicator
.status-success
.status-warning
.status-error
.status-neutral
```

### Professional Layout

```css
/* Professional container with safe areas */
.professional-container

/* Professional header with sticky positioning */
.professional-header

/* Professional footer with safe area */
.professional-footer

/* Professional spacing utilities */
.space-professional-xs    /* 8px */
.space-professional-sm    /* 12px */
.space-professional-base  /* 16px */
.space-professional-lg    /* 24px */
.space-professional-xl    /* 32px */
.space-professional-2xl   /* 48px */
```

### Interruption-Resilient Patterns

```css
/* Context preservation */
.context-preserve

/* Resumable task indicators */
.task-resumable
.task-resumable[data-interrupted="true"] /* Shows dashed border when interrupted */

/* Professional loading states */
.loading-professional

/* Performance indicators */
.performance-indicator
```

## CSS Custom Properties (CSS Variables)

### Adaptive Mode Variables

```css
/* These variables automatically update based on current operational mode */
--spacing-touch              /* Touch target size */
--spacing-touch-lg          /* Enhanced touch target */
--spacing-touch-xl          /* Crisis mode touch target */

--font-size-professional-base  /* Base font size */
--font-size-professional-sm   /* Small font size */
--font-size-professional-lg   /* Large font size */

--timing-critical           /* Critical operation timing */
--timing-navigation        /* Navigation timing */

--color-adaptive-current   /* Current mode background color */
```

### Professional Color System

```css
/* Core professional colors */
--color-primary     /* #1e40af - Reliable blue */
--color-success     /* #059669 - Clear green */
--color-warning     /* #d97706 - Attention amber */
--color-error       /* #dc2626 - Clear red */

/* Professional interface colors */
--color-professional-bg              /* Background */
--color-professional-surface         /* Card/surface background */
--color-professional-border          /* Border color */
--color-professional-text            /* Primary text */
--color-professional-text-secondary  /* Secondary text */
--color-professional-focus          /* Focus indicator */

/* Neutral scale for eye strain reduction */
--color-neutral-50   /* Lightest gray */
--color-neutral-100
--color-neutral-200
/* ... through to ... */
--color-neutral-900  /* Darkest gray */
```

## Vue Composables Usage

### Professional Mode Management

```vue
<script setup>
import { useProfessionalMode } from '@/composables/useProfessionalInterface'

const { 
  currentMode, 
  currentConfig, 
  setMode, 
  enableAutoMode,
  isQuietMode,
  isRushMode,
  isCrisisMode 
} = useProfessionalMode()

// Manually set mode
setMode('rush')

// Enable automatic mode switching based on performance
enableAutoMode()
</script>

<template>
  <div>
    <p>Current mode: {{ currentMode }}</p>
    <p>Touch target size: {{ currentConfig.touchTargetSize }}px</p>
    
    <!-- Mode-specific content -->
    <div v-if="isQuietMode">
      <!-- Full information density -->
    </div>
    <div v-else-if="isRushMode">
      <!-- Streamlined interface -->
    </div>
    <div v-else-if="isCrisisMode">
      <!-- Essential functions only -->
    </div>
  </div>
</template>
```

### Interruption-Resilient Forms

```vue
<script setup>
import { useInterruptionResilientForm } from '@/composables/useProfessionalInterface'

const { 
  formData, 
  isDirty, 
  autoSaveEnabled,
  resetForm, 
  saveProgress,
  setAutoSave 
} = useInterruptionResilientForm('booking-form', {
  guestName: '',
  roomNumber: '',
  checkIn: '',
  checkOut: ''
})

// Form data automatically saves to localStorage when changed
// Automatically restored when component mounts
</script>

<template>
  <form class="space-y-professional-base">
    <input 
      v-model="formData.guestName"
      class="input-professional"
      placeholder="Guest Name"
    >
    
    <div v-if="isDirty" class="text-professional-sm text-professional-text-secondary">
      Changes auto-saved
    </div>
    
    <button @click="resetForm" class="btn-secondary">
      Reset Form
    </button>
  </form>
</template>
```

### Performance Monitoring

```vue
<script setup>
import { usePerformanceMonitoring } from '@/composables/useProfessionalInterface'

const { performanceMetrics, measureOperation, getPerformanceStatus } = usePerformanceMonitoring()

const loadBookings = async () => {
  await measureOperation(
    () => fetch('/api/bookings').then(r => r.json()),
    'data', // threshold type
    'Load Bookings' // operation name for logging
  )
}
</script>

<template>
  <div>
    <div class="status-indicator" :class="{
      'status-success': getPerformanceStatus === 'good',
      'status-warning': getPerformanceStatus === 'fair',
      'status-error': getPerformanceStatus === 'poor'
    }">
      Performance: {{ getPerformanceStatus }}
    </div>
    
    <p class="text-professional-sm">
      Average response: {{ performanceMetrics.averageResponseTime.toFixed(0) }}ms
    </p>
  </div>
</template>
```

### Professional Touch Utilities

```vue
<script setup>
import { useProfessionalTouch } from '@/composables/useProfessionalInterface'

const { getTouchTargetStyle, getProfessionalSpacing } = useProfessionalTouch()
</script>

<template>
  <!-- Automatically sized for current operational mode -->
  <button :style="getTouchTargetStyle('large')" class="btn-primary">
    Large Touch Target
  </button>
  
  <!-- Professional spacing that adapts to mode -->
  <div :style="{ padding: getProfessionalSpacing('lg') }">
    Adaptive spacing content
  </div>
</template>
```

### Task Context Management

```vue
<script setup>
import { useTaskContext } from '@/composables/useProfessionalInterface'

const { 
  context, 
  isInterrupted, 
  saveContext, 
  clearContext, 
  resumeContext 
} = useTaskContext('check-in-process', 'check-in')

const handleCheckIn = () => {
  // Save progress for interruption resilience
  saveContext({
    step: 'guest-verification',
    guestId: '123',
    roomNumber: '201'
  })
}

const handleResume = () => {
  const savedData = resumeContext()
  if (savedData) {
    // Continue from where left off
    console.log('Resuming from step:', savedData.step)
  }
}
</script>

<template>
  <!-- Show interruption indicator -->
  <div v-if="isInterrupted" class="task-resumable" data-interrupted="true">
    <p>You have an interrupted check-in process</p>
    <button @click="handleResume" class="btn-warning">
      Resume Check-in
    </button>
  </div>
</template>
```

## Data Attributes for Mode Targeting

The system automatically sets `data-mode` attribute on the document element:

```css
/* CSS targeting specific modes */
[data-mode="quiet"] .detailed-info {
  display: block; /* Show in quiet mode */
}

[data-mode="rush"] .detailed-info,
[data-mode="crisis"] .detailed-info {
  display: none; /* Hide in rush/crisis modes */
}

[data-mode="crisis"] .emergency-actions {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}
```

## Responsive Breakpoints

Mobile-first professional breakpoints:

```css
'xs': '320px',   /* Extra small devices */
'sm': '375px',   /* Small devices (phones) */  
'md': '768px',   /* Medium devices (tablets) */
'lg': '1024px',  /* Large devices (laptops) */
'xl': '1280px',  /* Extra large devices */
'2xl': '1536px', /* 2X large devices */
```

## Example Professional Component

```vue
<template>
  <div class="card-professional">
    <!-- Professional header with proper typography -->
    <header class="border-b border-professional-border pb-professional-sm mb-professional-base">
      <h2 class="text-professional-xl font-professional-semibold text-professional-text">
        Guest Check-in
      </h2>
    </header>
    
    <!-- Professional form with interruption resilience -->
    <form @submit.prevent="handleSubmit" class="space-y-professional-base">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-professional-base">
        <div>
          <label class="block text-professional-sm font-professional-medium text-professional-text mb-professional-xs">
            Guest Name
          </label>
          <input 
            v-model="formData.guestName"
            type="text"
            class="input-professional"
            required
          >
        </div>
        
        <div>
          <label class="block text-professional-sm font-professional-medium text-professional-text mb-professional-xs">
            Room Number
          </label>
          <input 
            v-model="formData.roomNumber"
            type="text"
            class="input-professional"
            required
          >
        </div>
      </div>
      
      <!-- Professional action buttons with proper touch targets -->
      <div class="flex justify-end space-professional-sm">
        <button type="button" class="btn-secondary touch-target">
          Cancel
        </button>
        <button type="submit" class="btn-primary touch-target">
          Complete Check-in
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useInterruptionResilientForm, useProfessionalMode } from '@/composables/useProfessionalInterface'

const { currentMode } = useProfessionalMode()
const { formData, saveProgress } = useInterruptionResilientForm('checkin', {
  guestName: '',
  roomNumber: ''
})

const handleSubmit = () => {
  // Process check-in
  console.log('Check-in completed:', formData.value)
}
</script>
```

## Best Practices

1. **Always use professional typography classes** instead of arbitrary font sizes
2. **Implement interruption resilience** for any task longer than 30 seconds
3. **Use touch-target classes** for all interactive elements
4. **Provide performance feedback** for operations longer than 200ms
5. **Respect adaptive modes** - hide complexity in rush/crisis modes
6. **Use professional color system** for consistent status communication
7. **Implement proper loading states** with professional styling
8. **Test with gloved hands** and varying lighting conditions
9. **Ensure 99.9% reliability** for critical booking operations
10. **Support offline-first** architecture for essential functions

## Browser Support

- Modern browsers with CSS Custom Properties support
- Touch-optimized for professional mobile devices
- High contrast mode support
- Reduced motion support
- Print stylesheet included

This design system provides the foundation for professional accommodation management software that serves as cognitive relief while maintaining efficiency and professional dignity.