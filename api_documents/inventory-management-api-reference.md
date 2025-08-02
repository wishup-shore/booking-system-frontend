# Inventory Management API

## Inventory Types

### GET /api/v1/inventory-types/

Get list of inventory types.

**Query Parameters:**

- `skip` (integer, default: 0) - Number of records to skip
- `limit` (integer, default: 100, max: 1000) - Number of records to return
- `active_only` (boolean, default: true) - Filter active types only

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "Towels",
    "is_active": true,
    "created_at": "2025-01-01T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Bed Linens",
    "is_active": true,
    "created_at": "2025-01-01T10:30:00Z"
  }
]
```

### POST /api/v1/inventory-types/

Create a new inventory type.

**Request Body:**

```json
{
  "name": "Beach Equipment",
  "is_active": true
}
```

### GET /api/v1/inventory-types/{inventory_type_id}

Get inventory type by ID.

### PUT /api/v1/inventory-types/{inventory_type_id}

Update inventory type.

**Request Body:**

```json
{
  "name": "Updated Type Name",
  "is_active": false
}
```

### DELETE /api/v1/inventory-types/{inventory_type_id}

Delete inventory type.

## Inventory Items

### GET /api/v1/inventory-items/

Get list of inventory items.

**Query Parameters:**

- `skip` (integer, default: 0) - Number of records to skip
- `limit` (integer, default: 100, max: 1000) - Number of records to return
- `type_id` (integer, optional) - Filter by inventory type ID
- `available_only` (boolean, default: false) - Filter available items only

**Response (200):**

```json
[
  {
    "id": 1,
    "number": "TWL001",
    "type_id": 1,
    "condition": "ok",
    "comments": "Fresh towel set",
    "created_at": "2025-01-01T11:00:00Z",
    "type": {
      "id": 1,
      "name": "Towels",
      "is_active": true,
      "created_at": "2025-01-01T10:00:00Z"
    }
  }
]
```

### POST /api/v1/inventory-items/

Create a new inventory item.

**Request Body:**

```json
{
  "number": "TWL002",
  "type_id": 1,
  "condition": "ok",
  "comments": "New towel set"
}
```

### GET /api/v1/inventory-items/{inventory_item_id}

Get inventory item by ID with type details.

### PUT /api/v1/inventory-items/{inventory_item_id}

Update inventory item.

**Request Body (all fields optional):**

```json
{
  "number": "TWL002-Updated",
  "type_id": 2,
  "condition": "minor",
  "comments": "Slightly worn"
}
```

### DELETE /api/v1/inventory-items/{inventory_item_id}

Delete inventory item.

### GET /api/v1/inventory-items/by-type/{type_id}/available

Get available inventory items of a specific type.

**Response (200):**

```json
[
  {
    "id": 1,
    "number": "TWL001",
    "type_id": 1,
    "condition": "ok",
    "comments": "Available for use",
    "created_at": "2025-01-01T11:00:00Z",
    "type": {
      "id": 1,
      "name": "Towels",
      "is_active": true,
      "created_at": "2025-01-01T10:00:00Z"
    }
  }
]
```

## Booking-Inventory Integration

### POST /api/v1/bookings/{booking_id}/inventory/{inventory_item_id}

Add an inventory item to a booking.

**Response (200):**

```json
{
  "message": "Inventory item added to booking successfully",
  "booking_id": 123,
  "item_id": 456
}
```

### DELETE /api/v1/bookings/{booking_id}/inventory/{inventory_item_id}

Remove an inventory item from a booking.

### GET /api/v1/bookings/{booking_id}/with-items

Get booking with inventory and custom items.

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
  "inventory_items": [
    {
      "id": 1,
      "number": "TWL001",
      "type_name": "Towels",
      "condition": "ok"
    }
  ],
  "custom_items": []
}
```

### POST /api/v1/bookings/with-items

Create a new booking with inventory and custom items.

**Request Body:**

```json
{
  "client_id": 1,
  "accommodation_id": 1,
  "check_in_date": "2025-08-10",
  "check_out_date": "2025-08-15",
  "is_open_dates": false,
  "guests_count": 2,
  "comments": "Booking with items",
  "inventory_items": [
    {
      "inventory_item_id": 1
    },
    {
      "inventory_item_id": 2
    }
  ],
  "custom_items": [
    {
      "custom_item_id": 1,
      "quantity": 2
    }
  ]
}
```

### POST /api/v1/bookings/open-dates/with-items

Create open-dates booking with inventory and custom items.

## Inventory Condition Enum

**InventoryCondition:**

- `ok` - Good condition
- `minor` - Minor issues, usable
- `critical` - Critical issues, needs repair/replacement
