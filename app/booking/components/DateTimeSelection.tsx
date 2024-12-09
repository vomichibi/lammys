'use client';

import React from 'react';
import { formatDate } from '@/lib/utils/date';

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onStepChange: (step: number) => void;
}

const availableTimes = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45'
];

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onStepChange,
}) => {
  const handleDateSelect = (date: string) => {
    onDateSelect(date);
  };

  const handleTimeSelect = (time: string) => {
    onTimeSelect(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onStepChange(4);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Date</h2>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            return (
              <button
                key={dateStr}
                onClick={() => handleDateSelect(dateStr)}
                className={`p-4 rounded-lg border ${
                  selectedDate === dateStr
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                {formatDate(dateStr)}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Time</h2>
          <div className="grid grid-cols-4 gap-3">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 rounded-lg border ${
                  selectedTime === time
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Continue to Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
