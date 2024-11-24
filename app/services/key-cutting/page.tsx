'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Key, Lock, Shield, Clock, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react'

const KeyCuttingPage = () => {
  const services = [
    {
      icon: <Key className="w-6 h-6" />,
      title: "House Key Cutting",
      description: "Precise cutting of basic house keys using reliable equipment"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Service",
      description: "Keys cut while you wait - typically under 10 minutes"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality Assurance",
      description: "Each key is tested to ensure proper function before handover"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Fair Pricing",
      description: "Competitive rates with no hidden fees"
    }
  ]

  const keyTypes = [
    {
      category: "House Keys We Cut",
      types: [
        "Standard house door keys",
        "Basic deadbolt keys",
        "Common residential keys",
        "Basic mailbox keys",
        "Simple gate keys"
      ]
    }
  ]

  const features = [
    "Reliable key cutting equipment",
    "Experienced service",
    "Quality guarantee",
    "Key testing included",
    "Affordable prices"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-28">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="hover:bg-blue-100">
          <Link href="/services" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">House Key Cutting Service</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quick and reliable key cutting service for your basic house keys. We ensure accurate cuts and test each key for proper function.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Types Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available Key Types</h2>
        <div className="grid grid-cols-1 gap-8">
          {keyTypes.map((category, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.types.map((type, typeIndex) => (
                  <div key={typeIndex} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features List */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Need a Key Cut?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Visit us today for quick and reliable house key cutting service.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}

export default KeyCuttingPage
