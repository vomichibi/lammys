'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shirt, Clock, Ban, ThumbsUp, Sparkles, ArrowLeft } from 'lucide-react'

const DryCleaningPage = () => {
  const services = [
    {
      icon: <Shirt className="w-6 h-6" />,
      title: "Expert Garment Care",
      description: "Professional cleaning for suits, dresses, coats, and delicate fabrics"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Turnaround",
      description: "Same-day service available for most items when dropped off before 10 AM"
    },
    {
      icon: <Ban className="w-6 h-6" />,
      title: "Stain Removal",
      description: "Specialized treatment for tough stains and spots"
    },
    {
      icon: <ThumbsUp className="w-6 h-6" />,
      title: "Quality Guarantee",
      description: "100% satisfaction guaranteed on all our dry cleaning services"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Eco-Friendly Process",
      description: "Using environmentally safe solvents and energy-efficient methods"
    }
  ]

  const acceptedGarments = [
    "Suits & Blazers",
    "Dresses & Evening Wear",
    "Coats & Jackets",
    "Silk & Delicate Fabrics",
    "Wedding Dresses",
    "Ties & Accessories",
    "Wool & Cashmere",
    "Designer Clothing"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-28">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="hover:bg-blue-100 mb-8">
          <Link href="/services" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Dry Cleaning Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trust your garments to our expert care. We use state-of-the-art equipment and eco-friendly processes
            to ensure your clothes look their best.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
              </div>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accepted Garments */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What We Clean</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {acceptedGarments.map((garment, index) => (
              <div key={index} className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">{garment}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience Premium Dry Cleaning?</h2>
        <p className="text-gray-600 mb-8">
          Visit our store today or schedule a pickup for your garments.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/booking">Book Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DryCleaningPage
