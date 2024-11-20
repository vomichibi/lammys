'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
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

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center relative">
          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Lammy's
            </Link>
          </div>

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
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/booking" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Book Now</Link>
              <Link href="/contact" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link href="/faq" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              <Link href="/login" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
