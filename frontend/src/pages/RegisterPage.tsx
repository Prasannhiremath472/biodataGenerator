import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '@/features/auth/useAuthMutations';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register.mutateAsync({ fullName, email, mobileNumber, password });
    navigate('/login');
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" required />
        <input placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 text-sm" required />
        <button type="submit" disabled={register.isPending} className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white">
          {register.isPending ? 'Registering...' : 'Register'}
        </button>
        {register.isError && <p className="text-sm text-red-600">Registration failed. Email may already be in use.</p>}
        {register.isSuccess && <p className="text-sm text-green-600">Registered! You can now log in.</p>}
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="underline">Log In</Link>
      </p>
    </main>
  );
}
