import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import RoleBadge from './users/RoleBadge';
import { classNames } from '../utils/classNames';
import Button from './ui/Button';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClassName = ({ isActive }) =>
    classNames(
      'ds-nav-link',
      isActive ? 'ds-nav-link-active' : 'ds-nav-link-inactive',
    );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-app">
      <header className="border-b border-border bg-surface">
        <div className="ds-container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Admin & Projects</span>
            <NavLink className={navLinkClassName} to="/dashboard" end>
              Dashboard
            </NavLink>
            <NavLink className={navLinkClassName} to="/projects" end>
              Projects
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink className={navLinkClassName} to="/users" end>
                Users
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[18rem]">
                {user?.email}
              </span>
              <RoleBadge role={user?.role} />
            </div>
            <Button size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="ds-container py-6">
        <Outlet />
      </main>
    </div>
  );
}
