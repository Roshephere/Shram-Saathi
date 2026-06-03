import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import DashboardLayout from './layouts/DashboardLayout';

import AuthChoice from './pages/auth/AuthChoice';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import MerchantLogin from './pages/auth/MerchantLogin';
import MerchantRegisterStep1 from './pages/auth/MerchantRegisterStep1';
import MerchantRegisterStep2 from './pages/auth/MerchantRegisterStep2';
import MerchantRegisterStep3 from './pages/auth/MerchantRegisterStep3';
import AdminLogin from './pages/auth/AdminLogin';

import CustomerDashboard from './pages/customer/Dashboard';
import ServiceRequests from './pages/customer/ServiceRequests';
import CreateRequest from './pages/customer/CreateRequest';
import RequestDetail from './pages/customer/RequestDetail';
import RequestBids from './pages/customer/RequestBids';
import Browse from './pages/customer/Browse';
import CustomerBookings from './pages/customer/Bookings';
import CustomerBookingDetail from './pages/customer/BookingDetail';
import CustomerReviews from './pages/customer/Reviews';
import CustomerProfile from './pages/customer/Profile';

import MerchantDashboard from './pages/merchant/Dashboard';
import MerchantProfile from './pages/merchant/Profile';
import MerchantServices from './pages/merchant/Services';
import MerchantJobManagement from './pages/merchant/JobManagement';
import MerchantAvailableRequests from './pages/merchant/AvailableRequests';
import MerchantRequestDetails from './pages/merchant/RequestDetails';
import MerchantBookingDetailPage from './pages/merchant/BookingDetail';
import MerchantEarnings from './pages/merchant/Earnings';
import MerchantReviewsPage from './pages/merchant/ReviewsPage';

import Home from './pages/public/Home';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMerchantManagement from './pages/admin/MerchantManagement';
import AdminTransactions from './pages/admin/Transactions';
import AdminCategories from './pages/admin/Categories';
import AdminRequests from './pages/admin/Requests';
import AdminBookings from './pages/admin/Bookings';
import AdminReviews from './pages/admin/Reviews';
import AdminUserManagement from './pages/admin/UserManagement';

const queryClient = new QueryClient();

function DashboardRoute({ children, roles }) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function DashboardRedirect() {
  const { role } = useAuth();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'worker') return <Navigate to="/merchant/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />

            <Route path="/auth/choose" element={<GuestRoute><AuthChoice /></GuestRoute>} />
            <Route path="/auth/customer/login" element={<GuestRoute><CustomerLogin /></GuestRoute>} />
            <Route path="/auth/customer/register" element={<GuestRoute><CustomerRegister /></GuestRoute>} />
            <Route path="/auth/merchant/login" element={<GuestRoute><MerchantLogin /></GuestRoute>} />
            <Route path="/auth/merchant/register" element={<GuestRoute><MerchantRegisterStep1 /></GuestRoute>} />
            <Route path="/auth/merchant/register/step2/:userId" element={<GuestRoute><MerchantRegisterStep2 /></GuestRoute>} />
            <Route path="/auth/merchant/register/step3/:merchantId" element={<GuestRoute><MerchantRegisterStep3 /></GuestRoute>} />
            <Route path="/auth/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

            <Route path="/customer/dashboard" element={<DashboardRoute roles={['customer']}><CustomerDashboard /></DashboardRoute>} />
            <Route path="/customer/service-requests" element={<DashboardRoute roles={['customer']}><ServiceRequests /></DashboardRoute>} />
            <Route path="/customer/service-requests/create" element={<DashboardRoute roles={['customer']}><CreateRequest /></DashboardRoute>} />
            <Route path="/customer/service-requests/:id" element={<DashboardRoute roles={['customer']}><RequestDetail /></DashboardRoute>} />
            <Route path="/customer/requests/:id/bids" element={<DashboardRoute roles={['customer']}><RequestBids /></DashboardRoute>} />
            <Route path="/customer/browse" element={<DashboardRoute roles={['customer']}><Browse /></DashboardRoute>} />
            <Route path="/customer/bookings" element={<DashboardRoute roles={['customer']}><CustomerBookings /></DashboardRoute>} />
            <Route path="/customer/bookings/:bookingId" element={<DashboardRoute roles={['customer']}><CustomerBookingDetail /></DashboardRoute>} />
            <Route path="/customer/reviews" element={<DashboardRoute roles={['customer']}><CustomerReviews /></DashboardRoute>} />
            <Route path="/customer/profile" element={<DashboardRoute roles={['customer']}><CustomerProfile /></DashboardRoute>} />

            <Route path="/merchant/dashboard" element={<DashboardRoute roles={['worker']}><MerchantDashboard /></DashboardRoute>} />
            <Route path="/merchant/profile" element={<DashboardRoute roles={['worker']}><MerchantProfile /></DashboardRoute>} />
            <Route path="/merchant/services" element={<DashboardRoute roles={['worker']}><MerchantServices /></DashboardRoute>} />
            <Route path="/merchant/jobs" element={<DashboardRoute roles={['worker']}><MerchantJobManagement /></DashboardRoute>} />
            <Route path="/merchant/requests/available" element={<DashboardRoute roles={['worker']}><MerchantAvailableRequests /></DashboardRoute>} />
            <Route path="/merchant/requests/:requestId/details" element={<DashboardRoute roles={['worker']}><MerchantRequestDetails /></DashboardRoute>} />
            <Route path="/merchant/bookings/:bookingId" element={<DashboardRoute roles={['worker']}><MerchantBookingDetailPage /></DashboardRoute>} />
            <Route path="/merchant/earnings" element={<DashboardRoute roles={['worker']}><MerchantEarnings /></DashboardRoute>} />
            <Route path="/merchant/reviews" element={<DashboardRoute roles={['worker']}><MerchantReviewsPage /></DashboardRoute>} />

            <Route path="/admin/dashboard" element={<DashboardRoute roles={['admin']}><AdminDashboard /></DashboardRoute>} />
            <Route path="/admin/users" element={<DashboardRoute roles={['admin']}><AdminUserManagement /></DashboardRoute>} />
            <Route path="/admin/merchants" element={<DashboardRoute roles={['admin']}><AdminMerchantManagement /></DashboardRoute>} />
            <Route path="/admin/service-categories" element={<DashboardRoute roles={['admin']}><AdminCategories /></DashboardRoute>} />
            <Route path="/admin/service-requests" element={<DashboardRoute roles={['admin']}><AdminRequests /></DashboardRoute>} />
            <Route path="/admin/bookings" element={<DashboardRoute roles={['admin']}><AdminBookings /></DashboardRoute>} />
            <Route path="/admin/reviews" element={<DashboardRoute roles={['admin']}><AdminReviews /></DashboardRoute>} />
            <Route path="/admin/transactions" element={<DashboardRoute roles={['admin']}><AdminTransactions /></DashboardRoute>} />

            <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="/dashboard" element={<ProtectedRoute roles={['customer', 'worker', 'admin']}><DashboardRedirect /></ProtectedRoute>} />
            <Route path="/login" element={<Navigate to="/auth/choose" replace />} />
            <Route path="/register" element={<Navigate to="/auth/customer/register" replace />} />

            <Route path="*" element={<Navigate to="/auth/choose" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
