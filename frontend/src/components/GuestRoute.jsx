import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './ui/LoadingSpinner';

export default function GuestRoute({ children }) {
  const { user, loading, role } = useAuth();

  if (loading) return <LoadingSpinner text="Loading..." />;

  if (user) {
    const redirectMap = {
      admin: '/admin/dashboard',
      worker: '/merchant/dashboard',
      customer: '/customer/dashboard',
    };
    return <Navigate to={redirectMap[role] || '/dashboard'} replace />;
  }

  return children;
}
