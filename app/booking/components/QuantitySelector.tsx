'use client';

import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange }) => (
  <div className="mt-2 flex items-center space-x-2">
    <button
      onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
      className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100"
      type="button"
    >
      -
    </button>
    <span className="w-8 text-center">{quantity}</span>
    <button
      onClick={() => onQuantityChange(quantity + 1)}
      className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100"
      type="button"
    >
      +
    </button>
  </div>
);

export default QuantitySelector;
