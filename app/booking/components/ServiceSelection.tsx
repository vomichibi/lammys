'use client';

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
