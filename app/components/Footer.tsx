'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-secondary" />
                <a href="tel:+61483876223" className="hover:text-accent">
                  0483 876 223
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-secondary" />
                <a href="mailto:team@lammys.au" className="hover:text-accent">
                  team@lammys.au
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-secondary" />
                <span>36 Eighth Ave, Maylands WA 6051</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-accent">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2">
              <p>Monday - Friday: 8:30 AM - 5:30 PM</p>
              <p>Saturday: 9:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p> {new Date().getFullYear()} Lammy's Multi Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
