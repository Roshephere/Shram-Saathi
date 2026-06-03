# Shram-Saathi Frontend

React + Vite frontend for the Shram-Saathi local service marketplace.

## Setup

```bash
npm install
cp .env.example .env
```

Configure `VITE_API_BASE_URL` in `.env` (default: `http://localhost:8000/api`).

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- TanStack Query
- Axios
- React Hot Toast
- Lucide React Icons

## Project Structure

```
src/
  api/          - API client and service modules
  components/
    ui/         - Reusable UI components
  constants/    - Role, status, route constants
  context/      - Auth context provider
  hooks/        - Custom hooks (useAuth)
  layouts/      - Public and dashboard layouts
  pages/
    public/     - Landing, Login, Register
    customer/   - Customer dashboard and pages
    merchant/   - Merchant dashboard and pages
    admin/      - Admin panel pages
```

## Role Detection

The backend uses Spatie Laravel Permission with roles: `customer`, `worker`, `admin`.
The User model appends a `role` attribute to JSON responses for frontend role detection.

## Pending Backend Endpoints

- `GET /api/users` — User listing (admin)
- `GET|POST|PUT|DELETE /api/service-requests` — Service request CRUD (controller is a stub)
- `GET|POST|PUT|DELETE /api/merchant-reviews` — Review CRUD (controller is a stub)
- `GET|POST|PUT|DELETE /api/bookings` — Booking management (no model/controller exists)
