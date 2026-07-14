# Shram-Saathi Frontend Requirements

## Project Overview
Build a responsive, interactive React + Vite frontend for a gig economy platform in Nepal with role-based authentication and separate dashboards for customers, merchants, and admins.

**Tech Stack**: React 19, Vite, Tailwind CSS v4, React Router, TanStack Query, Axios, React Hot Toast, Leaflet/react-leaflet

---

## 15. COMPLETED FEATURES

### Authentication ✅
- Auth choice page with role selection
- Customer login/register
- Merchant 3-step registration (account → profile → location with map)
- Admin login
- Protected routes with role-based access
- AuthContext with token persistence

### Home Page ✅
- Interactive hero section with gradient, animated counters, service grid
- Stats counter (workers, jobs, rating, districts) with scroll-triggered animation
- Dynamic service categories fetched from API with matching icons
- Feature cards (Verified Workers, Location Matching, Real Reviews)
- How It Works section with connecting line
- Testimonials section
- FAQ accordion with smooth transitions
- Full footer with links

### Customer Dashboard ✅
- Dashboard with stats, recent bookings, quick actions
- Service requests: create (with hybrid saved/custom location using LocationPicker map)
- Request detail with recommended workers (top 5 by score)
- Bookings: view, cancel, navigate to details
- Reviews: submit reviews for completed bookings with star ratings
- Profile management
- Browse workers with interactive map (worker markers, popups, request service flow)

### Merchant Dashboard ✅
- Dashboard with stats (services, rating, jobs count)
- Profile management (business info, locations with LocationPicker map)
- Services management (add/remove service categories with rates)
- Job management: view bids, active jobs, completed jobs, rejected
- Earnings page with transactions
- Reviews page showing customer reviews with rating distribution

### Admin Dashboard ✅
- Dashboard with platform stats (merchants, bookings, revenue, commission)
- Merchant management (verify, reject, suspend, resubmit)
- Transactions tracking with filters
- Service categories management (CRUD)
- Service requests overview
- Bookings overview
- Reviews management (view, verify, reject with detail modal)
- User management (roles/permissions)

### Reusable Components ✅
- LocationPicker: interactive map with Leaflet/OpenStreetMap, geolocation, address search (Nominatim), marker drag
- StatusBadge, Modal, ConfirmDialog, DataTable, EmptyState, LoadingSpinner, ErrorMessage
- MerchantCard with rating, distance, score display

### API Layer ✅
- Axios client with auth interceptors (smart 401 handling for public pages) and extractData helper
- Service files: auth, booking, merchant, customer, admin, recommendation, review, user, category, merchantLocation, request

---

## 16. CURRENT ARCHITECTURE & KNOWN ISSUES

### Home Page → Browse Flow
**Current**: Home page category cards link to `/auth/customer/register` for guests and don't work for logged-in users.

**Recommendation**: 
- Add auth-aware logic: if user is logged in, link to `/customer/browse?category={id}`; if guest, link to `/auth/customer/register`
- This requires reading auth state from AuthContext on the home page

### Browse Workers → Direct Hire Flow
**Current**: Browse Workers shows a map with worker markers and "Request Service" buttons, but clicking creates a **public service request** (not a direct notification to that specific merchant).

**How the current system works**:
1. Customer searches by category + optional location
2. Recommendation engine returns nearby workers sorted by score
3. Customer clicks "Request Service" → creates a service request in the specified category
4. ALL merchants in that category can see and bid on the request
5. No specific merchant gets notified

**What's missing for direct hire**:
- Direct hire API (customer selects a specific merchant, not just a category)
- Real-time notification system (WebSocket/polling) to alert the merchant
- Merchant acceptance flow for direct requests

**Recommended future approach**:
- Create a `POST /direct-hires` endpoint that sends a request to a specific merchant
- Add notification table + API for merchants to see incoming direct requests
- Optionally: real-time via WebSocket (Laravel Broadcasting + Pusher)
- Simpler alternative: polling every 30 seconds on merchant dashboard

### Transaction Creation
**Fixed**: `BookingService::completeWork()` now calls `AdminService::createTransaction()` to create a 10% commission transaction when a booking is completed.

### Review Verification
**Fixed**: Admin can verify/unverify reviews via `PUT /admin/reviews/{id}/verify` and `PUT /admin/reviews/{id}/reject`.

---

## 17. REMAINING WORK

### HIGH PRIORITY

#### Frontend
- [ ] **Home page auth-aware categories** — if logged in, category cards link to Browse; if guest, link to Register
- [ ] **Merchant booking detail page** — `/merchant/bookings/:bookingId` needs full detail view with timeline, actions (start/complete)
- [ ] **Customer booking detail** — enhance with review status, link to review form
- [ ] **Pagination** — add pagination to all list views (bookings, requests, reviews, transactions)
- [ ] **Admin Reviews page** — use actual review data from `/admin/reviews` (DONE — verify/reject buttons working)

#### Backend
- [ ] **BookingService::completeWork eager loading** — should load `customer`, `serviceRequest` relations
- [ ] **Service-categories endpoint** — make public (no auth required) for home page category display
- [ ] **Seed data** — add more test merchants with locations in different cities for better recommendation testing

### MEDIUM PRIORITY

#### Frontend
- [ ] **Direct hire flow** — customer selects a specific worker, not just category
- [ ] **Merchant profile public view** — show merchant details when customer clicks from Browse/map popup
- [ ] **Search & filter enhancements** — price range, rating filter, distance slider on Browse page
- [ ] **Image upload** — merchant logo upload, service request images
- [ ] **Dark mode toggle** — localStorage preference

#### Backend
- [ ] **Direct hire endpoint** — `POST /direct-hires` to send request to specific merchant
- [ ] **Notification system** — notification table + API for merchants to see incoming requests
- [ ] **Merchant availability** — online/offline status toggle

### LOW PRIORITY

#### Frontend
- [ ] **Charts** — monthly earnings trend, admin revenue charts (recharts is installed)
- [ ] **Export** — PDF/CSV export for merchant earnings, admin transactions
- [ ] **Chat/messaging** — between customer and merchant for a booking
- [ ] **PWA** — service worker for offline support
- [ ] **Testing** — Vitest component tests, Playwright E2E tests
- [ ] **Code splitting** — lazy load route components for performance

#### Backend
- [ ] **Push notifications** — Firebase or similar for mobile
- [ ] **Geohash seeding** — ensure all existing locations have geohash values populated
- [ ] **Service request images** — S3/local file upload for request attachments

---

## 18. BACKEND ENDPOINTS - REFERENCE

### Response Format
```json
{
  "success": true/false,
  "message": "...",
  "data": {...},
  "meta": {...}
}
```

### Authentication
- `POST /register` - Customer registration (auto-login)
- `POST /login` - General login (customer/merchant/admin)
- `POST /worker/register/step1` - Merchant step 1 (auto-login, returns token)
- `POST /worker/register/step2/{userId}` - Merchant step 2
- `POST /worker/register/step3/{merchantId}` - Merchant step 3 (complete registration)

### Service Categories
- `GET /service-categories` - List all categories (auth required — should be made public)

### User Locations
- `GET /user/locations` - Get authenticated user's locations
- `POST /user/locations` - Create new location
- `PUT /user/locations/{id}` - Update location
- `DELETE /user/locations/{id}` - Delete location

### Merchant Locations
- `GET /merchant-locations` - List all
- `POST /merchant-locations` - Create
- `GET /merchant-locations/{id}` - Get single
- `PUT /merchant-locations/{id}` - Update
- `DELETE /merchant-locations/{id}` - Delete

### Service Requests
- `GET /service-requests` - List with filters
- `POST /service-requests` - Create request
- `GET /service-requests/{id}` - Get single
- `PUT /service-requests/{id}` - Update
- `DELETE /service-requests/{id}` - Cancel
- `GET /service-requests/user/list` - Get user's requests
- `GET /service-requests/available` - Get available requests (merchant)

### Recommendations
- `GET /recommendations/service-request/{id}` - Get top 5 recommended workers
- `GET /recommendations/category/{categoryId}` - Get workers by category (with optional lat/lng for distance)

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - List bookings
- `GET /bookings/{id}` - Get single
- `DELETE /bookings/{id}` - Cancel
- `GET /customer/bookings` - Customer's bookings
- `GET /merchant/bookings` - Merchant's jobs
- `PUT /bookings/{id}/accept` - Accept bid
- `PUT /bookings/{id}/reject` - Reject/withdraw bid
- `PUT /bookings/{id}/start` - Start work
- `PUT /bookings/{id}/complete` - Complete work (creates transaction)

### Reviews
- `POST /reviews` - Submit review
- `GET /reviews/{id}` - Get single
- `PUT /reviews/{id}` - Update review
- `DELETE /reviews/{id}` - Delete review
- `GET /merchants/{id}/reviews` - Merchant's reviews
- `GET /user/reviews` - User's reviews

### Merchant Profile
- `GET /merchants` - List all
- `GET /merchants/{id}` - Get single with services, locations
- `POST /merchants/{id}/service-categories` - Add service
- `PUT /merchants/{id}/service-categories/{catId}` - Update service
- `DELETE /merchants/{id}/service-categories/{catId}` - Remove service

### Admin
- `GET /admin/dashboard` - Platform stats
- `GET /admin/merchants/pending` - Pending merchants
- `PUT /admin/merchants/{id}/verify` - Verify merchant
- `PUT /admin/merchants/{id}/reject` - Reject merchant
- `PUT /admin/merchants/{id}/suspend` - Suspend merchant
- `PUT /admin/merchants/{id}/resubmit` - Resubmit for review
- `GET /admin/bookings` - All bookings
- `GET /admin/transactions` - All transactions
- `GET /admin/reviews` - All reviews
- `PUT /admin/reviews/{id}/verify` - Verify review
- `PUT /admin/reviews/{id}/reject` - Reject review

### Roles & Permissions
- `GET /roles` - List roles
- `POST /roles` - Create role
- `DELETE /roles/{name}` - Delete role
- `POST /users/{id}/roles` - Assign role
- `PUT /users/{id}/roles` - Sync roles
- `DELETE /users/{id}/roles/{name}` - Remove role
- `GET /users/{id}/roles` - Get user roles

### FAQs
- `GET /faqs` - List FAQs

---

## 19. ARCHITECTURE DECISIONS

### Pricing Model
- **Project-based** (Nepal market): Customer sets budget range, worker proposes agreed_rate within range
- No hourly billing — fixed price per job

### Commission
- 10% platform commission calculated on booking completion
- Transaction created automatically when merchant completes work

### Location System
- **Geohash pre-filter** for performance: cuts dataset before Haversine calculation
- **Hybrid location**: customers can use saved location OR enter custom coordinates
- **Primary location** per merchant for recommendation matching

### Review System
- Reviews auto-verified on submission (admin can unverify if needed)
- Merchant avg_rating auto-updated via Observer when reviews change

### Booking Flow
```
Customer creates request → Merchants bid → Customer selects bid →
Merchant starts work → Merchant completes → Transaction created →
Customer leaves review → Merchant rating updated
```

---

**Last updated**: 2026-07-14
**Frontend status**: ~90% complete (core flows working, some polish remaining)
**Backend status**: 100% complete (all endpoints functional)
