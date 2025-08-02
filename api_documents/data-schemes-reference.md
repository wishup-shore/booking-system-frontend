# Data Schemas Reference

## Core Entities

### User Schema

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "staff" | "viewer",
  "is_active": true
}
```

### Client Schema

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "social_links": {
    "telegram": "@johndoe",
    "instagram": "johndoe_insta"
  },
  "car_numbers": ["ABC123", "XYZ789"],
  "photo_url": "https://example.com/photo.jpg",
  "rating": 4.5,
  "comments": "Regular customer",
  "group_id": 1,
  "created_at": "2025-01-01T10:00:00Z",
  "group": {
    "id": 1,
    "name": "VIP Clients",
    "created_at": "2025-01-01T09:00:00Z"
  }
}
```

### Accommodation Schema

```json
{
  "id": 1,
  "number": "101",
  "type_id": 1,
  "capacity": 2,
  "price_per_night": "150.00",
  "status": "available" | "occupied" | "maintenance" | "out_of_order",
  "condition": "ok" | "minor" | "critical",
  "comments": "Recently renovated",
  "created_at": "2025-01-01T10:00:00Z",
  "type": {
    "id": 1,
    "name": "Standard Room",
    "description": "Basic room",
    "default_capacity": 2,
    "is_active": true,
    "created_at": "2025-01-01T09:00:00Z"
  }
}
```

### Booking Schema

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
  "status": "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled",
  "payment_status": "not_paid" | "partial" | "paid",
  "total_amount": "750.00",
  "paid_amount": "300.00",
  "actual_check_in": "2025-08-10T15:30:00Z",
  "actual_check_out": "2025-08-15T11:00:00Z",
  "created_at": "2025-08-01T10:00:00Z"
}
```

### Inventory Item Schema

```json
{
  "id": 1,
  "number": "TWL001",
  "type_id": 1,
  "condition": "ok" | "minor" | "critical",
  "comments": "Fresh towel set",
  "created_at": "2025-01-01T11:00:00Z",
  "type": {
    "id": 1,
    "name": "Towels",
    "is_active": true,
    "created_at": "2025-01-01T10:00:00Z"
  }
}
```

### Custom Item Schema

```json
{
  "id": 1,
  "name": "Continental Breakfast",
  "description": "Fresh breakfast served in the dining area",
  "price": "25.00",
  "is_active": true,
  "created_at": "2025-01-01T10:00:00Z"
}
```

## Create/Update Schemas

### Client Create/Update

```json
{
  "first_name": "Jane", // required for create
  "last_name": "Smith", // required for create
  "phone": "+1987654321", // optional
  "email": "jane@example.com", // optional
  "social_links": {
    // optional object
    "telegram": "@janesmith"
  },
  "car_numbers": ["DEF456"], // optional array
  "photo_url": "https://example.com/jane.jpg", // optional
  "rating": 5.0, // optional, default 0.0
  "comments": "New client", // optional
  "group_id": 2 // optional
}
```

### Booking Create

```json
{
  "client_id": 1, // required
  "accommodation_id": 1, // required
  "check_in_date": "2025-08-10", // optional for open dates
  "check_out_date": "2025-08-15", // optional for open dates
  "is_open_dates": false, // optional, default false
  "guests_count": 2, // required, must be > 0
  "comments": "Special requests" // optional
}
```

### Booking with Items Create

```json
{
  "client_id": 1,
  "accommodation_id": 1,
  "check_in_date": "2025-08-10",
  "check_out_date": "2025-08-15",
  "guests_count": 2,
  "comments": "Booking with items",
  "inventory_items": [
    // optional array
    {
      "inventory_item_id": 1
    }
  ],
  "custom_items": [
    // optional array
    {
      "custom_item_id": 1,
      "quantity": 2 // required, must be > 0
    }
  ]
}
```

## Calendar and Availability Schemas

### Calendar Event

```json
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
```

### Availability Response

```json
{
  "accommodation_id": 5,
  "start_date": "2025-12-15",
  "end_date": "2025-12-18",
  "is_available": true
}
```

### Available Accommodation

```json
{
  "id": 1,
  "number": "101",
  "type_name": "Standard Room",
  "capacity": 2,
  "price_per_night": "150.00",
  "status": "available"
}
```

### Calendar Statistics

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

## Standard Responses

### Success Message

```json
{
  "message": "Operation completed successfully"
}
```

### Action Response (for add/remove operations)

```json
{
  "message": "Inventory item added to booking successfully",
  "booking_id": 123,
  "item_id": 456
}
```

### Validation Error

```json
{
  "detail": [
    {
      "loc": ["field_name"],
      "msg": "Error message",
      "type": "validation_error"
    }
  ]
}
```

## Field Types and Validation

- **Dates**: ISO format strings (YYYY-MM-DD)
- **Datetimes**: ISO format strings with timezone (YYYY-MM-DDTHH:mm:ssZ)
- **Prices**: Decimal strings for precision (e.g., "150.00")
- **IDs**: Positive integers
- **Phone**: String, flexible format
- **Email**: String with email validation
- **Rating**: Number between 0 and 5
- **Guests Count**: Integer > 0
- **Quantity**: Integer > 0

## Required vs Optional Fields

**Always Required:**

- first_name, last_name (clients)
- client_id, accommodation_id, guests_count (bookings)
- number, type_id (accommodations/inventory)
- name (types and custom items)

**Contextually Required:**

- check_in_date, check_out_date (only for non-open-dates bookings)
- price (custom items)

**Always Optional:**

- comments, description fields
- phone, email (clients)
- social_links, car_numbers, photo_url (clients)
