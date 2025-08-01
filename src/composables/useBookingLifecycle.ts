import { ref, computed } from 'vue'
import { useBookingsStore } from '../stores/bookings'
import { useToast } from 'vue-toastification'
import { BookingStatus, PaymentStatus } from '../types/booking'
import type { 
  BookingWithDetails, 
  BookingSetDates, 
  BookingCheckIn, 
  BookingCheckOut, 
  BookingPayment 
} from '../types/booking'

export function useBookingLifecycle() {
  const bookingsStore = useBookingsStore()
  const toast = useToast()
  
  // State
  const processing = ref(false)
  const currentBooking = ref<BookingWithDetails | null>(null)
  
  // Computed
  const canSetDates = computed(() => {
    return currentBooking.value?.is_open_dates && 
           currentBooking.value?.status === BookingStatus.CONFIRMED
  })
  
  const canCheckIn = computed(() => {
    return currentBooking.value?.status === BookingStatus.CONFIRMED &&
           !currentBooking.value?.is_open_dates &&
           currentBooking.value?.check_in_date
  })
  
  const canCheckOut = computed(() => {
    return currentBooking.value?.status === BookingStatus.CHECKED_IN
  })
  
  const canCancel = computed(() => {
    return currentBooking.value && 
           [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(currentBooking.value.status)
  })
  
  const canProcessPayment = computed(() => {
    return currentBooking.value && 
           currentBooking.value.payment_status !== PaymentStatus.PAID &&
           currentBooking.value.status !== BookingStatus.CANCELLED
  })
  
  const remainingBalance = computed(() => {
    if (!currentBooking.value) return 0
    return Math.max(0, Number(currentBooking.value.total_amount) - Number(currentBooking.value.paid_amount))
  })
  
  const isFullyPaid = computed(() => {
    return currentBooking.value?.payment_status === PaymentStatus.PAID
  })
  
  const isOverdue = computed(() => {
    if (!currentBooking.value?.check_in_date) return false
    const checkInDate = new Date(currentBooking.value.check_in_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return checkInDate < today && 
           currentBooking.value.status === BookingStatus.CONFIRMED
  })
  
  // Methods
  const loadBooking = async (id: number) => {
    await bookingsStore.fetchBookingFullDetails(id)
    currentBooking.value = bookingsStore.currentBooking
    return { success: true }
  }
  
  const setBookingDates = async (id: number, dates: BookingSetDates) => {
    if (!canSetDates.value) {
      throw new Error('Cannot set dates for this booking')
    }
    
    try {
      processing.value = true
      const result = await bookingsStore.setBookingDates(id, dates)
      
      if (result.success) {
        toast.success('Booking dates set successfully')
        await loadBooking(id) // Refresh booking data
      } else {
        toast.error(result.error || 'Failed to set booking dates')
      }
      
      return result
    } finally {
      processing.value = false
    }
  }
  
  const checkInBooking = async (id: number, data: BookingCheckIn) => {
    if (!canCheckIn.value) {
      throw new Error('Cannot check in this booking')
    }
    
    try {
      processing.value = true
      const result = await bookingsStore.checkInBooking(id, data)
      
      if (result.success) {
        toast.success('Guest checked in successfully')
        await loadBooking(id) // Refresh booking data
      } else {
        toast.error(result.error || 'Failed to check in guest')
      }
      
      return result
    } finally {
      processing.value = false
    }
  }
  
  const checkOutBooking = async (id: number, data: BookingCheckOut) => {
    if (!canCheckOut.value) {
      throw new Error('Cannot check out this booking')
    }
    
    try {
      processing.value = true
      const result = await bookingsStore.checkOutBooking(id, data)
      
      if (result.success) {
        toast.success('Guest checked out successfully')
        await loadBooking(id) // Refresh booking data
      } else {
        toast.error(result.error || 'Failed to check out guest')
      }
      
      return result
    } finally {
      processing.value = false
    }
  }
  
  const processPayment = async (id: number, payment: BookingPayment) => {
    if (!canProcessPayment.value) {
      throw new Error('Cannot process payment for this booking')
    }
    
    try {
      processing.value = true
      const result = await bookingsStore.processPayment(id, payment)
      
      if (result.success) {
        toast.success('Payment processed successfully')
        await loadBooking(id) // Refresh booking data
      } else {
        toast.error(result.error || 'Failed to process payment')
      }
      
      return result
    } finally {
      processing.value = false
    }
  }
  
  const cancelBooking = async (id: number, reason?: string) => {
    if (!canCancel.value) {
      throw new Error('Cannot cancel this booking')
    }
    
    try {
      processing.value = true
      const result = await bookingsStore.cancelBooking(id, reason)
      
      if (result.success) {
        toast.success('Booking cancelled successfully')
        await loadBooking(id) // Refresh booking data
      } else {
        toast.error(result.error || 'Failed to cancel booking')
      }
      
      return result
    } finally {
      processing.value = false
    }
  }
  
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'yellow'
      case BookingStatus.CONFIRMED:
        return 'blue'
      case BookingStatus.CHECKED_IN:
        return 'green'
      case BookingStatus.CHECKED_OUT:
        return 'purple'
      case BookingStatus.CANCELLED:
        return 'red'
      default:
        return 'gray'
    }
  }
  
  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.NOT_PAID:
        return 'red'
      case PaymentStatus.PARTIAL:
        return 'yellow'
      case PaymentStatus.PAID:
        return 'green'
      default:
        return 'gray'
    }
  }
  
  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'Pending'
      case BookingStatus.CONFIRMED:
        return 'Confirmed'
      case BookingStatus.CHECKED_IN:
        return 'Checked In'
      case BookingStatus.CHECKED_OUT:
        return 'Checked Out'
      case BookingStatus.CANCELLED:
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }
  
  const getPaymentStatusText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.NOT_PAID:
        return 'Not Paid'
      case PaymentStatus.PARTIAL:
        return 'Partially Paid'
      case PaymentStatus.PAID:
        return 'Fully Paid'
      default:
        return 'Unknown'
    }
  }
  
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  return {
    // State
    processing,
    currentBooking,
    
    // Computed
    canSetDates,
    canCheckIn,
    canCheckOut,
    canCancel,
    canProcessPayment,
    remainingBalance,
    isFullyPaid,
    isOverdue,
    
    // Methods
    loadBooking,
    setBookingDates,
    checkInBooking,
    checkOutBooking,
    processPayment,
    cancelBooking,
    getStatusColor,
    getPaymentStatusColor,
    getStatusText,
    getPaymentStatusText,
    calculateNights,
    formatCurrency,
  }
}