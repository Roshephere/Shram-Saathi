# Shram-Saathi Frontend Requirements

## Project Overview
Build a responsive, interactive React + Vite frontend for a gig economy platform in Nepal with role-based authentication and separate dashboards for customers, merchants, and admins.

**Tech Stack**: React 19, Vite, Tailwind CSS v4, React Router, TanStack Query, Axios, React Hot Toast

---

## 1. AUTHENTICATION SYSTEM

### 1.1 Auth Choice Page
- **Route**: `/auth/choose`
- **Purpose**: Let users select their role before login/register
- **Components**:
  - Hero section with platform name and tagline
  - Two prominent buttons: "I'm a Customer" → `/auth/customer/login` and "I'm a Service Provider" → `/auth/merchant/login`
  - Admin link in footer (small text)
  - Responsive (full-width buttons on mobile)
  - Smooth hover animations

### 1.2 Customer Authentication

#### Login Page `/auth/customer/login`
- Email or Phone input (toggle between them)
- Password field with show/hide toggle
- "Login" button
- "Don't have account? Register" link
- "Login as Merchant Instead?" link
- "Forgot Password?" link
- Google OAuth button
- Loading state on submit
- Error toast notifications
- Mobile: Single column, full-width inputs

#### Register Page `/auth/customer/register`
- Full Name input
- Email input
- Phone input
- Password input with strength indicator
- Confirm Password input
- Terms & Conditions checkbox
- "Register" button
- "Already have account? Login" link
- Inline validation errors
- Success → Auto-login → Redirect to `/customer/dashboard`
- Mobile responsive

### 1.3 Merchant Authentication

#### Login Page `/auth/merchant/login`
- Same as customer login
- Professional branding
- "Login as Customer Instead?" link

#### Multi-Step Registration `/auth/merchant/register`

**Step 1** - Account Creation (Route: `/auth/merchant/register/step1`)
- Full Name input
- Email input
- Phone input
- Password input with strength indicator
- Confirm Password input
- "Next" button
- Backend: `POST /worker/register/step1`
- Store registration_step=1 in localStorage
- Return token for auto-login

**Step 2** - Profile Setup (Route: `/auth/merchant/register/step2/{userId}`)
- Business Name input
- Phone input
- PAN Number input
- Logo upload (image preview)
- Service Categories (checkbox list from API: `GET /service-categories`)
- For each category: show option to add base rate
- "Back" button → Return to Step 1
- "Next" button → Move to Step 3
- Backend: `POST /worker/register/step2/{userId}`
- Store registration_step=2 in localStorage

**Step 3** - Location Setup (Route: `/auth/merchant/register/step3/{merchantId}`)
- Use Browser Geolocation API to get current location
- Show map with selected coordinates
- Latitude/Longitude inputs (editable)
- Address input (autocomplete from map)
- "Set as Primary Location" checkbox
- "Back" button → Return to Step 2
- "Complete Registration" button
- Backend: `POST /worker/register/step3/{merchantId}`
- Success → Auto-login → Redirect to `/merchant/dashboard`

**Progress Indicator**:
- Show "Step 1/3", "Step 2/3", "Step 3/3" with visual progress bar

### 1.4 Admin Login `/auth/admin/login`
- Email input
- Password input
- Login button
- Redirect to `/admin/dashboard` on success

---

## 2. ROLE-BASED ROUTING

### Protected Routes Middleware
Create `<ProtectedRoute>` component that:
- Checks localStorage for token
- Verifies role from AuthContext
- Redirects to `/auth/choose` if not logged in
- Redirects to correct dashboard if accessing wrong role route

### Route Structure
```
/                              → Landing or redirect based on auth
/auth/choose                   → Role selection (guests only)
/auth/customer/login           → Customer login (guests only)
/auth/customer/register        → Customer register (guests only)
/auth/merchant/login           → Merchant login (guests only)
/auth/merchant/register        → Merchant step 1 (guests only)
/auth/merchant/register/step2/{userId}
/auth/merchant/register/step3/{merchantId}
/auth/admin/login              → Admin login (guests only)

/customer                      → Customer routes (customers only)
  /dashboard                   → Main dashboard
  /service-requests            → Create/view requests
  /bookings                    → View and manage bookings
  /reviews                     → Leave reviews
  /profile                     → Edit profile

/merchant                      → Merchant routes (merchants only)
  /dashboard                   → Main dashboard
  /profile                     → Edit services and rates
  /jobs                        → View incoming and active jobs
  /earnings                    → Payment history
  /reviews                     → Customer reviews

/admin                         → Admin routes (admins only)
  /dashboard                   → Platform statistics
  /merchants                   → Verify pending merchants
  /transactions                → Commission tracking
```

---

## 3. AUTH CONTEXT

**File**: `src/context/AuthContext.jsx`

**State**:
```javascript
{
  user: {
    id: number,
    name: string,
    email: string,
    role: 'customer' | 'merchant' | 'admin'
  },
  token: string,
  isAuthenticated: boolean,
  isLoading: boolean,
  registrationStep: number // For merchant multi-step
}
```

**Methods**:
- `login(email, password, role)` → Call API
- `register(data, role)` → Call API
- `logout()` → Clear localStorage
- `getCurrentRole()` → Return user.role
- `setRegistrationStep(step)` → For multi-step registration
- `updateUser(userData)` → Update user in context

**Persistence**: Save token and user to localStorage

---

## 4. CUSTOMER PAGES

### Dashboard `/customer/dashboard`
**Layout**: Header + Sidebar (on desktop) or Hamburger menu (mobile) + Main content

**Sections**:
1. **Welcome Section**: "Hi {name}, find service providers near you"
2. **Quick Stats**:
   - Total requests posted
   - Active bookings
   - Completed jobs
   - Average rating given

3. **Recent Bookings Card**:
   - List of last 3 bookings
   - Status badge (pending, accepted, completed, cancelled)
   - Worker name, rating, distance
   - Action button: "View Details"

4. **Action Buttons**:
   - Primary: "Post New Service Request"
   - Secondary: "Browse All Workers"

### Service Requests Page `/customer/service-requests`

**Create Request Section** (Can be modal or separate section):
- Form with fields:
  - Category dropdown (API: `GET /service-categories`)
  - Title input
  - Description textarea
  - Budget Min/Max (sliders or number inputs)
  - **Location Option** (Hybrid approach):
    - Radio buttons: "Use saved location" OR "Enter custom location"
    - If "Use saved location": Dropdown of user locations (API: `GET /user/locations`) - fetches lat/long from selected location
    - If "Enter custom location": Map with Geolocation API or manual lat/long input fields
    - Either way: Coordinates automatically populated in request
  - Urgency level (1-5 radio buttons or slider)
  - Submit button
  - Cancel button
- Backend: `POST /service-requests`
  - `user_location_id` (required): Customer's saved location ID
  - `latitude`, `longitude` (optional): If custom location provided, override the saved location coordinates
  - If custom coords empty → Backend fetches from user_location_id
  - If custom coords provided → Backend uses those instead
  - Either way, service_requests.latitude/longitude always populated for recommendations
- Success: Show toast + add to requests list

**Requests List**:
- Filter tabs: All, Open, Assigned, Completed
- Sort options: Latest, Most Urgent, Budget Range
- For each request, show card with:
  - Title, category icon, budget range
  - Status badge
  - Number of recommended workers
  - "View Details" button

**Request Details Modal/Page**:
- Full request info
- **Recommended Workers Section**:
  - Backend: `GET /recommendations/service-request/{requestId}`
  - Display top 5 workers sorted by score
  - For each worker card:
    - Avatar, name, rating (stars), distance, location
    - Base rate for category
    - Experience level badge
    - "Hire This Worker" button
  - Sort dropdown: By Rating, By Distance

### Bookings Page `/customer/bookings`

**Tabs**:
1. **Active** - In-progress bookings
   - Card for each booking:
     - Worker info, agreed rate, status
     - Scheduled date/time
     - "View Details", "Cancel", "Message" buttons

2. **Completed** - Finished bookings
   - Card for each:
     - Worker info
     - "Leave Review" button if not reviewed
     - "View Review" button if reviewed
     - "View Details" button

3. **Cancelled** - Cancelled bookings

**Booking Details Modal/Page**:
- Worker profile section
- Job details (service, agreed rate, location)
- Timeline (Posted → Accepted → Completed)
- Status update notifications
- Chat/Notes section
- If completed: Show review if exists, or show review form
- Action buttons based on status (Cancel if pending, Rate if completed)

### Reviews Page `/customer/reviews`

- List of all reviews given
- Star rating, comment text, worker name, date
- For completed bookings without reviews:
  - Review form:
    - Overall rating (5-star select)
    - Skill rating (5-star)
    - Timeliness rating (5-star)
    - Communication rating (5-star)
    - Comment textarea (max 500 chars)
    - Submit button
  - Backend: `POST /bookings/{bookingId}/reviews`

---

## 5. MERCHANT PAGES

### Dashboard `/merchant/dashboard`
**Layout**: Header + Sidebar (desktop) or Hamburger menu (mobile) + Main content

**Sections**:
1. **Welcome Section**: "Hi {businessName}, manage your jobs"
2. **Quick Stats**:
   - Total jobs completed
   - Pending jobs count
   - Average rating
   - This month earnings
   - Total earnings

3. **Pending Jobs Section**:
   - Backend: `GET /merchant/bookings?status=pending`
   - For each pending job card:
     - Customer name, service category
     - Agreed rate
     - Location, scheduled time
     - "Accept" & "Reject" buttons
   - No pending jobs → Show "No pending jobs" message

4. **Active Jobs Section**:
   - Backend: `GET /merchant/bookings?status=accepted`
   - For each active job:
     - Customer name, location
     - Scheduled date/time
     - "View Details", "Mark Complete" buttons

### Jobs Page `/merchant/jobs`

**Tabs**:
1. **Pending** - Jobs waiting for acceptance
   - API: `GET /merchant/bookings?status=pending`
   - Accept/Reject buttons
   
2. **Active** - In-progress jobs
   - API: `GET /merchant/bookings?status=accepted`
   - "View Details", "Mark Complete" buttons
   
3. **Completed** - Finished jobs
   - API: `GET /merchant/bookings?status=completed`
   - Customer reviews (if any)
   - Rating stars display

**Job Details Modal/Page**:
- Customer info section
- Service details (category, agreed rate, location)
- Timeline (Posted → Accepted → Completed)
- Chat/Notes section
- Action buttons (Accept/Reject if pending, Mark Complete if active)

### Profile Page `/merchant/profile`

**Merchant Info Section**:
- Business name input
- Phone input
- Logo upload (preview)
- Location display
- Edit button

**Services Section**:
- List of added services (from API: `GET /merchants/{id}/service-categories`)
- For each service:
  - Category name, base rate, experience level
  - Edit and Remove buttons
- "Add Service" button:
  - Modal/Form:
    - Service category dropdown (API: `GET /service-categories`)
    - Base rate input
    - Experience level select (beginner, intermediate, expert)
    - Submit button
  - Backend: `POST /merchants/{id}/service-categories`

**Location Management**:
- List of locations (API: `GET /user/locations`)
- For each location:
  - Address, latitude/longitude
  - Set Primary checkbox
  - Edit and Remove buttons
- "Add Location" button:
  - Use Geolocation API or manual input
  - Show map
  - Save button
  - Backend: `POST /user/locations`

### Earnings Page `/merchant/earnings`

**Summary Cards**:
- This month earnings
- This month jobs
- Total earnings (all-time)
- Average per job

**Chart**:
- Monthly earnings trend (line or bar chart)
- Last 12 months data
- Backend: `GET /admin/merchants/{id}/transactions` (or custom endpoint)

**Transactions Table**:
- Columns: Date, Booking ID, Customer Name, Service, Agreed Rate, Platform Commission, Net Earned, Status
- Pagination (20 per page)
- Filter by date range
- Export button (PDF/CSV) - optional for MVP

---

## 6. ADMIN PAGES

### Dashboard `/admin/dashboard`

**Key Metrics Cards**:
- Total Bookings (all-time)
- Completed Bookings (this month)
- Total Revenue (platform sees = service_amount sum)
- Platform Commission (this month)
- Active Merchants
- Pending Merchant Verifications
- Backend: `GET /admin/dashboard`

**Charts** (Optional for MVP):
- Monthly revenue trend
- Bookings trend
- Merchant growth

**Recent Transactions**:
- Last 10 transactions
- Table: Date, Booking ID, Merchant, Customer, Amount, Commission, Status

### Merchants Page `/admin/merchants`

**Tabs**:
1. **Pending** - Waiting for verification
   - API: `GET /admin/merchants/pending`
   - For each merchant card:
     - Business name, contact info, location
     - Documents section
     - Verify button → Modal with notes field
     - Reject button → Modal with reason field
   - Backend: `PUT /admin/merchants/{id}/verify` or `PUT /admin/merchants/{id}/reject`

2. **Active** - Verified merchants
   - List with option to Suspend
   - Backend: `PUT /admin/merchants/{id}/suspend`

3. **Suspended** - Suspended merchants
   - List with option to Reactivate

**Filter**: By status, by registration date

### Transactions Page `/admin/transactions`

**Table**:
- Columns: Date, Booking ID, Merchant Name, Customer Name, Service, Agreed Rate, Commission %, Commission Amount, Merchant Receives, Status
- Pagination (20 per page)
- Filters: Status (pending, completed), Date range, Merchant name search
- Sort by date, amount
- View Details button → Modal showing full transaction info
- Backend: `GET /admin/transactions?status=...&merchant_id=...`

---

## 7. INTERACTIVE & RESPONSIVE DESIGN

### Responsiveness
- **Mobile-First Approach**
- **Breakpoints**:
  - Mobile: 0-640px (single column, full-width buttons)
  - Tablet: 641-1024px (2-3 columns where appropriate)
  - Desktop: 1025px+ (full layout with sidebar)
  
- **Mobile Navigation**: Hamburger menu that slides in from left
- **Forms**: Stack vertically on mobile, flex row on tablet/desktop
- **Cards**: Full-width on mobile, 2-3 column grid on tablet/desktop
- **Images**: Lazy load, responsive sizes
- **Touch Targets**: Min 44x44px on mobile

### Interactivity
- **Hover Effects**: 
  - Cards: subtle shadow increase
  - Buttons: color change or opacity change
  - Links: underline appear

- **Loading States**:
  - Skeleton screens for data loading
  - Spinner for API calls
  - Loading text

- **Animations**:
  - Page transitions (fade, slide)
  - Modal open/close (scale + fade)
  - Toast notifications (slide in)
  - Button hover (smooth color transition)
  - Smooth scroll behavior

- **Form Validation**:
  - Real-time as user types
  - Red error text below field
  - Disabled submit button if form invalid
  - Success checkmark after valid input

- **Pagination**: 
  - Show 15 items per page default
  - Prev/Next buttons
  - Page number indicator

- **Filters**: 
  - Click to apply
  - Show active filter badges
  - "Clear All Filters" button when filters active

### User Feedback
- **Toast Notifications** (React Hot Toast):
  - Success: Green background, "✓ Booking created!"
  - Error: Red background, error message from API
  - Info: Blue background, "Loading..."
  - Duration: 3 seconds (auto-close)

- **Empty States**:
  - Icon, message, action button
  - Example: "No bookings yet" with "Post Request" button

- **Error Boundaries**:
  - Catch React errors
  - Show user-friendly message + Retry button
  - Log error for debugging

- **Confirmation Dialogs**:
  - Before delete, reject, or important actions
  - Modal with warning icon, message, Cancel/Confirm buttons

---

## 8. DESIGN SYSTEM

### Colors
- **Primary**: #3B82F6 (Blue) - Actions, primary buttons, links
- **Success**: #10B981 (Green) - Completed, verified status
- **Warning**: #F59E0B (Amber) - Pending, review needed
- **Danger**: #EF4444 (Red) - Errors, suspension, rejection
- **Neutral**: #6B7280 (Gray) - Secondary text, borders
- **Background**: #F9FAFB (Light Gray)
- **White**: #FFFFFF - Cards, containers

### Typography
- **Headings**: Bold, sizes 24px (h1), 20px (h2), 16px (h3) on desktop
- **Body**: Regular weight, 14px (mobile), 16px (desktop)
- **Small**: 12px for secondary info
- **Mono**: For codes, IDs, amounts

### Components
- **Buttons**:
  - Primary: Filled blue background, white text
  - Secondary: Outline blue border, blue text
  - Ghost: Transparent, blue text
  - Danger: Filled red background
  - Disabled: Gray background, 50% opacity
  - All: Rounded corners (8px), padding 12px 24px

- **Cards**:
  - White background, 4px drop shadow
  - 12px border-radius
  - 16px padding
  - Hover: shadow increases to 8px

- **Inputs**:
  - 8px border-radius
  - 1px gray border
  - 12px padding
  - Focus: Blue border 2px, no outline
  - Error: Red border, error text below

- **Badge**: Colored background, white text, 4px radius, 4px 8px padding

- **Modals**: Dark overlay, centered white card, close button (X), smooth entrance

- **Tabs**: Underline indicator, active tab blue underline

### Spacing
- Consistent 8px base unit
- 8px, 16px, 24px, 32px, 48px gaps
- Cards: 16px padding
- Page: 24px padding on mobile, 32px on desktop

---

## 9. API INTEGRATION

**Base URL**: `process.env.VITE_API_BASE_URL` (from .env)

**Files Structure** `src/api/`:
```
- authService.ts          (login, register, logout)
- bookingService.ts       (CRUD, accept, reject, complete)
- merchantService.ts      (profile, services, jobs)
- customerService.ts      (requests, bookings)
- adminService.ts         (merchants, transactions, dashboard)
- recommendationService.ts (get recommendations)
- axiosClient.ts          (configured Axios instance)
```

**Axios Setup**:
- Interceptor to add token to all requests: `Authorization: Bearer {token}`
- Error interceptor to handle 401 (redirect to login)
- Base URL from .env

**API Calls**:
- Use TanStack Query for caching and state management
- Show loading state
- Handle errors with toast
- Refetch on error with retry logic

---

## 10. STATE MANAGEMENT

- **AuthContext**: User auth state, login/logout, token
- **TanStack Query**: API data (bookings, requests, users, transactions)
  - Automatic caching
  - Refetch on window focus
  - Background refetch
- **localStorage**: Persist token, user data, registration_step
- **useState**: Form state, UI toggles (modals, menus, filters)

---

## 11. BACKEND STATUS & FRONTEND IMPLEMENTATION PRIORITY

### Backend Completion Status ✅ (100% COMPLETE)
- ✅ Phase 1: 3-step merchant registration with auto-login
- ✅ Phase 2: Service category management with rates
- ✅ Phase 3: User location management (GPS, primary)
- ✅ Phase 4: Recommendation engine (Haversine + weighted scoring)
- ✅ Phase 5: Service requests CRUD with advanced filters
- ✅ Phase 6: Recommendations API (top 5 workers)
- ✅ Phase 7: Complete booking lifecycle (project-based pricing)
- ✅ Phase 8: Reviews & auto-rating system
- ✅ Admin: Merchant verification workflow
- ✅ Admin: Commission tracking & dashboard analytics
- ✅ Role/Permission: Spatie RBAC system
- ✅ Database: Migrations, relationships, observers
- ✅ API: All endpoints with validation & error handling

**Ready for Frontend Development** → All backend APIs available

### Frontend Implementation Phases

**Phase 1 (Week 1-2): Foundation**
- Auth system (login/register/choose)
- Protected routes & AuthContext
- Basic page layouts & navigation

**Phase 2 (Week 3-4): Customer Flow**
- Customer dashboard & stats
- Service requests: create with hybrid location
- Recommendations display (top 5 workers)
- Bookings workflow

**Phase 3 (Week 5): Merchant Flow**
- Merchant dashboard with pending jobs
- Jobs: accept/reject/complete
- Profile: services, locations, rates
- Earnings: transaction history

**Phase 4 (Week 6): Admin & Reviews**
- Admin dashboard with metrics
- Merchant verification workflow
- Transaction tracking & filtering
- Reviews system (rating merchants)

**Phase 5 (Week 7): Polish & Testing**
- Responsiveness refinement
- Animations & transitions
- Error handling & edge cases
- Performance optimization

---

## 12. DELIVERABLES CHECKLIST

- ✅ Multi-role authentication (Customer, Merchant, Admin)
- ✅ 3-step merchant registration
- ✅ Role-based routing with protected pages
- ✅ Customer: Create requests, view recommendations, hire workers, track bookings
- ✅ Merchant: View pending jobs, accept/reject/complete, track earnings
- ✅ Admin: Verify merchants, track commissions, view dashboard stats
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Interactive animations and transitions
- ✅ Proper loading and empty states
- ✅ API integration with error handling
- ✅ Toast notifications for user feedback
- ✅ Form validation (real-time)
- ✅ Pagination and filtering
- ✅ Dark mode optional for Phase 2

---

## 13. BACKEND ENDPOINTS - COMPLETE IMPLEMENTATION ✅

**All endpoints built and tested** ✅ **Backend architecture complete** ✅

### Response Format
All endpoints return:
```json
{
  "success": true/false,
  "message": "...",
  "data": {...},
  "meta": {...}
}
```

### Authentication Endpoints ✅
- `POST /register` - Customer registration (auto-login)
- `POST /login` - General login (customer/merchant/admin)
- `POST /worker/register/step1` - Merchant step 1 (auto-login, returns token)
- `POST /worker/register/step2/{userId}` - Merchant step 2
- `POST /worker/register/step3/{merchantId}` - Merchant step 3 (complete registration)

### Service Categories ✅
- `GET /service-categories` - List all categories (no auth required)

### User Locations ✅
- `GET /user/locations` - Get authenticated user's locations
- `POST /user/locations` - Create new location with GPS coordinates
- `PUT /user/locations/{id}` - Update location
- `DELETE /user/locations/{id}` - Delete location

### Service Requests (Customer Flow) ✅
- `GET /service-requests` - List all requests with filters (category_id, status, budget_min/max, distance_km, latitude, longitude)
- `POST /service-requests` - Create request (hybrid location: use saved OR custom coordinates)
- `GET /service-requests/{id}` - Get single request details
- `PUT /service-requests/{id}` - Update request (before assigned)
- `DELETE /service-requests/{id}` - Cancel request
- `GET /service-requests/user/list` - Get authenticated user's requests

### Recommendations (Haversine + Score) ✅
- `GET /recommendations/service-request/{id}` - Get top 5 recommended workers
  - Score = 40% distance_score + 60% rating_score
  - Sorted by recommendation score (highest first)
  - Returns: name, avatar, rating, distance_km, base_rate, experience_level

### Bookings (Project-Based Pricing - Nepal Model) ✅
**Customer Actions:**
- `POST /bookings` - Create booking (hire worker at agreed_rate, validates within budget_min/max)
- `GET /bookings` - List customer's bookings with pagination
- `GET /bookings/{id}` - Get booking details
- `DELETE /bookings/{id}` - Cancel booking (if pending/accepted only)

**Merchant Actions:**
- `GET /merchant/bookings` - List merchant's jobs (pending, accepted, completed)
- `GET /merchant/bookings/{id}` - Get job details
- `PUT /bookings/{id}/accept` - Worker accepts job
- `PUT /bookings/{id}/reject` - Worker rejects job
- `PUT /bookings/{id}/complete` - Mark job as completed (allows reviews)

### Reviews (Observer Pattern - Auto-Rating) ✅
- `POST /bookings/{id}/reviews` - Submit review after completion (updates merchant.avg_rating automatically)
- `GET /merchants/{id}/reviews` - List merchant's reviews
- `DELETE /reviews/{id}` - Delete review (admin)

### Merchant Profile & Services ✅
- `GET /merchants/{id}` - Merchant profile with avg_rating, services, locations
- `POST /merchants/{id}/service-categories` - Add service category with base_rate
- `PUT /merchants/{id}/service-categories/{categoryId}` - Update rate
- `DELETE /merchants/{id}/service-categories/{categoryId}` - Remove service

### Admin - Merchant Verification ✅
- `GET /admin/merchants/pending` - List pending verification (status='pending')
- `PUT /admin/merchants/{id}/verify` - Approve merchant (status='active', verified_at, verified_by set)
- `PUT /admin/merchants/{id}/reject` - Reject merchant (status='suspended')
- `PUT /admin/merchants/{id}/suspend` - Suspend for violations

### Admin - Commission & Transactions ✅
- `GET /admin/transactions` - List all transactions with filters (status, date, merchant)
  - Fields: service_amount, commission_amount (10%), merchant_amount, status
- `GET /admin/dashboard` - Platform statistics
  - Total bookings, completed bookings, total revenue, platform commission
  - Active merchants count, pending verifications count
  - Transaction trends

### Role & Permission Management ✅
- `GET /roles` - List all roles (admin/customer/merchant)
- `POST /roles` - Create new role with permissions (admin)
- `DELETE /roles/{roleName}` - Delete role (admin)
- `GET /users/{id}/roles` - Get user's assigned roles
- `POST /users/{id}/roles` - Assign role to user (admin)
- `PUT /users/{id}/roles` - Sync/replace user roles (admin)
- `DELETE /users/{id}/roles/{roleName}` - Remove role from user (admin)

### Architecture Highlights
- **Database**: MySQL with 3NF normalization, pivot tables for many-to-many
- **Authentication**: Token-based with Sanctum (role-based middleware)
- **Services**: Business logic layer (ServiceRequestService, BookingService, AdminService, RoleService)
- **Validation**: FormRequest classes with custom rules
- **Error Handling**: ApiResponse trait with consistent JSON responses
- **Observers**: Auto-update merchant.avg_rating when reviews change
- **Locations**: Haversine formula for distance calculations (40km search radius default)
- **Pricing**: Project-based (agreed_rate stored, no hourly), Nepal-market optimized
- **Verification**: Merchant status (pending/active/suspended) with admin approval workflow
- **Transactions**: 10% platform commission automatically calculated on booking completion

---

## 14. NOTES FOR DEVELOPERS

- Start with responsive mobile design, expand to desktop
- Use semantic HTML (nav, main, section, article)
- Accessibility: ARIA labels, alt text, keyboard navigation
- SEO: Meta tags, canonical URLs (if needed)
- Testing: Component tests with Vitest, E2E with Playwright (optional)
- Performance: Code split, lazy load routes, image optimization
- Use constants file for API endpoints, roles, statuses, route paths

---

**This frontend integrates with the fully-built backend API. All endpoints are ready to use.**
