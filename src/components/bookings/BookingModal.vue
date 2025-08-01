<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6"
  >
    <div
      class="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border max-h-full overflow-y-auto"
    >
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ modalTitle }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- View Mode -->
        <div v-if="mode === 'view'" class="space-y-6">
          <!-- Status and Actions Bar -->
          <div
            class="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
          >
            <div class="flex items-center space-x-4">
              <span
                :class="getStatusBadgeClass(booking?.status)"
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
              >
                {{ formatStatusLabel(booking?.status) }}
              </span>
              <span
                :class="getPaymentStatusBadgeClass(booking?.payment_status)"
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
              >
                {{ formatPaymentStatusLabel(booking?.payment_status) }}
              </span>
              <span
                v-if="booking?.is_open_dates"
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800"
              >
                Open Dates
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <button
                v-if="canCheckIn"
                @click="showCheckInForm = true"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Check In
              </button>
              <button
                v-if="canCheckOut"
                @click="showCheckOutForm = true"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Check Out
              </button>
              <button
                v-if="canProcessPayment"
                @click="showPaymentForm = true"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Process Payment
              </button>
              <button
                @click="mode = 'edit'"
                class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Edit Booking
              </button>
            </div>
          </div>

          <!-- Booking Details Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Client Information -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Client Information
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <div
                      class="h-12 w-12 flex-shrink-0 bg-primary-100 rounded-full flex items-center justify-center"
                    >
                      <span class="text-lg font-medium text-primary-600">
                        {{ getClientInitials(fullBooking?.client ? `${fullBooking.client.first_name} ${fullBooking.client.last_name}`.trim() : booking?.client_name) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-lg font-medium text-gray-900">
                        {{ fullBooking?.client ? `${fullBooking.client.first_name} ${fullBooking.client.last_name}`.trim() : booking?.client_name || `Client #${booking?.client_id}` }}
                      </div>
                      <div v-if="fullBooking?.client?.phone || booking?.client_phone" class="text-sm text-gray-500">
                        {{ fullBooking?.client?.phone || booking?.client_phone }}
                      </div>
                      <div v-if="fullBooking?.client?.email" class="text-sm text-gray-500">
                        {{ fullBooking.client.email }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Accommodation Information -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Accommodation
                </h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Number:</span>
                    <span class="text-sm text-gray-900">{{ fullBooking?.accommodation?.number || booking?.accommodation_number || `Room #${booking?.accommodation_id}` }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Type:</span>
                    <span class="text-sm text-gray-900">{{ fullBooking?.accommodation?.type?.name || booking?.accommodation_type || 'Unknown Type' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Capacity:</span>
                    <span class="text-sm text-gray-900">{{ fullBooking?.accommodation?.capacity || 'N/A' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Guests:</span>
                    <span class="text-sm text-gray-900">{{ booking?.guests_count }}</span>
                  </div>
                  <div v-if="fullBooking?.accommodation?.price_per_night" class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Price per Night:</span>
                    <span class="text-sm text-gray-900">${{ formatCurrency(fullBooking.accommodation.price_per_night) }}</span>
                  </div>
                </div>
              </div>

              <!-- Dates Information -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Dates & Timeline
                </h4>
                <div class="space-y-2">
                  <div v-if="!booking?.is_open_dates">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-500">Check-in Date:</span>
                      <span class="text-sm text-gray-900">{{
                        formatDate(booking?.check_in_date)
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-500">Check-out Date:</span>
                      <span class="text-sm text-gray-900">{{
                        formatDate(booking?.check_out_date)
                      }}</span>
                    </div>
                  </div>
                  <div v-else>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-500">Booking Type:</span>
                      <span class="text-sm text-orange-600 font-medium">Open Dates</span>
                    </div>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Created:</span>
                    <span class="text-sm text-gray-900">{{ formatDate(booking?.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Payment Information -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Payment Details
                </h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Total Amount:</span>
                    <span class="text-sm font-medium text-gray-900"
                      >${{ formatCurrency(booking?.total_amount || 0) }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Paid Amount:</span>
                    <span class="text-sm font-medium text-green-600"
                      >${{ formatCurrency(booking?.paid_amount || 0) }}</span
                    >
                  </div>
                  <div class="flex justify-between border-t pt-2">
                    <span class="text-sm font-medium text-gray-500">Balance:</span>
                    <span
                      class="text-sm font-medium"
                      :class="balance > 0 ? 'text-red-600' : 'text-green-600'"
                    >
                      ${{ formatCurrency(balance) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-500">Status:</span>
                    <span
                      :class="getPaymentStatusBadgeClass(booking?.payment_status)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ formatPaymentStatusLabel(booking?.payment_status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Comments/Notes -->
              <div
                v-if="fullBooking?.comments"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Comments & Notes
                </h4>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ fullBooking.comments }}</p>
              </div>

              <!-- Booking History/Timeline -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Booking Timeline
                </h4>
                <div class="space-y-3">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Booking Created</p>
                      <p class="text-xs text-gray-500">{{ formatDateTime(booking?.created_at) }}</p>
                    </div>
                  </div>
                  <div v-if="fullBooking?.actual_check_in" class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Checked In</p>
                      <p class="text-xs text-gray-500">
                        {{ formatDateTime(fullBooking.actual_check_in) }}
                      </p>
                    </div>
                  </div>
                  <div v-if="fullBooking?.actual_check_out" class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Checked Out</p>
                      <p class="text-xs text-gray-500">
                        {{ formatDateTime(fullBooking.actual_check_out) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-if="mode === 'edit'" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Booking Information -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
              Booking Details
            </h4>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="guests_count" class="block text-sm font-medium text-gray-700">
                  Number of Guests <span class="text-red-500">*</span>
                </label>
                <input
                  id="guests_count"
                  v-model.number="form.guests_count"
                  type="number"
                  min="1"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                  placeholder="Number of guests"
                />
              </div>

              <div>
                <label for="status" class="block text-sm font-medium text-gray-700"> Status </label>
                <select
                  id="status"
                  v-model="form.status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                >
                  <option
                    v-for="status in Object.values(BookingStatus)"
                    :key="status"
                    :value="status"
                  >
                    {{ formatStatusLabel(status) }}
                  </option>
                </select>
              </div>

              <div>
                <label for="payment_status" class="block text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <select
                  id="payment_status"
                  v-model="form.payment_status"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                >
                  <option
                    v-for="status in Object.values(PaymentStatus)"
                    :key="status"
                    :value="status"
                  >
                    {{ formatPaymentStatusLabel(status) }}
                  </option>
                </select>
              </div>

              <div>
                <label for="total_amount" class="block text-sm font-medium text-gray-700">
                  Total Amount <span class="text-red-500">*</span>
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="total_amount"
                    v-model.number="form.total_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label for="paid_amount" class="block text-sm font-medium text-gray-700">
                  Paid Amount
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="paid_amount"
                    v-model.number="form.paid_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    :max="form.total_amount"
                    class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <!-- Date Fields (only if not open dates) -->
            <div v-if="!booking?.is_open_dates" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="check_in_date" class="block text-sm font-medium text-gray-700">
                  Check-in Date
                </label>
                <input
                  id="check_in_date"
                  v-model="form.check_in_date"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                />
              </div>

              <div>
                <label for="check_out_date" class="block text-sm font-medium text-gray-700">
                  Check-out Date
                </label>
                <input
                  id="check_out_date"
                  v-model="form.check_out_date"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                />
              </div>
            </div>

            <div>
              <label for="comments" class="block text-sm font-medium text-gray-700">
                Comments/Notes
              </label>
              <textarea
                id="comments"
                v-model="form.comments"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base sm:text-sm py-2.5 sm:py-2"
                placeholder="Any additional notes about this booking..."
              ></textarea>
            </div>
          </div>

          <!-- Form Actions -->
          <div
            class="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200"
          >
            <button
              type="button"
              @click="cancelEdit"
              class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 touch-manipulation min-h-[44px] sm:min-h-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-0"
            >
              {{ loading ? 'Saving...' : 'Update Booking' }}
            </button>
          </div>
        </form>

        <!-- Check-in Form -->
        <div
          v-if="showCheckInForm"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Check In Guest</h4>
            <form @submit.prevent="handleCheckIn" class="space-y-4">
              <div>
                <label for="actual_check_in" class="block text-sm font-medium text-gray-700">
                  Check-in Time
                </label>
                <input
                  id="actual_check_in"
                  v-model="checkInForm.actual_check_in"
                  type="datetime-local"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label for="checkin_guests_count" class="block text-sm font-medium text-gray-700">
                  Number of Guests
                </label>
                <input
                  id="checkin_guests_count"
                  v-model.number="checkInForm.guests_count"
                  type="number"
                  min="1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label for="checkin_comments" class="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="checkin_comments"
                  v-model="checkInForm.comments"
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Any notes about the check-in..."
                ></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showCheckInForm = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {{ loading ? 'Processing...' : 'Check In' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Check-out Form -->
        <div
          v-if="showCheckOutForm"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Check Out Guest</h4>
            <form @submit.prevent="handleCheckOut" class="space-y-4">
              <div>
                <label for="actual_check_out" class="block text-sm font-medium text-gray-700">
                  Check-out Time
                </label>
                <input
                  id="actual_check_out"
                  v-model="checkOutForm.actual_check_out"
                  type="datetime-local"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label for="checkout_comments" class="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="checkout_comments"
                  v-model="checkOutForm.comments"
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Any notes about the check-out..."
                ></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showCheckOutForm = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {{ loading ? 'Processing...' : 'Check Out' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Payment Form -->
        <div
          v-if="showPaymentForm"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Process Payment</h4>
            <form @submit.prevent="handleProcessPayment" class="space-y-4">
              <div>
                <label for="payment_amount" class="block text-sm font-medium text-gray-700">
                  Payment Amount <span class="text-red-500">*</span>
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="payment_amount"
                    v-model.number="paymentForm.amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    :max="balance"
                    required
                    class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">Balance: ${{ formatCurrency(balance) }}</p>
              </div>
              <div>
                <label for="payment_method" class="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="payment_method"
                  v-model="paymentForm.payment_method"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label for="payment_notes" class="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="payment_notes"
                  v-model="paymentForm.notes"
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Payment notes..."
                ></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showPaymentForm = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ loading ? 'Processing...' : 'Process Payment' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBookingsStore } from '../../stores/bookings'
import { BookingStatus, PaymentStatus } from '../../types/booking'
import type {
  BookingListItem,
  BookingWithDetails,
  BookingUpdate,
  BookingCheckIn,
  BookingCheckOut,
  BookingPayment,
} from '../../types/booking'

interface Props {
  booking?: BookingListItem | null
  mode?: 'view' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: BookingUpdate): void
  (e: 'check-in', data: BookingCheckIn): void
  (e: 'check-out', data: BookingCheckOut): void
  (e: 'process-payment', data: BookingPayment): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view',
})
const emit = defineEmits<Emits>()

const bookingsStore = useBookingsStore()

// Reactive state
const mode = ref(props.mode)
const fullBooking = ref<BookingWithDetails | null>(null)
const showCheckInForm = ref(false)
const showCheckOutForm = ref(false)
const showPaymentForm = ref(false)

// Forms
const form = ref<BookingUpdate>({
  guests_count: 1,
  status: BookingStatus.PENDING,
  payment_status: PaymentStatus.NOT_PAID,
  total_amount: 0,
  paid_amount: 0,
  comments: '',
})

const checkInForm = ref<BookingCheckIn>({
  actual_check_in: new Date().toISOString().slice(0, 16),
  guests_count: 1,
  comments: '',
})

const checkOutForm = ref<BookingCheckOut>({
  actual_check_out: new Date().toISOString().slice(0, 16),
  comments: '',
})

const paymentForm = ref<BookingPayment>({
  amount: 0,
  payment_method: '',
  notes: '',
})

// Computed properties
const modalTitle = computed(() => {
  if (mode.value === 'edit') return 'Edit Booking'
  return `Booking #${props.booking?.id || 'Details'}`
})

const balance = computed(() => {
  const total = Number(props.booking?.total_amount || 0)
  const paid = Number(props.booking?.paid_amount || 0)
  return Math.max(0, total - paid)
})

const canCheckIn = computed(() => {
  return props.booking?.status === BookingStatus.CONFIRMED && !props.booking?.is_open_dates
})

const canCheckOut = computed(() => {
  return props.booking?.status === BookingStatus.CHECKED_IN
})

const canProcessPayment = computed(() => {
  return balance.value > 0 && props.booking?.status !== BookingStatus.CANCELLED
})

// Methods
const initializeForm = () => {
  if (props.booking) {
    form.value = {
      guests_count: props.booking.guests_count,
      status: props.booking.status,
      payment_status: props.booking.payment_status,
      total_amount: Number(props.booking.total_amount),
      paid_amount: Number(props.booking.paid_amount),
      check_in_date: props.booking.check_in_date,
      check_out_date: props.booking.check_out_date,
      comments: fullBooking.value?.comments || '',
    }

    checkInForm.value.guests_count = props.booking.guests_count
    paymentForm.value.amount = balance.value
  }
}

const loadFullBooking = async () => {
  if (props.booking?.id) {
    try {
      await bookingsStore.fetchBooking(props.booking.id)
      fullBooking.value = bookingsStore.currentBooking
    } catch (error) {
      console.error('Failed to load full booking details:', error)
    }
  }
}

const handleSubmit = () => {
  emit('save', form.value)
}

const handleCheckIn = () => {
  emit('check-in', checkInForm.value)
  showCheckInForm.value = false
}

const handleCheckOut = () => {
  emit('check-out', checkOutForm.value)
  showCheckOutForm.value = false
}

const handleProcessPayment = () => {
  emit('process-payment', paymentForm.value)
  showPaymentForm.value = false
}

const cancelEdit = () => {
  mode.value = 'view'
  initializeForm()
}

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString()
}

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleString()
}

const formatCurrency = (amount: string | number): string => {
  return Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

const formatStatusLabel = (status?: BookingStatus): string => {
  if (!status) return ''
  const labels = {
    [BookingStatus.PENDING]: 'Pending',
    [BookingStatus.CONFIRMED]: 'Confirmed',
    [BookingStatus.CHECKED_IN]: 'Checked In',
    [BookingStatus.CHECKED_OUT]: 'Checked Out',
    [BookingStatus.CANCELLED]: 'Cancelled',
  }
  return labels[status] || status
}

const formatPaymentStatusLabel = (status?: PaymentStatus): string => {
  if (!status) return ''
  const labels = {
    [PaymentStatus.NOT_PAID]: 'Not Paid',
    [PaymentStatus.PARTIAL]: 'Partial',
    [PaymentStatus.PAID]: 'Paid',
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status?: BookingStatus): string => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const classes = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [BookingStatus.CHECKED_IN]: 'bg-green-100 text-green-800',
    [BookingStatus.CHECKED_OUT]: 'bg-gray-100 text-gray-800',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusBadgeClass = (status?: PaymentStatus): string => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const classes = {
    [PaymentStatus.NOT_PAID]: 'bg-red-100 text-red-800',
    [PaymentStatus.PARTIAL]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.PAID]: 'bg-green-100 text-green-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getClientInitials = (name?: string): string => {
  if (!name) return '??'
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// Watchers and lifecycle
watch(
  () => props.booking,
  () => {
    initializeForm()
    loadFullBooking()
  },
  { immediate: true },
)

watch(
  () => props.mode,
  (newMode) => {
    mode.value = newMode
  },
)

onMounted(() => {
  initializeForm()
  loadFullBooking()
})
</script>
