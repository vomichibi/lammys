'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuestInformationProps {
  onSubmit: (email: string) => void;
}

const GuestInformation: React.FC<GuestInformationProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    onSubmit(email);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Guest Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GuestInformation;
