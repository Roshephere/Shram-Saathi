import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner text="Authenticating..." />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const redirectMap = {
      admin: '/admin/dashboard',
      worker: '/merchant/dashboard',
      customer: '/customer/dashboard',
    };
    return <Navigate to={redirectMap[role] || '/dashboard'} replace />;
  }

  // Merchant incomplete registration: redirect to correct step
  if (role === 'worker' && user.registration_status !== 'complete') {
    const step = user.registration_step || 0;
    if (step === 0) return <Navigate to="/auth/merchant/register" replace />;
    if (step === 1) return <Navigate to={`/auth/merchant/register/step2/${user.id}`} replace />;
    if (step === 2) {
      // Need merchant id for step 3 — fetch from user.merchant or redirect to step2
      const merchantId = user.merchant?.id;
      if (merchantId) return <Navigate to={`/auth/merchant/register/step3/${merchantId}`} replace />;
      return <Navigate to={`/auth/merchant/register/step2/${user.id}`} replace />;
    }
    // step 3 or unknown — send to step 1
    return <Navigate to="/auth/merchant/register" replace />;
  }

  return children;
}
