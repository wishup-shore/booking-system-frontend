# Bookings Management API

## Basic Booking Operations

### GET /api/v1/bookings/

Get list of bookings with optional filtering.

**Query Parameters:**

- `skip` (integer, default: 0) - Number of records to skip
- `limit` (integer, default: 100, max: 1000) - Number of records to return
- `status` (BookingStatus, optional) - Filter by booking status

**Response (200):**

```json
[
  {
    "id": 1,
    "client_id": 1,
    "accommodation_id": 1,
    "check_in_date": "2025-08-10",
    "check_out_date": "2025-08-15",
    "is_open_dates": false,
    "guests_count": 2,
    "comments": "Anniversary celebration",
    "status": "confirmed",
    "payment_status": "partial",
    "total_amount": "750.00",
    "paid_amount": "300.00",
    "actual_check_in": null,
    "actual_check_out": null,
    "created_at": "2025-08-01T10:00:00Z"
  }
]
```

### POST /api/v1/bookings/

Create a new booking.

**Request Body:**

```json
{
  "client_id": 1,
  "accommodation_id": 1,
  "check_in_date": "2025-08-10",
  "check_out_date": "2025-08-15",
  "is_open_dates": false,
  "guests_count": 2,
  "comments": "Special requests"
}
```

### GET /api/v1/bookings/{booking_id}

Get booking details with client and accommodation information.

**Response (200):**

```json
{
  "id": 1,
  "client_id": 1,
  "accommodation_id": 1,
  "check_in_date": "2025-08-10",
  "check_out_date": "2025-08-15",
  "is_open_dates": false,
  "guests_count": 2,
  "comments": "Anniversary celebration",
  "status": "confirmed",
  "payment_status": "partial",
  "total_amount": "750.00",
  "paid_amount": "300.00",
  "actual_check_in": null,
  "actual_check_out": null,
  "created_at": "2025-08-01T10:00:00Z",
  "client": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "accommodation": {
    "id": 1,
    "number": "101",
    "type_name": "Standard Room",
    "capacity": 2,
    "price_per_night": "150.00"
  }
}
```

### PUT /api/v1/bookings/{booking_id}

Update booking details.

### DELETE /api/v1/bookings/{booking_id}

Delete booking (only if not checked-in or completed).

## Open Dates Bookings

### POST /api/v1/bookings/open-dates

Create booking with flexible dates.

**Request Body:**

```json
{
  "client_id": 1,
  "accommodation_id": 1,
  "guests_count": 2,
  "comments": "Flexible dates booking",
  "is_open_dates": true
}
```

### GET /api/v1/bookings/open

Get all open-dates bookings for planning.

### PUT /api/v1/bookings/{booking_id}/set-dates

Set specific dates for an open-dates booking.

**Request Body:**

```json
{
  "check_in_date": "2025-08-10",
  "check_out_date": "2025-08-15"
}
```

## Booking Status Management

### POST /api/v1/bookings/{booking_id}/checkin

Process check-in for a booking.

**Request Body:**

```json
{
  "actual_check_in": "2025-08-10T15:30:00Z",
  "comments": "Early check-in"
}
```

### POST /api/v1/bookings/{booking_id}/checkout

Process check-out for a booking.

**Request Body:**

```json
{
  "actual_check_out": "2025-08-15T11:00:00Z",
  "comments": "On-time checkout"
}
```

### POST /api/v1/bookings/{booking_id}/cancel

Cancel a booking.

**Query Parameters:**

- `reason` (string, optional) - Cancellation reason

## Payment Management

### POST /api/v1/bookings/{booking_id}/payment

Add payment to booking.

**Request Body:**

```json
{
  "amount": 200.0,
  "comments": "Credit card payment"
}
```

## Availability and Calendar

### GET /api/v1/bookings/availability/accommodations

Get available accommodations for given dates.

**Query Parameters:**

- `start_date` (date, required) - Check-in date (YYYY-MM-DD)
- `end_date` (date, required) - Check-out date (YYYY-MM-DD)
- `capacity` (integer, optional) - Minimum capacity needed

**Response (200):**

```json
[
  {
    "id": 1,
    "number": "101",
    "type_name": "Standard Room",
    "capacity": 2,
    "price_per_night": "150.00",
    "status": "available"
  }
]
```

### GET /api/v1/bookings/availability/check

Check if specific accommodation is available for given dates.

**Query Parameters:**

- `accommodation_id` (integer, required) - Accommodation ID
- `start_date` (date, required) - Check-in date
- `end_date` (date, required) - Check-out date

**Response (200):**

```json
{
  "accommodation_id": 5,
  "start_date": "2025-12-15",
  "end_date": "2025-12-18",
  "is_available": true
}
```

### GET /api/v1/bookings/calendar/events

Get calendar events (bookings) for calendar display.

**Query Parameters:**

- `start_date` (date, required) - Start date (YYYY-MM-DD)
- `end_date` (date, required) - End date (YYYY-MM-DD)

**Response (200):**

```json
[
  {
    "id": 1,
    "title": "John Doe - Room 101",
    "start": "2025-08-10",
    "end": "2025-08-15",
    "accommodation_id": 1,
    "accommodation_number": "101",
    "client_name": "John Doe",
    "status": "confirmed",
    "is_open_dates": false
  }
]
```

### GET /api/v1/bookings/calendar/occupancy

Get calendar occupancy data for date range.

### GET /api/v1/bookings/calendar/occupancy/{year}/{month}

Get calendar occupancy for a specific month.

### GET /api/v1/bookings/calendar/statistics

Get occupancy statistics for date range.

**Response (200):**

```json
{
  "total_accommodations": 50,
  "occupied_nights": 320,
  "available_nights": 180,
  "occupancy_rate": 64.0,
  "total_revenue": "48000.00",
  "average_daily_rate": "150.00",
  "revenue_per_available_room": "96.00",
  "period_start": "2025-01-01",
  "period_end": "2025-01-31"
}
```

## Booking Enums

**BookingStatus:**

- `pending` - Pending confirmation
- `confirmed` - Confirmed booking
- `checked_in` - Guest has checked in
- `checked_out` - Guest has checked out
- `cancelled` - Booking cancelled

**PaymentStatus:**

- `not_paid` - No payment received
- `partial` - Partially paid
- `paid` - Fully paid
