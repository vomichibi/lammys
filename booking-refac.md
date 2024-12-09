To refactor the code into smaller, reusable components, we can break down the functionalities into separate files for clarity and maintainability. Here's a potential structure for the components:

### Suggested File Structure
```
components/
  Booking/
    BookingPage.tsx
    ServiceSelection.tsx
    DryCleaningSelection.tsx
    KeyCuttingSelection.tsx
    QuantitySelector.tsx
    Summary.tsx
```

Below is how the refactored components might look:

---

### **BookingPage.tsx**
The main page file orchestrating the components:

```tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ServiceSelection from './ServiceSelection';
import DryCleaningSelection from './DryCleaningSelection';
import KeyCuttingSelection from './KeyCuttingSelection';
import Summary from './Summary';

const BookingPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [step, setStep] = useState(1);
  
  const router = useRouter();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedItems([]);
    setStep(2);
  };

  const handleStepChange = (nextStep: number) => setStep(nextStep);

  const handleSubmit = () => {
    console.log('Booking submitted:', { selectedService, selectedItems });
    router.push('/booking/confirmation');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {step === 1 && (
          <ServiceSelection
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
          />
        )}
        {step === 2 && selectedService === 'dry-cleaning' && (
          <DryCleaningSelection
            selectedItems={selectedItems}
            onSelectedItemsChange={setSelectedItems}
            onStepChange={handleStepChange}
          />
        )}
        {step === 2 && selectedService === 'key-cutting' && (
          <KeyCuttingSelection
            selectedItems={selectedItems}
            onSelectedItemsChange={setSelectedItems}
            onStepChange={handleStepChange}
          />
        )}
        {step === 3 && (
          <Summary
            selectedService={selectedService}
            selectedItems={selectedItems}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default BookingPage;
```

---

### **ServiceSelection.tsx**
Handles service selection:

```tsx
import React from 'react';

interface ServiceSelectionProps {
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

const services = [
  { id: 'dry-cleaning', name: 'Dry Cleaning' },
  { id: 'key-cutting', name: 'Key Cutting' },
  { id: 'alterations', name: 'Alterations', isRedirect: true },
];

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ selectedService, onServiceSelect }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Select Service</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onServiceSelect(service.id)}
          className={`p-4 rounded-lg border ${
            selectedService === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          {service.name}
        </button>
      ))}
    </div>
  </div>
);

export default ServiceSelection;
```

---

### **DryCleaningSelection.tsx**
Handles item selection for dry cleaning:

```tsx
import React from 'react';
import QuantitySelector from './QuantitySelector';

interface DryCleaningSelectionProps {
  selectedItems: Array<{ id: string; quantity: number }>;
  onSelectedItemsChange: (items: Array<{ id: string; quantity: number }>) => void;
  onStepChange: (step: number) => void;
}

const dryCleaningItems = [
  { id: 'tie', name: 'Tie', price: 6 },
  { id: 'scarf', name: 'Scarf', price: 10 },
  // Add more items...
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dryCleaningItems.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <label>
              <input
                type="checkbox"
                checked={selectedItems.some((i) => i.id === item.id)}
                onChange={() => handleItemToggle(item.id)}
              />
              <span className="ml-2">{item.name} (${item.price})</span>
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
      <button onClick={() => onStepChange(3)} className="mt-4 btn btn-primary">
        Continue
      </button>
    </div>
  );
};

export default DryCleaningSelection;
```

---

### **KeyCuttingSelection.tsx**
Handles key-cutting services:

```tsx
import React from 'react';

const keyTypes = [
  { id: 'brass-key', name: 'Brass Key', price: 6 },
  { id: 'coloured-key', name: 'Coloured Key', price: 7 },
];

const KeyCuttingSelection: React.FC = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Key Cutting Services</h3>
    {/* Similar structure to DryCleaningSelection */}
  </div>
);

export default KeyCuttingSelection;
```

---

### **QuantitySelector.tsx**
Reusable quantity selector:

```tsx
import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange }) => (
  <div className="mt-2 flex items-center space-x-2">
    <button
      onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
      className="w-8 h-8 border rounded-full"
    >
      -
    </button>
    <span>{quantity}</span>
    <button
      onClick={() => onQuantityChange(quantity + 1)}
      className="w-8 h-8 border rounded-full"
    >
      +
    </button>
  </div>
);

export default QuantitySelector;
```

---

### **Summary.tsx**
Displays booking summary:

```tsx
import React from 'react';

const Summary: React.FC = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Summary</h3>
    {/* Render summary details */}
    <button className="mt-4 btn btn-primary">Submit Booking</button>
  </div>
);

export default Summary;
```

---

This structure keeps each component focused on a single responsibility, making it easier to maintain, test, and expand in the future.