# Accommodations Management API

## Accommodation Types

### GET /api/v1/accommodation-types/

Get list of accommodation types.

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "Standard Room",
    "description": "Basic room with standard amenities",
    "default_capacity": 2,
    "is_active": true,
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

### POST /api/v1/accommodation-types/

Create a new accommodation type.

**Request Body:**

```json
{
  "name": "Suite",
  "description": "Luxury suite with extra space",
  "default_capacity": 4,
  "is_active": true
}
```

### PUT /api/v1/accommodation-types/{accommodation_type_id}

Update accommodation type.

**Request Body (all fields optional):**

```json
{
  "name": "Updated name",
  "description": "Updated description",
  "default_capacity": 3,
  "is_active": false
}
```

### DELETE /api/v1/accommodation-types/{accommodation_type_id}

Delete accommodation type.

## Accommodations

### GET /api/v1/accommodations/

Get list of accommodations.

**Response (200):**

```json
[
  {
    "id": 1,
    "number": "101",
    "type_id": 1,
    "capacity": 2,
    "price_per_night": "150.00",
    "status": "available",
    "condition": "ok",
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
]
```

### POST /api/v1/accommodations/

Create a new accommodation.

**Request Body:**

```json
{
  "number": "102",
  "type_id": 1,
  "capacity": 2,
  "price_per_night": 150.0,
  "status": "available",
  "condition": "ok",
  "comments": "Optional comments"
}
```

### PUT /api/v1/accommodations/{accommodation_id}

Update accommodation details.

**Request Body (all fields optional):**

```json
{
  "number": "102A",
  "type_id": 2,
  "capacity": 3,
  "price_per_night": 180.0,
  "status": "maintenance",
  "condition": "minor",
  "comments": "Needs minor repairs"
}
```

### DELETE /api/v1/accommodations/{accommodation_id}

Delete accommodation.

**Response (200):**

```json
{
  "message": "Accommodation deleted successfully"
}
```

## Enums

**AccommodationStatus:**

- `available` - Available for booking
- `occupied` - Currently occupied
- `maintenance` - Under maintenance
- `out_of_order` - Out of order

**AccommodationCondition:**

- `ok` - Good condition
- `minor` - Minor issues
- `critical` - Critical issues
