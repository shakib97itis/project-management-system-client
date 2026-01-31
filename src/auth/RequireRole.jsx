import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from './AuthProvider';

export default function RequireRole({allow}) {
  const {user} = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return allow.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
