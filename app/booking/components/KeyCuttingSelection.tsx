'use client';

import React from 'react';
import QuantitySelector from './QuantitySelector';

interface SelectedItem {
  id: string;
  quantity: number;
}

interface KeyCuttingSelectionProps {
  selectedItems: SelectedItem[];
  onSelectedItemsChange: (items: SelectedItem[]) => void;
  onStepChange: (step: number) => void;
}

const keyTypes = [
  { id: 'brass-key', name: 'Brass Key', price: 6 },
  { id: 'coloured-key', name: 'Coloured Key', price: 7 },
];

const KeyCuttingSelection: React.FC<KeyCuttingSelectionProps> = ({
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
      const keyType = keyTypes.find((i) => i.id === item.id);
      return total + (keyType?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Key Type</h3>
      <p className="text-sm text-gray-600 italic">Only normal keys available.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keyTypes.map((keyType) => (
          <div
            key={keyType.id}
            className={`p-4 rounded-lg border ${
              selectedItems.some((i) => i.id === keyType.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.some((i) => i.id === keyType.id)}
                onChange={() => handleItemToggle(keyType.id)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <span className="ml-3 flex-1">
                <span className="block font-medium">{keyType.name}</span>
                <span className="block text-sm text-gray-500">
                  ${keyType.price}
                </span>
              </span>
            </label>
            {selectedItems.some((i) => i.id === keyType.id) && (
              <QuantitySelector
                quantity={
                  selectedItems.find((i) => i.id === keyType.id)?.quantity || 1
                }
                onQuantityChange={(quantity) =>
                  handleQuantityChange(keyType.id, quantity)
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

export default KeyCuttingSelection;
