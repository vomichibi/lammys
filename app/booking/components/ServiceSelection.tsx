'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ServiceSelectionProps {
  onSelect: (serviceId: string) => void;
}

const services: Service[] = [
  {
    id: 'dry-cleaning',
    name: 'Dry Cleaning',
    description: 'Professional dry cleaning service for all your garments',
    icon: '🧥',
  },
  {
    id: 'key-cutting',
    name: 'Key Cutting',
    description: 'Duplicate keys for your home, office, or vehicle',
    icon: '🔑',
  },
  {
    id: 'alterations',
    name: 'Alterations',
    description: 'Expert clothing alterations and repairs',
    icon: '✂️',
  },
];

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Select a Service</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelect(service.id)}
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-lg font-medium mb-2">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
