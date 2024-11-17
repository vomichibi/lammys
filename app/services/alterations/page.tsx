'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Scissors, Ruler, Clock, Medal, Tag, ArrowLeft } from 'lucide-react'

const AlterationsPage = () => {
  const services = [
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Expert Tailoring",
      description: "Professional alterations for all types of clothing by experienced seamstresses"
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "Perfect Fit",
      description: "Precise measurements and fitting to ensure your garments fit perfectly"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Service",
      description: "Most alterations completed within 3-5 business days"
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: "Quality Work",
      description: "Satisfaction guaranteed on all alterations and repairs"
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Fair Pricing",
      description: "Competitive rates with no hidden fees"
    }
  ]

  const alterationTypes = [
    {
      category: "Pants & Trousers",
      services: [
        "Hem adjustment",
        "Waist adjustment",
        "Leg tapering",
        "Zipper replacement"
      ]
    },
    {
      category: "Dresses & Skirts",
      services: [
        "Length adjustment",
        "Taking in/letting out",
        "Strap adjustment",
        "Zipper repair"
      ]
    },
    {
      category: "Shirts & Jackets",
      services: [
        "Sleeve shortening",
        "Shoulder adjustment",
        "Side seam adjustment",
        "Button replacement"
      ]
    },
    {
      category: "Formal Wear",
      services: [
        "Wedding dress alterations",
        "Suit tailoring",
        "Evening gown fitting",
        "Tuxedo adjustments"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/services" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Clothing Alterations</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the perfect fit with our expert alteration services. Our skilled seamstresses ensure
            your garments look and feel exactly how you want them.
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

      {/* Alteration Types */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Alteration Services</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {alterationTypes.map((type, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{type.category}</h3>
                <ul className="space-y-2">
                  {type.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-center gap-2 text-gray-700">
                      <Scissors className="w-4 h-4 text-blue-600" />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Notice */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Alteration Pricing</h2>
          <p className="text-gray-600 mb-6">
            Prices vary depending on the complexity of the alteration and the type of garment.
            Visit our store for a free consultation and accurate quote.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/booking">Schedule Fitting</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlterationsPage
