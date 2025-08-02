/**
 * Vue Composable for Professional Interface Management
 * Provides reactive integration with adaptive interface modes
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  professionalInterface, 
  taskContextManager,
  type OperationalMode, 
  type AdaptiveModeConfig,
  type TaskContext,
  measurePerformance,
  PERFORMANCE_THRESHOLDS
} from '../utils/professionalInterface';

// ===== ADAPTIVE MODE COMPOSABLE =====
export function useProfessionalMode() {
  const currentMode = ref<OperationalMode>(professionalInterface.getCurrentMode());
  const currentConfig = computed(() => professionalInterface.getCurrentConfig());
  
  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    // Subscribe to mode changes
    unsubscribe = professionalInterface.onModeChange((mode) => {
      currentMode.value = mode;
    });
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  const setMode = (mode: OperationalMode) => {
    professionalInterface.setMode(mode);
  };

  const enableAutoMode = () => {
    professionalInterface.enableAutoMode();
  };

  const isQuietMode = computed(() => currentMode.value === 'quiet');
  const isRushMode = computed(() => currentMode.value === 'rush');
  const isCrisisMode = computed(() => currentMode.value === 'crisis');

  return {
    currentMode: readonly(currentMode),
    currentConfig,
    setMode,
    enableAutoMode,
    isQuietMode,
    isRushMode,
    isCrisisMode
  };
}

// ===== TASK CONTEXT COMPOSABLE =====
export function useTaskContext(taskId: string, taskType: string) {
  const context = ref<TaskContext | null>(null);
  const isInterrupted = ref(false);

  onMounted(() => {
    // Load existing context if available
    context.value = taskContextManager.getContext(taskId);
    isInterrupted.value = context.value !== null;
  });

  const saveContext = (data: Record<string, any>, resumable = true) => {
    const taskContext: TaskContext = {
      id: taskId,
      type: taskType,
      data,
      timestamp: Date.now(),
      resumable
    };
    
    taskContextManager.saveContext(taskContext);
    context.value = taskContext;
  };

  const clearContext = () => {
    taskContextManager.clearContext(taskId);
    context.value = null;
    isInterrupted.value = false;
  };

  const resumeContext = () => {
    const savedContext = taskContextManager.getContext(taskId);
    if (savedContext) {
      context.value = savedContext;
      isInterrupted.value = false;
      return savedContext.data;
    }
    return null;
  };

  return {
    context: readonly(context),
    isInterrupted: readonly(isInterrupted),
    saveContext,
    clearContext,
    resumeContext
  };
}

// ===== PERFORMANCE MONITORING COMPOSABLE =====
export function usePerformanceMonitoring() {
  const performanceMetrics = ref<{
    averageResponseTime: number;
    slowOperations: number;
    totalOperations: number;
  }>({
    averageResponseTime: 0,
    slowOperations: 0,
    totalOperations: 0
  });

  let responseTimes: number[] = [];

  const measureOperation = async <T>(
    operation: () => Promise<T>,
    threshold: keyof typeof PERFORMANCE_THRESHOLDS = 'navigation',
    operationName?: string
  ): Promise<T> => {
    return measurePerformance(operation, threshold, (duration) => {
      // Record slow operation
      performanceMetrics.value.slowOperations++;
      
      if (operationName) {
        console.warn(`Slow operation detected: ${operationName} took ${duration}ms`);
      }
      
      // Record metrics for adaptive mode detection
      const errorRate = performanceMetrics.value.slowOperations / performanceMetrics.value.totalOperations;
      professionalInterface.recordMetrics(errorRate, duration, 0);
    }).then(result => {
      // Record operation completion
      performanceMetrics.value.totalOperations++;
      
      // Update response times (keep last 100)
      const start = performance.now();
      responseTimes.push(start);
      if (responseTimes.length > 100) {
        responseTimes = responseTimes.slice(-100);
      }
      
      // Calculate average
      if (responseTimes.length > 0) {
        performanceMetrics.value.averageResponseTime = 
          responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      }
      
      return result;
    });
  };

  const getPerformanceStatus = computed(() => {
    const avgTime = performanceMetrics.value.averageResponseTime;
    const slowRatio = performanceMetrics.value.slowOperations / Math.max(1, performanceMetrics.value.totalOperations);
    
    if (avgTime > PERFORMANCE_THRESHOLDS.data || slowRatio > 0.2) {
      return 'poor';
    } else if (avgTime > PERFORMANCE_THRESHOLDS.navigation || slowRatio > 0.1) {
      return 'fair';
    } else {
      return 'good';
    }
  });

  return {
    performanceMetrics: readonly(performanceMetrics),
    measureOperation,
    getPerformanceStatus
  };
}

// ===== PROFESSIONAL TOUCH COMPOSABLE =====
export function useProfessionalTouch() {
  const { currentConfig } = useProfessionalMode();
  
  const getTouchTargetStyle = (size: 'normal' | 'large' | 'extra-large' = 'normal') => {
    const baseSize = currentConfig.value.touchTargetSize;
    let targetSize = baseSize;
    
    switch (size) {
      case 'large':
        targetSize = baseSize + 4;
        break;
      case 'extra-large':
        targetSize = baseSize + 12;
        break;
    }
    
    return {
      minHeight: `${targetSize}px`,
      minWidth: `${targetSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
  };

  const getProfessionalSpacing = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' = 'base') => {
    const spacingMap = {
      'xs': '0.5rem',
      'sm': '0.75rem', 
      'base': '1rem',
      'lg': '1.5rem',
      'xl': '2rem',
      '2xl': '3rem'
    };
    
    return `var(--spacing-professional-${size}, ${spacingMap[size]})`;
  };

  return {
    getTouchTargetStyle,
    getProfessionalSpacing
  };
}

// ===== INTERRUPTION-RESILIENT FORM COMPOSABLE =====
export function useInterruptionResilientForm<T extends Record<string, any>>(
  formId: string,
  initialData: T
) {
  const { saveContext, clearContext, resumeContext } = useTaskContext(formId, 'form');
  const formData = ref<T>({ ...initialData });
  const isDirty = ref(false);
  const autoSaveEnabled = ref(true);

  // Resume from saved context on mount
  onMounted(() => {
    const savedData = resumeContext();
    if (savedData) {
      formData.value = { ...formData.value, ...savedData };
      isDirty.value = true;
    }
  });

  // Auto-save form data when it changes
  watch(formData, (newData) => {
    isDirty.value = true;
    
    if (autoSaveEnabled.value) {
      // Debounced auto-save
      setTimeout(() => {
        saveContext({ formData: newData });
      }, 1000);
    }
  }, { deep: true });

  const resetForm = () => {
    formData.value = { ...initialData };
    isDirty.value = false;
    clearContext();
  };

  const saveProgress = () => {
    saveContext({ formData: formData.value });
  };

  const setAutoSave = (enabled: boolean) => {
    autoSaveEnabled.value = enabled;
  };

  return {
    formData,
    isDirty: readonly(isDirty),
    autoSaveEnabled: readonly(autoSaveEnabled),
    resetForm,
    saveProgress,
    setAutoSave
  };
}

// ===== PROFESSIONAL LOADING COMPOSABLE =====
export function useProfessionalLoading() {
  const isLoading = ref(false);
  const loadingMessage = ref('');
  const progress = ref(0);

  const startLoading = (message = 'Loading...') => {
    isLoading.value = true;
    loadingMessage.value = message;
    progress.value = 0;
  };

  const updateProgress = (value: number, message?: string) => {
    progress.value = Math.max(0, Math.min(100, value));
    if (message) {
      loadingMessage.value = message;
    }
  };

  const stopLoading = () => {
    isLoading.value = false;
    loadingMessage.value = '';
    progress.value = 0;
  };

  const withLoading = async <T>(
    operation: () => Promise<T>,
    message = 'Loading...'
  ): Promise<T> => {
    startLoading(message);
    try {
      const result = await operation();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    progress: readonly(progress),
    startLoading,
    updateProgress,
    stopLoading,
    withLoading
  };
}

// ===== PROFESSIONAL ERROR HANDLING COMPOSABLE =====
export function useProfessionalErrorHandler() {
  const errors = ref<Array<{
    id: string;
    message: string;
    type: 'user' | 'system' | 'network';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: number;
    dismissed: boolean;
  }>>([]);

  const addError = (
    message: string,
    type: 'user' | 'system' | 'network' = 'system',
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    const error = {
      id: Date.now().toString(),
      message,
      type,
      severity,
      timestamp: Date.now(),
      dismissed: false
    };
    
    errors.value.unshift(error);
    
    // Auto-dismiss low severity errors after 5 seconds
    if (severity === 'low') {
      setTimeout(() => {
        dismissError(error.id);
      }, 5000);
    }
  };

  const dismissError = (id: string) => {
    const index = errors.value.findIndex(error => error.id === id);
    if (index !== -1) {
      errors.value[index].dismissed = true;
      // Remove after animation
      setTimeout(() => {
        errors.value = errors.value.filter(error => error.id !== id);
      }, 300);
    }
  };

  const clearAllErrors = () => {
    errors.value = [];
  };

  const criticalErrors = computed(() => 
    errors.value.filter(error => !error.dismissed && error.severity === 'critical')
  );

  const activeErrors = computed(() =>
    errors.value.filter(error => !error.dismissed)
  );

  return {
    errors: readonly(errors),
    criticalErrors,
    activeErrors,
    addError,
    dismissError,
    clearAllErrors
  };
}

// Helper function to create readonly refs (Vue 3.4+ has readonly, for older versions)
function readonly<T>(ref: any) {
  return computed(() => ref.value);
}