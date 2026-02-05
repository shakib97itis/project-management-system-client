import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Admin & Projects</span>
            <NavLink className="text-sm" to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className="text-sm" to="/projects">
              Projects
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink className="text-sm" to="/users">
                Users
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user?.email} | {user?.role}
            </span>
            <button
              className="px-3 py-1.5 rounded bg-gray-900 text-white text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
