'use client';

import React, { useState } from 'react';
import { Steps } from '@/components/ui/steps';
import ServiceSelection from './components/ServiceSelection';
import QuantitySelector from './components/QuantitySelector';
import DateTimeSelection from './components/DateTimeSelection';
import GuestInformation from './components/GuestInformation';
import Summary from './components/Summary';

export default function BookingPageComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ id: string; quantity: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const steps = [
    { id: 1, name: 'Service' },
    { id: 2, name: 'Items' },
    { id: 3, name: 'Date & Time' },
    { id: 4, name: 'Information' },
    { id: 5, name: 'Review' },
  ];

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleItemsSelect = (items: { id: string; quantity: number }[]) => {
    setSelectedItems(items);
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep(4);
  };

  const handleGuestInformation = (email: string) => {
    setGuestEmail(email);
    setCurrentStep(5);
  };

  const handleBookingSubmit = async () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', {
      service: selectedService,
      items: selectedItems,
      date: selectedDate,
      time: selectedTime,
      email: guestEmail,
    });
    // Redirect to confirmation page or show success message
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Steps steps={steps} currentStep={currentStep} />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {currentStep === 1 && (
            <ServiceSelection onSelect={handleServiceSelect} />
          )}

          {currentStep === 2 && (
            <QuantitySelector
              selectedService={selectedService}
              onSelect={handleItemsSelect}
            />
          )}

          {currentStep === 3 && (
            <DateTimeSelection onSelect={handleDateTimeSelect} />
          )}

          {currentStep === 4 && (
            <GuestInformation onSubmit={handleGuestInformation} />
          )}

          {currentStep === 5 && (
            <Summary
              selectedService={selectedService}
              selectedItems={selectedItems}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              guestEmail={guestEmail}
              onSubmit={handleBookingSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
