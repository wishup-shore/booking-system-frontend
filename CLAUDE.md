# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager:** Uses Bun (bun.lock present)

```bash
# Install dependencies
bun install

# Development server with hot reload
bun dev

# Production build with type checking
bun run build

# Type checking only
bun run type-check

# Linting and formatting
bun lint          # ESLint with auto-fix
bun run format    # Prettier formatting

# Preview production build
bun run preview
```

## Architecture Overview

**Stack:** Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia

This is a booking system frontend for accommodation management with authentication and dashboard functionality.

### Core Structure

- **State Management:** Pinia stores with composition API pattern
- **Routing:** Vue Router with authentication guards
- **API Layer:** Axios client with interceptors for auth and error handling
- **Styling:** Tailwind CSS with PostCSS configuration
- **UI Components:** Headless UI, Heroicons, and various specialized libraries

### Key Directories

- `src/stores/` - Pinia stores (auth.ts for authentication state)
- `src/api/` - API client setup and service modules
- `src/views/` - Main page components (Login, Dashboard, Accommodations)
- `src/types/` - TypeScript type definitions
- `src/services/` - Business logic services
- `src/composables/` - Reusable Vue composition functions

### Authentication Flow

- Uses JWT tokens stored in localStorage
- API client automatically adds Bearer tokens to requests
- Router guards check authentication for protected routes
- Automatic redirect to login on 401 responses

### API Integration

- Base URL configurable via `VITE_API_BASE_URL` environment variable
- Default backend: `http://localhost:8000`
- Axios interceptors handle authentication and error responses
- Services follow separation of concerns pattern
- **Full OpenAPI Compliance:** All API endpoints match the OpenAPI specification in `openapi.json`

### Data Flow Architecture

**Three-Layer Architecture:**
1. **Services Layer** (`src/services/`) - Direct API communication with OpenAPI endpoints
2. **Store Layer** (`src/stores/`) - Pinia stores that consume services and manage state
3. **Component Layer** (`src/views/`, `src/components/`) - Vue components that use stores via composables

**Key Stores:**
- `auth.ts` - Authentication and user management
- `bookings.ts` - Complete booking lifecycle (creation, calendar, availability, payments)
- `clients.ts` - Client management with search, pagination, and groups
- `accommodations.ts` - Accommodation and accommodation type management with availability
- `inventoryTypes.ts`, `inventoryItems.ts`, `customItems.ts` - Inventory management

### Composables Pattern

**Core Composables:**
- `useErrorHandler` - Centralized error handling with user-friendly messages
- `useAvailability` - Real-time accommodation availability checking
- `useCalendar` - Calendar state management and navigation
- `useBookingLifecycle` - Booking status management and workflows
- `useClientManagement` - Client operations with search and pagination

### Booking System Features

**Complete Booking Lifecycle:**
- Create bookings with availability validation
- Open-dates bookings for flexible scheduling
- Check-in/check-out processes with custom data
- Payment processing and tracking
- Booking cancellation with reason tracking
- Calendar integration with events and statistics

**Real-time Features:**
- Availability checking during booking creation
- Calendar events with occupancy statistics
- Live dashboard metrics
- Conflict detection and alternative suggestions

### Error Handling

**Comprehensive Error System:**
- Centralized error handling via `useErrorHandler` composable
- API error transformation with user-friendly messages
- Validation error parsing from 422 responses
- Automatic retry mechanisms and user feedback
- Error logging for debugging

### UI Libraries

- **FullCalendar:** Calendar components for booking visualization
- **Chart.js + Vue-ChartJS:** Data visualization
- **Vue Toastification:** Notification system
- **Headless UI:** Accessible UI components
- **VeeValidate:** Form validation

### Build Configuration

- **Vite:** Build tool with Vue plugin
- **TypeScript:** Strict type checking with vue-tsc
- **ESLint + Prettier:** Code quality and formatting
- **Path alias:** `@/` maps to `src/`
- **Vue DevTools:** Development debugging support

### OpenAPI Integration

The system is fully integrated with the backend OpenAPI specification:
- All service methods match OpenAPI endpoints exactly
- TypeScript types generated from API schemas
- Complete CRUD operations for all entities
- Advanced features like calendar statistics, availability checking, and booking workflows

**Key Integration Points:**
- Authentication with login/registration
- Real-time availability checking in booking flows
- Calendar integration with occupancy statistics
- Client management with search and pagination
- Complete booking lifecycle management
- Inventory and custom items integration