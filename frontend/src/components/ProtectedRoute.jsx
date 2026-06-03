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

  return children;
}
