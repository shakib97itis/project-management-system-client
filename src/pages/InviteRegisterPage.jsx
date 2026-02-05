import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerViaInviteApi } from '../api/auth.api';
import { useAuth } from '../auth/AuthProvider';
import Button from '../components/ui/Button';
import TextInput from '../components/ui/TextInput';
import { setAccessToken } from '../utils/accessToken';
import { getApiErrorMessage } from '../utils/errors';

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

  const errorMessage = registerMutation.isError
    ? getApiErrorMessage(registerMutation.error, 'Registration failed')
    : null;

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
          <TextInput
            className="w-full"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextInput
            className="w-full"
            placeholder="Set password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <Button
            className="w-full"
            disabled={!token || registerMutation.isPending}
            isLoading={registerMutation.isPending}
            loadingLabel="Creating account..."
            onClick={() =>
              registerMutation.mutate({ token, name, password })
            }
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
