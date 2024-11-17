'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Key, Lock, Shield, Clock, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react'

const KeyCuttingPage = () => {
  const services = [
    {
      icon: <Key className="w-6 h-6" />,
      title: "Precision Cutting",
      description: "High-precision key cutting for all types of keys using state-of-the-art equipment"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security Keys",
      description: "Cutting of high-security and restricted key systems with proper authorization"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Service",
      description: "Most keys cut while you wait - typically under 10 minutes"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Wide Selection",
      description: "Extensive range of key blanks for residential, commercial, and automotive use"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Fair Pricing",
      description: "Competitive rates with no hidden fees"
    }
  ]

  const keyTypes = [
    {
      category: "Residential",
      types: [
        "House keys",
        "Apartment keys",
        "Mailbox keys",
        "Gate keys",
        "Garage door keys",
        "Window lock keys"
      ]
    },
    {
      category: "Automotive",
      types: [
        "Car keys",
        "Motorcycle keys",
        "Van keys",
        "Truck keys",
        "Boat keys",
        "Transponder keys"
      ]
    },
    {
      category: "Commercial",
      types: [
        "Office keys",
        "Cabinet keys",
        "Safe keys",
        "Filing cabinet keys",
        "Master key systems",
        "Restricted keys"
      ]
    }
  ]

  const features = [
    "Latest key cutting technology",
    "Experienced technicians",
    "Quality guarantee",
    "Wide range of key blanks",
    "Duplicate key testing",
    "Key matching service"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Key Cutting Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fast, accurate, and reliable key cutting service for all your needs. From simple house keys
            to complex security systems, we've got you covered.
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

      {/* Key Types */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Types of Keys We Cut</h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {keyTypes.map((type, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{type.category}</h3>
                <ul className="space-y-2">
                  {type.types.map((keyType, keyIndex) => (
                    <li key={keyIndex} className="flex items-center gap-2 text-gray-700">
                      <Key className="w-4 h-4 text-blue-600" />
                      {keyType}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Key Cutting Service?</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Keys Cut?</h2>
        <p className="text-gray-600 mb-8">
          Visit our store today for fast, professional key cutting service.
          No appointment necessary for most key types.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/contact">Visit Store</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default KeyCuttingPage
