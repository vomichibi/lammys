'use client';

import React from 'react';
import QuantitySelector from './QuantitySelector';

interface SelectedItem {
  id: string;
  quantity: number;
}

interface DryCleaningSelectionProps {
  selectedItems: SelectedItem[];
  onSelectedItemsChange: (items: SelectedItem[]) => void;
  onStepChange: (step: number) => void;
}

const dryCleaningItems = [
  { id: 'tie', name: 'Tie', price: 6, category: 'clothing' },
  { id: 'scarf', name: 'Scarf', price: 10, category: 'clothing' },
  { id: 'skirt', name: 'Skirt', price: 12, category: 'clothing' },
  { id: 'pleated-skirt', name: 'Pleated Skirt', price: 15, category: 'clothing' },
  { id: 'jacket', name: 'Jacket', price: 17, category: 'clothing' },
  { id: 'suit-2pc', name: 'Suit (2 Piece)', price: 27, category: 'clothing' },
  { id: 'silk-shirt', name: 'Silk Shirt', price: 15, category: 'clothing' },
];

const DryCleaningSelection: React.FC<DryCleaningSelectionProps> = ({
  selectedItems,
  onSelectedItemsChange,
  onStepChange,
}) => {
  const handleItemToggle = (itemId: string) => {
    const exists = selectedItems.find((item) => item.id === itemId);
    if (exists) {
      onSelectedItemsChange(selectedItems.filter((item) => item.id !== itemId));
    } else {
      onSelectedItemsChange([...selectedItems, { id: itemId, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    onSelectedItemsChange(
      selectedItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const dryCleaningItem = dryCleaningItems.find((i) => i.id === item.id);
      return total + (dryCleaningItem?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Items for Dry Cleaning</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dryCleaningItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border ${
              selectedItems.some((i) => i.id === item.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.some((i) => i.id === item.id)}
                onChange={() => handleItemToggle(item.id)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="ml-3 flex-1">
                <span className="block font-medium">{item.name}</span>
                <span className="block text-sm text-gray-500">
                  ${item.price}
                </span>
              </span>
            </label>
            {selectedItems.some((i) => i.id === item.id) && (
              <QuantitySelector
                quantity={
                  selectedItems.find((i) => i.id === item.id)?.quantity || 1
                }
                onQuantityChange={(quantity) =>
                  handleQuantityChange(item.id, quantity)
                }
              />
            )}
          </div>
        ))}
      </div>
      {selectedItems.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-lg font-semibold">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <button
            onClick={() => onStepChange(3)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default DryCleaningSelection;
