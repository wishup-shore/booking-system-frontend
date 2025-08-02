<template>
  <div id="app" class="professional-container min-h-screen bg-professional-bg">
    <!-- Professional Header -->
    <header class="professional-header">
      <div class="flex items-center justify-between p-professional-base">
        <h1 class="text-professional-lg font-professional-semibold text-professional-text">
          Accommodation Management
        </h1>
        
        <!-- Adaptive Mode Selector -->
        <div class="flex items-center space-professional-sm">
          <label class="text-professional-sm text-professional-text-secondary">
            Mode:
          </label>
          <select 
            :value="currentMode" 
            @change="handleModeChange"
            class="input-professional text-professional-sm"
          >
            <option value="quiet">Quiet</option>
            <option value="rush">Rush</option>
            <option value="crisis">Crisis</option>
          </select>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-professional-base space-y-professional-lg">
      <!-- Professional Status Card -->
      <div class="card-professional">
        <h2 class="text-professional-xl font-professional-semibold mb-professional-base">
          System Status
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-professional-base">
          <div class="status-indicator status-success">
            <div class="w-2 h-2 bg-current rounded-full"></div>
            System Online
          </div>
          <div class="status-indicator status-neutral">
            <div class="w-2 h-2 bg-current rounded-full"></div>
            Mode: {{ currentMode }}
          </div>
          <div class="status-indicator" :class="performanceStatusClass">
            <div class="w-2 h-2 bg-current rounded-full"></div>
            Performance: {{ getPerformanceStatus }}
          </div>
        </div>
      </div>

      <!-- Professional Action Buttons -->
      <div class="card-professional">
        <h2 class="text-professional-xl font-professional-semibold mb-professional-base">
          Quick Actions
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-professional-base">
          <button class="btn-primary touch-target">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Booking
          </button>
          
          <button class="btn-secondary touch-target">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"></path>
            </svg>
            Check-in
          </button>
          
          <button class="btn-secondary touch-target">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Check-out
          </button>
          
          <button class="btn-warning touch-target">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            Emergency
          </button>
        </div>
      </div>

      <!-- Professional Form Example -->
      <div class="card-professional">
        <h2 class="text-professional-xl font-professional-semibold mb-professional-base">
          Guest Information
        </h2>
        
        <form @submit.prevent="handleFormSubmit" class="space-y-professional-base">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-professional-base">
            <div>
              <label class="block text-professional-sm font-professional-medium text-professional-text mb-professional-xs">
                Guest Name
              </label>
              <input 
                v-model="formData.guestName"
                type="text" 
                class="input-professional" 
                placeholder="Enter guest name"
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
                placeholder="Room number"
                required
              >
            </div>
          </div>
          
          <div>
            <label class="block text-professional-sm font-professional-medium text-professional-text mb-professional-xs">
              Special Requests
            </label>
            <textarea 
              v-model="formData.specialRequests"
              class="input-professional" 
              rows="3"
              placeholder="Any special requests or notes"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-professional-sm">
            <button type="button" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Save Information
            </button>
          </div>
        </form>
      </div>

      <!-- Interruption-Resilient Task Demo -->
      <div class="card-professional" v-if="isInterrupted">
        <div class="task-resumable" data-interrupted="true">
          <h3 class="text-professional-lg font-professional-medium text-warning-500 mb-professional-sm">
            Interrupted Task Detected
          </h3>
          <p class="text-professional-sm text-professional-text-secondary mb-professional-base">
            You have an unfinished task that can be resumed.
          </p>
          <div class="flex space-professional-sm">
            <button @click="resumeTask" class="btn-warning">
              Resume Task
            </button>
            <button @click="dismissTask" class="btn-secondary">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Performance Indicator -->
    <div 
      v-if="showPerformanceIndicator" 
      class="performance-indicator visible"
    >
      Avg: {{ performanceMetrics.averageResponseTime.toFixed(0) }}ms
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  useProfessionalMode, 
  useTaskContext, 
  usePerformanceMonitoring,
  useInterruptionResilientForm 
} from './composables/useProfessionalInterface'

// Professional interface mode management
const { currentMode, setMode } = useProfessionalMode()

// Performance monitoring
const { performanceMetrics, getPerformanceStatus } = usePerformanceMonitoring()

// Task context for interruption resilience
const { isInterrupted, resumeContext, clearContext } = useTaskContext('demo-task', 'guest-info')

// Form with auto-save capabilities
const { formData, isDirty, saveProgress } = useInterruptionResilientForm('guest-form', {
  guestName: '',
  roomNumber: '',
  specialRequests: ''
})

// Performance indicator visibility
const showPerformanceIndicator = ref(false)

// Computed properties
const performanceStatusClass = computed(() => {
  const status = getPerformanceStatus.value
  return {
    'status-success': status === 'good',
    'status-warning': status === 'fair', 
    'status-error': status === 'poor'
  }
})

// Methods
const handleModeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setMode(target.value as any)
}

const handleFormSubmit = () => {
  // Simulate form processing
  console.log('Form submitted:', formData.value)
  
  // Clear the form context after successful submission
  clearContext()
}

const resumeTask = () => {
  const taskData = resumeContext()
  if (taskData) {
    console.log('Resuming task with data:', taskData)
  }
}

const dismissTask = () => {
  clearContext()
}

// Lifecycle
onMounted(() => {
  // Show performance indicator for demo
  setTimeout(() => {
    showPerformanceIndicator.value = true
  }, 2000)
  
  // Auto-save form progress every 30 seconds
  setInterval(() => {
    if (isDirty.value) {
      saveProgress()
    }
  }, 30000)
})
</script>

<style scoped>
/* Component-specific professional styles */
.task-resumable[data-interrupted="true"] {
  border: 2px dashed var(--color-warning);
  border-radius: calc(var(--border-radius-base, 8px) + 2px);
  padding: var(--spacing-professional-base);
  background: rgba(217, 119, 6, 0.05);
}
</style>