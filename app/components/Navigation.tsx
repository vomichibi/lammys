'use client';

import Link from 'next/link';
<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
=======
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navigation() {
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
<<<<<<< HEAD
        menuRef.current && 
=======
        menuRef.current &&
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

<<<<<<< HEAD
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center relative">
          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold text-blue-600">
=======
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 relative">
          {/* Logo - Centered absolutely */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="text-xl font-bold text-blue-600">
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
              Lammy's
            </Link>
          </div>

<<<<<<< HEAD
          {/* Invisible spacer to maintain layout */}
          <div className="w-6"></div>

          {/* Mobile Menu Button - Right aligned */}
          <button 
            ref={buttonRef}
            className="text-gray-600 z-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16m-7 6h7" 
                />
              )}
            </svg>
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute inset-x-0 top-full bg-white shadow-lg z-20"
            >
              <div className="container mx-auto px-6">
                <div className="py-4">
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/booking"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book Now
                    </Link>
                    <Link
                      href="/contact"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link
                      href="/faq"
                      className="text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                    
                    {!loading && (
                      <>
                        {user ? (
                          <>
                            {isAdmin ? (
                              <Link
                                href="/admindash"
                                className="text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Dashboard
                              </Link>
                            ) : (
                              <Link
                                href="/dashboard"
                                className="text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Dashboard
                              </Link>
                            )}
                            <button
                              onClick={handleLogout}
                              className="text-left text-gray-700 hover:text-blue-600"
                            >
                              Sign Out
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/login"
                              className="text-gray-700 hover:text-blue-600"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Login
                            </Link>
                            <Link
                              href="/register"
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block text-center"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Register
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
=======
          {/* Hamburger menu button - Positioned on the right */}
          <div className="ml-auto flex items-center">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                // Icon when menu is open
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu content */}
        {isMenuOpen && (
          <div ref={menuRef} className="py-2 border-t border-gray-200">
            <div className="space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 text-base font-medium ${
                  pathname === '/'
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {!isLoading && (
                <>
                  {user ? (
                    isAdmin ? (
                      <Link
                        href="/admindash"
                        className={`block px-3 py-2 text-base font-medium ${
                          pathname.startsWith('/admindash')
                            ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                            : 'text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className={`block px-3 py-2 text-base font-medium ${
                          pathname.startsWith('/dashboard')
                            ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                            : 'text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </>
              )}
              {user && (
                <button
                  onClick={(e) => {
                    handleSignOut(e);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        )}
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
      </div>
    </nav>
  );
}
