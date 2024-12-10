'use client'

import { Phone, Mail, MapPin, Clock, Scissors, Key, Shirt } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function LandingPageComponent() {
  const router = useRouter()

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/booking')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero section */}
        <section className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1520434901111-8e9bcb42c628?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Hero"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-black opacity-50" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Lammy's Multi Services
            </h1>
            <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              Quality dry cleaning, expert alterations, and quick key cutting services all under one roof.
            </p>
            <div className="mt-5 sm:mt-8 flex justify-center gap-4">
              <div className="rounded-md shadow">
                <button
                  onClick={handleBookNowClick}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Services</h2>
              <p className="mt-4 text-xl text-gray-500">
                Professional services tailored to your needs
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {/* Dry Cleaning */}
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Shirt className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Dry Cleaning</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Professional dry cleaning services for all your garments
                  </p>
                </div>

                {/* Key Cutting */}
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Key className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Key Cutting</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Quick and accurate key cutting service
                  </p>
                </div>

                {/* Alterations */}
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Scissors className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Alterations</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Expert clothing alterations and repairs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Contact Us</h2>
              <p className="mt-4 text-xl text-gray-500">We're here to help</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Phone */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Phone</h3>
                <p className="mt-2 text-base text-gray-500">0483 876 223</p>
              </div>

              {/* Email */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Email</h3>
                <p className="mt-2 text-base text-gray-500">team@lammys.au</p>
              </div>

              {/* Location */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Location</h3>
                <p className="mt-2 text-base text-gray-500">36 Eighth Ave, Maylands WA 6051</p>
              </div>

              {/* Opening Hours */}
              <div className="flex flex-col items-center sm:col-span-2 lg:col-span-3">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Opening Hours</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monday - Saturday: 9:00 AM - 6:00 PM
                </p>
                <p className="text-base text-gray-500">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}