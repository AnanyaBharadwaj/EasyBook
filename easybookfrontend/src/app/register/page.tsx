'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, RegisterData, loginUser, LoginData } from '../../api';
import { AxiosError } from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: RegisterData = { name, email, password };

    try {
      // Call register API
      await registerUser(data);

      // Auto-login after registration
      const loginData: LoginData = { email, password };
      const res = await loginUser(loginData);

      const token = res.data.token || res.data.accessToken;
      if (!token) {
        setError('Registration succeeded but token missing');
        return;
      }

      // Save JWT and email
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);

      router.push('/'); // redirect to homepage
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 p-6 border rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <p className="text-sm mt-2 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
