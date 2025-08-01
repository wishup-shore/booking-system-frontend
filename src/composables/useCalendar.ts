import { ref, computed } from 'vue'
import { useBookingsStore } from '../stores/bookings'

export function useCalendar() {
  const bookingsStore = useBookingsStore()
  
  // State
  const currentDate = ref(new Date())
  const viewMode = ref<'month' | 'week' | 'day'>('month')
  
  // Computed
  const currentPeriodStart = computed(() => {
    const date = new Date(currentDate.value)
    switch (viewMode.value) {
      case 'month':
        date.setDate(1)
        date.setHours(0, 0, 0, 0)
        return date
      case 'week':
        const dayOfWeek = date.getDay()
        date.setDate(date.getDate() - dayOfWeek)
        date.setHours(0, 0, 0, 0)
        return date
      case 'day':
        date.setHours(0, 0, 0, 0)
        return date
      default:
        return date
    }
  })
  
  const currentPeriodEnd = computed(() => {
    const date = new Date(currentPeriodStart.value)
    switch (viewMode.value) {
      case 'month':
        date.setMonth(date.getMonth() + 1, 0)
        date.setHours(23, 59, 59, 999)
        return date
      case 'week':
        date.setDate(date.getDate() + 6)
        date.setHours(23, 59, 59, 999)
        return date
      case 'day':
        date.setHours(23, 59, 59, 999)
        return date
      default:
        return date
    }
  })
  
  const currentPeriodText = computed(() => {
    const startDate = currentPeriodStart.value
    const endDate = currentPeriodEnd.value
    
    switch (viewMode.value) {
      case 'month':
        return startDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      case 'week':
        return `${startDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })} - ${endDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}`
      case 'day':
        return startDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      default:
        return ''
    }
  })
  
  const events = computed(() => bookingsStore.calendarEvents)
  const statistics = computed(() => bookingsStore.calendarStats)
  const loading = computed(() => bookingsStore.loading)
  
  // Methods
  const goToPrevious = () => {
    const date = new Date(currentDate.value)
    switch (viewMode.value) {
      case 'month':
        date.setMonth(date.getMonth() - 1)
        break
      case 'week':
        date.setDate(date.getDate() - 7)
        break
      case 'day':
        date.setDate(date.getDate() - 1)
        break
    }
    currentDate.value = date
    loadCalendarData()
  }
  
  const goToNext = () => {
    const date = new Date(currentDate.value)
    switch (viewMode.value) {
      case 'month':
        date.setMonth(date.getMonth() + 1)
        break
      case 'week':
        date.setDate(date.getDate() + 7)
        break
      case 'day':
        date.setDate(date.getDate() + 1)
        break
    }
    currentDate.value = date
    loadCalendarData()
  }
  
  const goToToday = () => {
    currentDate.value = new Date()
    loadCalendarData()
  }
  
  const setViewMode = (mode: 'month' | 'week' | 'day') => {
    viewMode.value = mode
    loadCalendarData()
  }
  
  const setDate = (date: Date) => {
    currentDate.value = new Date(date)
    loadCalendarData()
  }
  
  const loadCalendarData = async () => {
    const startDateStr = currentPeriodStart.value.toISOString().split('T')[0]
    const endDateStr = currentPeriodEnd.value.toISOString().split('T')[0]
    
    await Promise.all([
      bookingsStore.fetchCalendarEvents(startDateStr, endDateStr),
      bookingsStore.fetchCalendarStatistics(startDateStr, endDateStr)
    ])
  }
  
  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
  
  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isInCurrentPeriod = (dateString: string) => {
    const date = new Date(dateString)
    return date >= currentPeriodStart.value && date <= currentPeriodEnd.value
  }
  
  const getEventsForDate = (dateString: string) => {
    const date = new Date(dateString).toDateString()
    return events.value.filter(event => {
      const eventDate = new Date(event.start).toDateString()
      return eventDate === date
    })
  }
  
  const getDaysInCurrentPeriod = () => {
    const days = []
    const current = new Date(currentPeriodStart.value)
    
    while (current <= currentPeriodEnd.value) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }
  
  // Initialize
  const initialize = async () => {
    await loadCalendarData()
  }
  
  return {
    // State
    currentDate,
    viewMode,
    
    // Computed
    currentPeriodStart,
    currentPeriodEnd,
    currentPeriodText,
    events,
    statistics,
    loading,
    
    // Methods
    goToPrevious,
    goToNext,
    goToToday,
    setViewMode,
    setDate,
    loadCalendarData,
    formatEventTime,
    formatEventDate,
    isToday,
    isInCurrentPeriod,
    getEventsForDate,
    getDaysInCurrentPeriod,
    initialize,
  }
}