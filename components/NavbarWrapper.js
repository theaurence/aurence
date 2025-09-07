'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check for JWT cookie (set by API)
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Hide navbar on home page and auth pages
  if (['/', '/login', '/signup', '/onboarding'].includes(pathname)) return null;

  return (
    <nav className="bg-black/95 border-b border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-semibold text-white tracking-wide">Aurence</span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <NavLink href="/dashboard" label="Dashboard" />
            <NavLink href="/campaigns" label="Campaigns" />
            <NavLink href="/collaborations" label="Collaborations" />
            <NavLink href="/messages" label="Messages" />
            <NavLink href="/profile" label="Profile" />
            <NavLink href="/settings" label="Settings" />
            <button
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  localStorage.removeItem('authToken');
                  setIsLoggedIn(false);
                  window.location.href = '/';
                } catch (_) {
                  window.location.href = '/';
                }
              }}
              className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }) {
  return (
    <Link href={href} className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
      {label}
    </Link>
  );
}
