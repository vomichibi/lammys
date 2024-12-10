import React from 'react';
import { Button } from '@/components/ui/button';

interface SummaryProps {
  selectedService: string;
  selectedItems: Array<{ id: string; quantity: number }>;
  selectedDate: string;
  selectedTime: string;
  guestEmail: string;
  onSubmit: () => void;
}

const Summary: React.FC<SummaryProps> = ({
  selectedService,
  selectedItems,
  selectedDate,
  selectedTime,
  guestEmail,
  onSubmit,
}) => {
  const formatService = (service: string) => {
    return service.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const calculateTotal = () => {
    // This is a placeholder - implement actual pricing logic
    return selectedItems.reduce((total, item) => total + item.quantity * 10, 0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Booking Summary</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-medium">Service</h3>
          <p>{formatService(selectedService)}</p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium">Items</h3>
          {selectedItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.id}</span>
              <span>Quantity: {item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium">Date & Time</h3>
          <p>{selectedDate} at {selectedTime}</p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium">Contact Information</h3>
          <p>{guestEmail}</p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium">Estimated Total</h3>
          <p>£{calculateTotal().toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default Summary;
