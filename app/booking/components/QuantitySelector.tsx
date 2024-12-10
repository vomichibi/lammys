'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
  selectedService: string;
  onSelect: (items: Array<{ id: string; quantity: number }>) => void;
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  selectedService,
  onSelect,
}) => {
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; quantity: number }>>([]);

  const getServiceItems = (service: string): ServiceItem[] => {
    switch (service) {
      case 'dry-cleaning':
        return [
          { id: 'suit', name: 'Suit', price: 15 },
          { id: 'dress', name: 'Dress', price: 12 },
          { id: 'shirt', name: 'Shirt', price: 8 },
          { id: 'trousers', name: 'Trousers', price: 10 },
          { id: 'coat', name: 'Coat', price: 18 },
        ];
      case 'key-cutting':
        return [
          { id: 'yale', name: 'Yale Key', price: 5 },
          { id: 'mortice', name: 'Mortice Key', price: 7 },
          { id: 'car', name: 'Car Key', price: 25 },
          { id: 'padlock', name: 'Padlock Key', price: 6 },
        ];
      default:
        return [];
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentItem = selectedItems.find(item => item.id === itemId);
    
    if (currentItem) {
      const newQuantity = Math.max(0, currentItem.quantity + change);
      if (newQuantity === 0) {
        setSelectedItems(selectedItems.filter(item => item.id !== itemId));
      } else {
        setSelectedItems(selectedItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    } else if (change > 0) {
      setSelectedItems([...selectedItems, { id: itemId, quantity: 1 }]);
    }
  };

  const getQuantity = (itemId: string): number => {
    const item = selectedItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleContinue = () => {
    if (selectedItems.length > 0) {
      onSelect(selectedItems);
    }
  };

  const items = getServiceItems(selectedService);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Select Items</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">£{item.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => handleQuantityChange(item.id, -1)}
                disabled={getQuantity(item.id) === 0}
                variant="outline"
                size="sm"
              >
                -
              </Button>
              
              <span className="w-8 text-center">{getQuantity(item.id)}</span>
              
              <Button
                onClick={() => handleQuantityChange(item.id, 1)}
                variant="outline"
                size="sm"
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={selectedItems.length === 0}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
