import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {loginApi} from '../api/auth.api';
import {useAuth} from '../auth/AuthProvider';
import {setAccessToken} from '../utils/storage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      setAccessToken(res.accessToken);
      setUser(res.user);
      navigate('/dashboard');
    },
  });

  const errorMessage =
    loginMutation.error?.response?.data?.message || 'Login failed';
  const isSubmitting = loginMutation.isPending;
  const hasError = loginMutation.isError;

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate({email, password});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md sm:max-w-lg rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-xl shadow-gray-200/60 backdrop-blur sm:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Sign in to continue to your workspace.
          </p>
        </div>

        <form
          className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          noValidate
        >
          <fieldset className="space-y-4 sm:space-y-5" disabled={isSubmitting}>
            <div className="space-y-1">
              <label
                className="text-sm block font-medium text-gray-900"
                htmlFor="login-email"
              >
                Email
              </label>
              <input
                id="login-email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base text-gray-900 transition focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 sm:py-3"
                type="email"
                name="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
                aria-invalid={hasError}
                aria-describedby={hasError ? 'login-error' : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-sm block font-medium text-gray-900"
                htmlFor="login-password"
              >
                Password
              </label>
              <input
                id="login-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base text-gray-900 transition focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 sm:py-3"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                minLength={6}
                aria-invalid={hasError}
                aria-describedby={hasError ? 'login-error' : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {hasError && (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
                id="login-error"
              >
                {errorMessage}
              </p>
            )}

            <button
              className="w-full cursor-pointer rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-300/40 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none sm:py-3 sm:text-base"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-xs text-gray-500 sm:text-sm">
              You cannot self-register. Ask admin for an invite link.
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
