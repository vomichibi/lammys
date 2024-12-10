'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DateTimeSelectionProps {
  onSelect: (date: string, time: string) => void;
}

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({ onSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    setError('');
    onSelect(format(selectedDate, 'yyyy-MM-dd'), selectedTime);
  };

  // Disable past dates and weekends
  const disabledDays = [
    { before: new Date() },
    { dayOfWeek: [0, 6] }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Select Date & Time</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Select Date</h3>
          <div className="border rounded-lg p-4 bg-white">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              fromDate={new Date()}
              className="mx-auto"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Select Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                onClick={() => setSelectedTime(time)}
                variant={selectedTime === time ? 'default' : 'outline'}
                className="w-full"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
