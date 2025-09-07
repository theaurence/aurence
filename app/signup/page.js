"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BRAND");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      // token is set in httpOnly cookie by API
      localStorage.setItem('authToken', '1');
      router.push('/onboarding');
    } catch (err) {
      console.error('Signup error:', err);
      alert(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Create an Aurence Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white" 
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white" 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white" 
            required
          />
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            required
          >
            <option value="BRAND">Brand</option>
            <option value="CREATOR">Creator</option>
          </select>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
