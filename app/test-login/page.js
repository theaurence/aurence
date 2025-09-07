"use client";
import { useState } from "react";

export default function TestLogin() {
  const [result, setResult] = useState("");

  const testLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'brand@example.com', 
          password: 'password123' 
        }),
      });
      
      const data = await res.json();
      setResult(JSON.stringify({ status: res.status, data }, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  const testProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setResult(JSON.stringify({ status: res.status, data }, null, 2));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-4">Login Test Page</h1>
      <div className="space-x-4 mb-4">
        <button 
          onClick={testLogin}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Test Login
        </button>
        <button 
          onClick={testProfile}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Test Profile
        </button>
      </div>
      <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto">
        {result || "Click a button to test"}
      </pre>
    </div>
  );
}



