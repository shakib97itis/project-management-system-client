import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './authContext';

export default function RequireAuth() {
  const { isAuthed, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}
