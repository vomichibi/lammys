'use client';

import React from 'react';
import { formatDate } from '@/lib/utils/date';

interface SelectedItem {
  id: string;
  quantity: number;
}

interface SummaryProps {
  selectedService: string;
  selectedItems: SelectedItem[];
  selectedDate: string;
  selectedTime: string;
  guestEmail?: string;
  onSubmit: () => void;
}

const Summary: React.FC<SummaryProps> = ({
  selectedService,
  selectedItems,
  selectedDate,
  selectedTime,
  guestEmail = '',
  onSubmit,
}) => {
  const getServiceName = (service: string) => {
    switch (service) {
      case 'dry-cleaning':
        return 'Dry Cleaning';
      case 'key-cutting':
        return 'Key Cutting';
      default:
        return service;
    }
  };

  const calculateTotal = () => {
    // This is a placeholder calculation - replace with actual pricing logic
    return selectedItems.reduce((total, item) => total + item.quantity * 10, 0);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <p className="text-gray-600">Contact Email</p>
          <p className="font-medium">{guestEmail}</p>
        </div>

        <div className="border-b pb-4">
          <p className="text-gray-600">Service</p>
          <p className="font-medium">{getServiceName(selectedService)}</p>
        </div>

        <div className="border-b pb-4">
          <p className="text-gray-600">Items</p>
          <ul className="mt-2 space-y-2">
            {selectedItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.id}</span>
                <span>x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-b pb-4">
          <p className="text-gray-600">Appointment</p>
          <p className="font-medium">
            {formatDate(selectedDate)} at {selectedTime}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-gray-600">Total</p>
          <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
        </div>

        <button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Summary;
