import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {loginApi} from '../api/auth.api';
import {setAccessToken} from '../utils/storage';
import {useAuth} from '../auth/AuthProvider';
import {useNavigate} from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = useAuth();
  const nav = useNavigate();

  const m = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
      nav('/dashboard');
    },
  });

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold">Login</h1>

        <div className="mt-4 space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {m.isError && (
            <p className="text-sm text-red-600">
              {m.error?.response?.data?.message || 'Login failed'}
            </p>
          )}

          <button
            className="w-full bg-gray-900 text-white rounded px-3 py-2"
            disabled={m.isPending}
            onClick={() => m.mutate({email, password})}
          >
            {m.isPending ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-xs text-gray-500">
            You cannot self-register. Ask admin for an invite link.
          </p>
        </div>
      </div>
    </div>
  );
}
