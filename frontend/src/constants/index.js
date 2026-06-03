export const ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ADMIN: 'admin',
}

export const REQUEST_STATUSES = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const MERCHANT_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
}

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const URGENCY_MAP = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent',
  5: 'Emergency',
}

export const ROUTES = {
  AUTH_CHOOSE: '/auth/choose',
  CUSTOMER_LOGIN: '/auth/customer/login',
  CUSTOMER_REGISTER: '/auth/customer/register',
  MERCHANT_LOGIN: '/auth/merchant/login',
  MERCHANT_REGISTER: '/auth/merchant/register',
  ADMIN_LOGIN: '/auth/admin/login',
  CUSTOMER: {
    DASHBOARD: '/customer/dashboard',
    SERVICE_REQUESTS: '/customer/service-requests',
    BOOKINGS: '/customer/bookings',
    REVIEWS: '/customer/reviews',
    PROFILE: '/customer/profile',
  },
  MERCHANT: {
    DASHBOARD: '/merchant/dashboard',
    PROFILE: '/merchant/profile',
    JOBS: '/merchant/jobs',
    EARNINGS: '/merchant/earnings',
    REVIEWS: '/merchant/reviews',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    MERCHANTS: '/admin/merchants',
    TRANSACTIONS: '/admin/transactions',
  },
}
