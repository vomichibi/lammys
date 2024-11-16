'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  turnaround: string;
  image: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 'dry-cleaning',
    title: 'Dry Cleaning',
    description: 'Professional dry cleaning service for your delicate garments, suits, dresses, and more.',
    price: 'From $15',
    turnaround: '2-3 days',
    image: '/services/dry-cleaning.jpg',
    features: [
      'Gentle cleaning process',
      'Stain removal',
      'Professional pressing',
      'Minor repairs included',
    ],
  },
  {
    id: 'laundry',
    title: 'Wash & Fold',
    description: 'Complete laundry service with professional washing, drying, and folding.',
    price: 'From $10/kg',
    turnaround: '24 hours',
    image: '/services/laundry.jpg',
    features: [
      'Premium detergents',
      'Fabric softener included',
      'Neatly folded',
      'Same-day service available',
    ],
  },
  {
    id: 'express',
    title: 'Express Service',
    description: 'Urgent cleaning service for when you need your garments back quickly.',
    price: '+50% of regular price',
    turnaround: '4-8 hours',
    image: '/services/express.jpg',
    features: [
      'Same-day service',
      'Priority handling',
      'Express stain removal',
      'Rush delivery available',
    ],
  },
  {
    id: 'specialty',
    title: 'Specialty Items',
    description: 'Expert care for your special garments including wedding dresses, leather, and suede.',
    price: 'Custom quote',
    turnaround: '3-5 days',
    image: '/services/specialty.jpg',
    features: [
      'Wedding dress preservation',
      'Leather & suede cleaning',
      'Designer items',
      'Custom treatments',
    ],
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Professional dry cleaning and laundry services tailored to your needs. 
          We take pride in delivering exceptional quality and care for your garments.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <div 
            key={service.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="mb-4">
                <span className="text-lg font-semibold text-blue-600">{service.price}</span>
                <span className="text-gray-500 ml-2">• {service.turnaround}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/booking"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="max-w-7xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Service?</h2>
        <p className="text-gray-600 mb-6">
          Contact us for special requests or custom cleaning requirements. 
          We're here to help with all your dry cleaning needs.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-900 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
