import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '@/features/auth/useAuthMutations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login.mutateAsync({ email, password });
    navigate('/create-biodata');
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          required
        />
        <button type="submit" disabled={login.isPending} className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white">
          {login.isPending ? 'Logging in...' : 'Log In'}
        </button>
        {login.isError && <p className="text-sm text-red-600">Invalid email or password.</p>}
      </form>
      <p className="mt-4 text-sm text-gray-600">
        No account? <Link to="/register" className="underline">Register</Link>
      </p>
    </main>
  );
}
