'use client';

import React from 'react';

interface GuestInformationProps {
  guestEmail: string;
  guestName: string;
  guestPhone: string;
  onGuestEmailChange: (email: string) => void;
  onGuestNameChange: (name: string) => void;
  onGuestPhoneChange: (phone: string) => void;
  onContinue: () => void;
}

const GuestInformation: React.FC<GuestInformationProps> = ({
  guestEmail,
  guestName,
  guestPhone,
  onGuestEmailChange,
  onGuestNameChange,
  onGuestPhoneChange,
  onContinue,
}) => {
  const isValid = guestEmail && guestName && guestPhone;

  return (
    <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Guest Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="guestEmail"
            value={guestEmail}
            onChange={(e) => onGuestEmailChange(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            id="guestName"
            value={guestName}
            onChange={(e) => onGuestNameChange(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            id="guestPhone"
            value={guestPhone}
            onChange={(e) => onGuestPhoneChange(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          onClick={onContinue}
          disabled={!isValid}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          Continue to Service Selection
        </button>
      </div>
    </div>
  );
};

export default GuestInformation;
