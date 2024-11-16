'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Lammy's
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <Link href="/booking" className="hover:text-blue-600">Book Now</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
            <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          </div>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="hover:text-blue-600">Login</Link>
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
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
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <Link href="/services" className="hover:text-blue-600">Services</Link>
              <Link href="/booking" className="hover:text-blue-600">Book Now</Link>
              <Link href="/contact" className="hover:text-blue-600">Contact</Link>
              <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
              <Link href="/login" className="hover:text-blue-600">Login</Link>
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block text-center"
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
