import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';

export default function RequireRole({ allow }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return allow.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
