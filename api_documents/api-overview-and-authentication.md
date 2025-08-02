# Booking System API - Overview and Authentication

## General Information

- **API Version**: 1.0.0
- **Base URL**: `/api/v1`
- **Description**: Booking system for accommodations
- **Authentication**: HTTP Bearer token

## Authentication Endpoints

### POST /api/v1/auth/login

Login to the system and get access token.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "access_token": "string",
  "token_type": "string"
}
```

### POST /api/v1/auth/register

Register a new user in the system.

**Request Body:**

```json
{
  "username": "string",
  "email": "user@example.com",
  "role": "staff" | "viewer",
  "is_active": true,
  "password": "string"
}
```

**Response (200):**

```json
{
  "message": "User created successfully",
  "user_id": 123
}
```

### GET /api/v1/auth/me

Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "staff",
  "is_active": true
}
```

## Security

All endpoints except login require Bearer token authentication:

```
Authorization: Bearer <your_access_token>
```

## Error Responses

All endpoints may return validation errors in this format:

```json
{
  "detail": [
    {
      "loc": ["field_name"],
      "msg": "Error message",
      "type": "error_type"
    }
  ]
}
```
