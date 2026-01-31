import { createBrowserRouter } from 'react-router-dom';
import RequireAuth from '../auth/RequireAuth';
import RequireRole from '../auth/RequireRole';

import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import InviteRegisterPage from '../pages/InviteRegisterPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import ProjectsPage from '../pages/ProjectsPage';

export const router = createBrowserRouter([
  {path: '/login', element: <LoginPage />},
  {path: '/register', element: <InviteRegisterPage />}, // /register?token=...
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          {path: '/dashboard', element: <DashboardPage />},
          {path: '/projects', element: <ProjectsPage />},
          {
            element: <RequireRole allow={['ADMIN']} />,
            children: [{path: '/users', element: <UsersPage />}],
          },
        ],
      },
    ],
  },
  {path: '*', element: <LoginPage />},
]);
