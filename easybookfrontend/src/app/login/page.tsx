// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { loginUser, LoginData } from '../../api';
// import { AxiosError } from 'axios';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();

//     const data: LoginData = { email, password };

//     try {
//         const res = await loginUser(data);
//         localStorage.setItem('token', res.data.token);
//         router.push('/');
//       } catch (err) {
//         const error = err as AxiosError<{ message: string }>;
//         alert(error.response?.data?.message || 'Login failed');
//       }
//   }

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form
//         onSubmit={handleLogin}
//         className="flex flex-col gap-4 p-6 border rounded shadow-md w-80"
//       >
//         <h1 className="text-2xl font-bold text-center">Login</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="border rounded px-3 py-2"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="border rounded px-3 py-2"
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, LoginData } from "../../api";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // <-- this line fixes the "cannot find setError"
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: LoginData = { email, password };

    try {
      const res = await loginUser(data);
      const token = res.data.token || res.data.accessToken;

      if (!token) {
        setError("Login failed: token missing");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", res.data.user?.email || email);

      router.push("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-6 border rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}

        <p className="text-sm mt-2 text-center">
          {"Don't have an account? "}
          <Link href="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
