# Clients Management API

## Clients

### GET /api/v1/clients/

Get list of clients with optional filtering.

**Query Parameters:**

- `skip` (integer, default: 0) - Number of records to skip
- `limit` (integer, default: 100, max: 1000) - Number of records to return
- `search` (string, optional) - Search by name, phone, or email

**Response (200):**

```json
[
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
]
```

### POST /api/v1/clients/

Create a new client.

**Request Body:**

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1987654321",
  "email": "jane@example.com",
  "social_links": {
    "telegram": "@janesmith"
  },
  "car_numbers": ["DEF456"],
  "photo_url": "https://example.com/jane.jpg",
  "rating": 5.0,
  "comments": "New client",
  "group_id": 2
}
```

### GET /api/v1/clients/{client_id}

Get client details by ID.

### PUT /api/v1/clients/{client_id}

Update client information.

**Request Body (all fields optional):**

```json
{
  "first_name": "Updated Name",
  "phone": "+1111111111",
  "rating": 4.0,
  "comments": "Updated comments"
}
```

### DELETE /api/v1/clients/{client_id}

Delete client.

### GET /api/v1/clients/{client_id}/stats

Get client statistics including visit count and total spent.

**Response (200):**

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "social_links": {
    "telegram": "@johndoe"
  },
  "car_numbers": ["ABC123"],
  "photo_url": "https://example.com/photo.jpg",
  "rating": 4.5,
  "comments": "Regular customer",
  "group_id": 1,
  "created_at": "2025-01-01T10:00:00Z",
  "group": {
    "id": 1,
    "name": "VIP Clients",
    "created_at": "2025-01-01T09:00:00Z"
  },
  "visits_count": 5,
  "total_spent": 2500.0
}
```

## Client Groups

### GET /api/v1/clients/groups/

Get list of client groups.

**Response (200):**

```json
[
  {
    "id": 1,
    "name": "VIP Clients",
    "created_at": "2025-01-01T09:00:00Z"
  }
]
```

### POST /api/v1/clients/groups/

Create a new client group.

**Request Body:**

```json
{
  "name": "Corporate Clients"
}
```

### GET /api/v1/clients/groups/{group_id}

Get client group by ID.

### PUT /api/v1/clients/groups/{group_id}

Update client group.

**Request Body:**

```json
{
  "name": "Updated Group Name"
}
```

### DELETE /api/v1/clients/groups/{group_id}

Delete client group.

## Notes

- `social_links` is a flexible object that can contain any social media platform as key-value pairs
- `car_numbers` is an array of strings for multiple car registrations
- `rating` is a decimal number typically from 0 to 5
- All optional fields can be null or omitted
