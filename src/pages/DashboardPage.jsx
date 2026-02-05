import { useAuth } from '../auth/authContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-700">
        Welcome, <span className="font-medium">{user?.name}</span>
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Role: {user?.role} | Status: {user?.status}
      </p>
    </div>
  );
}
