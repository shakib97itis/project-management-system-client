import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerViaInviteApi } from '../api/auth.api';
import { useAuth } from '../auth/AuthProvider';
import { setAccessToken } from '../utils/accessToken';

export default function InviteRegisterPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get('token') || '',
    [searchParams],
  );

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: registerViaInviteApi,
    onSuccess: (res) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
      navigate('/dashboard');
    },
  });

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold">Complete Registration</h1>

        {!token && (
          <p className="mt-3 text-sm text-red-600">
            Missing invite token. Please use the invite link provided by admin.
          </p>
        )}

        <div className="mt-4 space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Set password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {registerMutation.isError && (
            <p className="text-sm text-red-600">
              {registerMutation.error?.response?.data?.message ||
                'Registration failed'}
            </p>
          )}

          <button
            className="w-full bg-gray-900 text-white rounded px-3 py-2 disabled:opacity-50"
            disabled={!token || registerMutation.isPending}
            onClick={() =>
              registerMutation.mutate({ token, name, password })
            }
          >
            {registerMutation.isPending ? 'Creating account...' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
