"use client";

import { useState } from 'react';
import { z } from 'zod'; // Assuming you have Zod imported
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState('user');
  const userSchema = z.object({
    username: z.string().min(3).max(100).describe('Username must be at least 3 characters long'),
    email: z.string().email().describe('Email must be a valid email address'),
    password: z.string().min(8).describe('Password must be at least 8 characters long'),
    role: z.string().optional().default('user'),
  });
  const router = useRouter()
  const handleSignUp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      // Basic client-side validation (optional but recommended)
      const validationResult = userSchema.safeParse({ username, email, password });
      if (!validationResult.success) {
        if(validationResult.error.issues[0].message == 'String must contain at least 3 character(s)'){
          setError('Username must be at least 3 characters long');
        }  else if (validationResult.error.issues[0].message == 'String must contain at least 8 character(s)'){
          setError('Password must be at least 8 characters long');
        }else {
          setError(validationResult.error.issues[0].message);
        }
        return;
      }
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password, role }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Process response based on success or error
      const apiResponse = await response.json();

      if(apiResponse.status === 201) {
        router.push('/auth/signin')
      } else if (apiResponse.status === 409) { 
        setError(apiResponse.data);
      } else{
        setError(apiResponse.error)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="w-96 md:w-72 lg:w-48 mx-auto align-center">
      <div className="text-center">
        <h3>Sign Up</h3>
      </div>
      <form onSubmit={handleSignUp}>
  
        <div>
          <label className='font-semibold mt-2'>Username</label>
          <input
            type="username"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border rounded-md p-2 background-color: #ececec;"
          />
          {error && typeof error === 'string' && error.includes('Username') && <div className="text-red-500 text-center">{error}</div>}
          <label className='font-semibold'>Email</label>
          <br></br>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-md p-2"
          />
          <label className='font-semibold mt-2'>Password</label>
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-md p-2 mb-2"
          />  
           {error && typeof error === 'string' && error.includes('Password') && <div className="text-red-500 text-center">{error}</div>}
          <input
            type="role"
            value={role}
            onChange={() => setRole("User")}
            hidden
            className="w-full border rounded-md p-2 mb-2"
          />
        </div>
        <div className="justify-center">
          <button className="w-full rounded bg-blue-700">Register</button>
          {error && typeof error === 'string' && <div className="text-red-500 text-center">{error}</div>}
          <Link href="/auth/signin" className="text-blue-500">Login</Link>
        </div> 
      </form>
    </div>
  );
} 
