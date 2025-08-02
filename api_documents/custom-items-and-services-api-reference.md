# Custom Items and Services API

## Custom Items Management

Custom items represent additional services or products that can be added to bookings (e.g., breakfast, late checkout, spa services, etc.).

### GET /api/v1/custom-items/

Get list of custom items/services.

**Query Parameters:**

- `skip` (integer, default: 0) - Number of records to skip
- `limit` (integer, default: 100, max: 1000) - Number of records to return
- `active_only` (boolean, default: true) - Filter active items only

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "Continental Breakfast",
    "description": "Fresh breakfast served in the dining area",
    "price": "25.00",
    "is_active": true,
    "created_at": "2025-01-01T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Late Checkout",
    "description": "Checkout after 12:00 PM",
    "price": "50.00",
    "is_active": true,
    "created_at": "2025-01-01T10:30:00Z"
  }
]
```

### POST /api/v1/custom-items/

Create a new custom item/service.

**Request Body:**

```json
{
  "name": "Airport Transfer",
  "description": "Round-trip airport transportation",
  "price": 75.0,
  "is_active": true
}
```

### GET /api/v1/custom-items/{custom_item_id}

Get custom item by ID.

**Response (200):**

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

### PUT /api/v1/custom-items/{custom_item_id}

Update custom item.

**Request Body (all fields optional):**

```json
{
  "name": "Premium Breakfast",
  "description": "Enhanced breakfast with premium options",
  "price": 35.0,
  "is_active": true
}
```

### DELETE /api/v1/custom-items/{custom_item_id}

Delete custom item.

**Response (200):**

```json
{
  "message": "Custom item deleted successfully"
}
```

## Booking-Custom Items Integration

### POST /api/v1/bookings/{booking_id}/custom-items/{custom_item_id}

Add a custom item to a booking.

**Query Parameters:**

- `quantity` (integer, default: 1) - Quantity of the custom item

**Response (200):**

```json
{
  "message": "Custom item added to booking successfully",
  "booking_id": 123,
  "item_id": 456
}
```

### DELETE /api/v1/bookings/custom-items/{booking_custom_item_id}

Remove a custom item from a booking.

**Note:** This endpoint uses the booking_custom_item_id (the ID of the relationship between booking and custom item), not the custom_item_id.

**Response (200):**

```json
{
  "message": "Custom item removed from booking successfully",
  "booking_id": 123,
  "item_id": 456
}
```

### GET /api/v1/bookings/{booking_id}/full-details

Get booking with all details including client, accommodation, and items.

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
  "total_amount": "800.00",
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
  },
  "inventory_items": [
    {
      "id": 1,
      "number": "TWL001",
      "type_name": "Towels",
      "condition": "ok"
    }
  ],
  "custom_items": [
    {
      "id": 1,
      "booking_custom_item_id": 15,
      "name": "Continental Breakfast",
      "description": "Fresh breakfast served in the dining area",
      "price": "25.00",
      "quantity": 2,
      "total_price": "50.00"
    }
  ]
}
```

## Usage Examples

### Adding Breakfast Service to Booking

```http
POST /api/v1/bookings/123/custom-items/1?quantity=2
```

This adds 2 breakfast services to booking #123.

### Creating Booking with Services

```json
POST /api/v1/bookings/with-items
{
  "client_id": 1,
  "accommodation_id": 1,
  "check_in_date": "2025-08-10",
  "check_out_date": "2025-08-15",
  "guests_count": 2,
  "comments": "Honeymoon package",
  "custom_items": [
    {
      "custom_item_id": 1,
      "quantity": 2
    },
    {
      "custom_item_id": 2,
      "quantity": 1
    }
  ]
}
```

## Price Handling

- Prices are stored as decimal strings (e.g., "25.00") for precision
- When adding custom items to bookings, the total booking amount should be recalculated
- Quantity allows for multiple units of the same service (e.g., breakfast for multiple days)
