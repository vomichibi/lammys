'use client'

import React from 'react'
import Link from 'next/link'
import Footer from '@/components/ui/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-green-600 to-green-800">
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Lammy's Trees
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Professional Tree Services in Perth
            </p>
            <Link
              href="/booking"
              className="bg-white text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const services = [
  {
    title: 'Tree Removal',
    description: 'Safe and efficient removal of trees with minimal impact to surrounding areas.',
  },
  {
    title: 'Tree Pruning',
    description: 'Expert pruning services to maintain tree health and appearance.',
  },
  {
    title: 'Stump Grinding',
    description: 'Complete stump removal and ground preparation services.',
  },
]
