/**
 * Professional Interface Utilities
 * Supports adaptive interface modes and professional mobile patterns
 * 
 * Core Principle: Cognitive Relief Through Predictable Excellence
 */

// ===== ADAPTIVE INTERFACE MODES =====
export type OperationalMode = 'quiet' | 'rush' | 'crisis';

export interface AdaptiveModeConfig {
  mode: OperationalMode;
  touchTargetSize: number;
  fontSize: number;
  animationDuration: number;
  informationDensity: 'full' | 'reduced' | 'minimal';
}

// Adaptive mode configurations based on operational stress
export const ADAPTIVE_MODES: Record<OperationalMode, AdaptiveModeConfig> = {
  quiet: {
    mode: 'quiet',
    touchTargetSize: 44,
    fontSize: 16,
    animationDuration: 200,
    informationDensity: 'full'
  },
  rush: {
    mode: 'rush', 
    touchTargetSize: 48,
    fontSize: 17,
    animationDuration: 150,
    informationDensity: 'reduced'
  },
  crisis: {
    mode: 'crisis',
    touchTargetSize: 56,
    fontSize: 18,
    animationDuration: 100,
    informationDensity: 'minimal'
  }
};

// ===== ADAPTIVE MODE MANAGEMENT =====
export class ProfessionalInterfaceManager {
  private currentMode: OperationalMode = 'quiet';
  private modeChangeCallbacks: Set<(mode: OperationalMode) => void> = new Set();
  private performanceMetrics: {
    errorRate: number;
    responseTime: number;
    userLoad: number;
    timestamp: number;
  }[] = [];

  constructor() {
    this.initializeMode();
    this.setupPerformanceMonitoring();
  }

  /**
   * Initialize adaptive mode based on stored preferences or system state
   */
  private initializeMode(): void {
    // Check for stored mode preference
    const storedMode = localStorage.getItem('professional-interface-mode') as OperationalMode;
    if (storedMode && ADAPTIVE_MODES[storedMode]) {
      this.setMode(storedMode);
    } else {
      this.setMode('quiet');
    }
  }

  /**
   * Set adaptive interface mode
   */
  public setMode(mode: OperationalMode): void {
    if (!ADAPTIVE_MODES[mode]) {
      console.warn(`Invalid adaptive mode: ${mode}. Falling back to quiet mode.`);
      mode = 'quiet';
    }

    this.currentMode = mode;
    const config = ADAPTIVE_MODES[mode];

    // Update CSS custom properties
    this.updateCSSProperties(config);
    
    // Update document data attribute for CSS targeting
    document.documentElement.setAttribute('data-mode', mode);
    
    // Store preference
    localStorage.setItem('professional-interface-mode', mode);
    
    // Notify callbacks
    this.modeChangeCallbacks.forEach(callback => callback(mode));
    
    console.log(`Professional interface mode changed to: ${mode}`, config);
  }

  /**
   * Get current adaptive mode
   */
  public getCurrentMode(): OperationalMode {
    return this.currentMode;
  }

  /**
   * Get current mode configuration
   */
  public getCurrentConfig(): AdaptiveModeConfig {
    return ADAPTIVE_MODES[this.currentMode];
  }

  /**
   * Subscribe to mode changes
   */
  public onModeChange(callback: (mode: OperationalMode) => void): () => void {
    this.modeChangeCallbacks.add(callback);
    return () => this.modeChangeCallbacks.delete(callback);
  }

  /**
   * Auto-detect appropriate mode based on system metrics
   */
  public autoDetectMode(): OperationalMode {
    const recent = this.performanceMetrics.slice(-10);
    if (recent.length < 3) return 'quiet';

    const avgErrorRate = recent.reduce((sum, m) => sum + m.errorRate, 0) / recent.length;
    const avgResponseTime = recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length;
    const avgUserLoad = recent.reduce((sum, m) => sum + m.userLoad, 0) / recent.length;

    // Crisis mode triggers
    if (avgErrorRate > 0.1 || avgResponseTime > 2000 || avgUserLoad > 0.9) {
      return 'crisis';
    }

    // Rush mode triggers  
    if (avgErrorRate > 0.05 || avgResponseTime > 1000 || avgUserLoad > 0.7) {
      return 'rush';
    }

    return 'quiet';
  }

  /**
   * Enable automatic mode switching based on performance metrics
   */
  public enableAutoMode(): void {
    setInterval(() => {
      const detectedMode = this.autoDetectMode();
      if (detectedMode !== this.currentMode) {
        this.setMode(detectedMode);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Record performance metrics for adaptive mode detection
   */
  public recordMetrics(errorRate: number, responseTime: number, userLoad: number): void {
    this.performanceMetrics.push({
      errorRate,
      responseTime,
      userLoad,
      timestamp: Date.now()
    });

    // Keep only last 50 metrics
    if (this.performanceMetrics.length > 50) {
      this.performanceMetrics = this.performanceMetrics.slice(-50);
    }
  }

  /**
   * Update CSS custom properties based on mode configuration
   */
  private updateCSSProperties(config: AdaptiveModeConfig): void {
    const root = document.documentElement;
    
    // Update touch target sizes
    root.style.setProperty('--spacing-touch', `${config.touchTargetSize}px`);
    root.style.setProperty('--spacing-touch-lg', `${config.touchTargetSize + 4}px`);
    root.style.setProperty('--spacing-touch-xl', `${config.touchTargetSize + 12}px`);
    
    // Update font sizes
    root.style.setProperty('--font-size-professional-base', `${config.fontSize}px`);
    root.style.setProperty('--font-size-professional-sm', `${config.fontSize - 1}px`);
    root.style.setProperty('--font-size-professional-lg', `${config.fontSize + 2}px`);
    
    // Update animation timings
    root.style.setProperty('--timing-critical', `${Math.max(50, config.animationDuration - 100)}ms`);
    root.style.setProperty('--timing-navigation', `${config.animationDuration}ms`);
  }

  /**
   * Setup performance monitoring for adaptive mode detection
   */
  private setupPerformanceMonitoring(): void {
    // Monitor navigation performance
    if ('performance' in window && 'observe' in PerformanceObserver.prototype) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const responseTime = navEntry.responseEnd - navEntry.requestStart;
            this.recordMetrics(0, responseTime, 0);
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }

    // Monitor user interaction frequency (simplified user load)
    let interactionCount = 0;
    const resetInterval = 60000; // 1 minute

    ['click', 'touchstart', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
      }, { passive: true });
    });

    setInterval(() => {
      const userLoad = Math.min(1, interactionCount / 60); // Normalize to actions per second
      this.recordMetrics(0, 0, userLoad);
      interactionCount = 0;
    }, resetInterval);
  }
}

// ===== PROFESSIONAL TOUCH UTILITIES =====
export interface TouchTargetOptions {
  size: 'normal' | 'large' | 'extra-large';
  mode?: OperationalMode;
}

export function getTouchTargetSize(options: TouchTargetOptions): number {
  const mode = options.mode || 'quiet';
  const config = ADAPTIVE_MODES[mode];
  const baseSize = config.touchTargetSize;

  switch (options.size) {
    case 'large':
      return baseSize + 4;
    case 'extra-large':
      return baseSize + 12;
    default:
      return baseSize;
  }
}

// ===== INTERRUPTION-RESILIENT PATTERNS =====
export interface TaskContext {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: number;
  resumable: boolean;
}

export class TaskContextManager {
  private contexts: Map<string, TaskContext> = new Map();
  private readonly STORAGE_KEY = 'professional-task-contexts';

  constructor() {
    this.loadContexts();
    this.setupAutoSave();
  }

  /**
   * Save task context for interruption-resilient design
   */
  public saveContext(context: TaskContext): void {
    this.contexts.set(context.id, context);
    this.persistContexts();
  }

  /**
   * Retrieve task context for resumption
   */
  public getContext(id: string): TaskContext | null {
    return this.contexts.get(id) || null;
  }

  /**
   * Clear completed task context
   */
  public clearContext(id: string): void {
    this.contexts.delete(id);
    this.persistContexts();
  }

  /**
   * Get all resumable contexts
   */
  public getResumableContexts(): TaskContext[] {
    return Array.from(this.contexts.values())
      .filter(context => context.resumable)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Clear old contexts (older than 24 hours)
   */
  public clearOldContexts(): void {
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    for (const [id, context] of this.contexts) {
      if (context.timestamp < dayAgo) {
        this.contexts.delete(id);
      }
    }
    this.persistContexts();
  }

  private loadContexts(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.contexts = new Map(parsed);
      }
    } catch (error) {
      console.warn('Failed to load task contexts:', error);
    }
  }

  private persistContexts(): void {
    try {
      const serialized = JSON.stringify(Array.from(this.contexts.entries()));
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      console.warn('Failed to persist task contexts:', error);
    }
  }

  private setupAutoSave(): void {
    // Auto-save contexts periodically
    setInterval(() => {
      this.persistContexts();
    }, 30000); // Every 30 seconds

    // Clear old contexts daily
    setInterval(() => {
      this.clearOldContexts();
    }, 24 * 60 * 60 * 1000); // Every 24 hours
  }
}

// ===== PROFESSIONAL PERFORMANCE UTILITIES =====
export interface PerformanceThresholds {
  critical: number;    // Guest-facing actions
  navigation: number;  // Screen transitions  
  data: number;        // Data loading
}

export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  critical: 100,    // 100ms
  navigation: 200,  // 200ms
  data: 500        // 500ms
};

export function measurePerformance<T>(
  operation: () => Promise<T>,
  threshold: keyof PerformanceThresholds,
  onSlow?: (duration: number) => void
): Promise<T> {
  const start = performance.now();
  
  return operation().then(result => {
    const duration = performance.now() - start;
    const maxDuration = PERFORMANCE_THRESHOLDS[threshold];
    
    if (duration > maxDuration && onSlow) {
      onSlow(duration);
    }
    
    return result;
  });
}

// ===== PROFESSIONAL ERROR BOUNDARIES =====
export interface ProfessionalError {
  type: 'user' | 'system' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  userMessage: string;
  recovery?: () => void;
  timestamp: number;
}

export function createProfessionalError(
  type: ProfessionalError['type'],
  severity: ProfessionalError['severity'],
  message: string,
  userMessage: string,
  recovery?: () => void
): ProfessionalError {
  return {
    type,
    severity,
    message,
    userMessage,
    recovery,
    timestamp: Date.now()
  };
}

// ===== SINGLETON INSTANCES =====
export const professionalInterface = new ProfessionalInterfaceManager();
export const taskContextManager = new TaskContextManager();

// ===== INITIALIZATION =====
// Auto-initialize professional interface
if (typeof window !== 'undefined') {
  // Set initial mode
  professionalInterface.setMode('quiet');
  
  // Setup viewport meta for professional mobile use
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no'
    );
  }
}