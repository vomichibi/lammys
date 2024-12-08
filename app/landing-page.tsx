'use client'

import { Phone, Mail, MapPin, Clock, Scissors, Key, Shirt } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ParallaxHero } from './components/ParallaxHero'
import { TestimonialCarousel } from './components/TestimonialCarousel'
import { useAuth } from '@/lib/auth-context'

export function LandingPageComponent() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user && !loading) {
      // If user is not logged in, redirect to login page
      router.push('/login')
      return
    }
    router.push('/booking')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero section */}
        <ParallaxHero
          imageUrl="https://images.unsplash.com/photo-1520434901111-8e9bcb42c628?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        >
          <div className="relative flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                Lammy's Multi Services
              </h1>
              <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Quality dry cleaning, expert alterations, and quick key cutting services all under one roof.
              </p>
              <div className="mt-5 sm:mt-8 flex justify-center">
                <div className="rounded-md shadow">
                  <button
                    onClick={handleBookNowClick}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    {loading ? 'Loading...' : user ? 'Book Now' : 'Login to Book'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ParallaxHero>

        {/* Services section */}
        <div id="services" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-secondary font-semibold tracking-wide uppercase">Our Services</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need, all in one place
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-6 sm:space-y-8 md:space-y-0 md:grid md:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <Link href="/services/dry-cleaning" className="block">
                  <div className="relative p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <dt className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-primary text-white">
                        <Shirt className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-4 text-base sm:text-lg font-medium text-gray-900">Dry Cleaning</p>
                    </dt>
                  </div>
                </Link>

                <Link href="/services/alterations" className="block">
                  <div className="relative p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <dt className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-primary text-white">
                        <Scissors className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-4 text-base sm:text-lg font-medium text-gray-900">Alterations</p>
                    </dt>
                  </div>
                </Link>

                <Link href="/services/key-cutting" className="block">
                  <div className="relative p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <dt className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-primary text-white">
                        <Key className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-4 text-base sm:text-lg font-medium text-gray-900">Key Cutting</p>
                    </dt>
                  </div>
                </Link>
              </dl>
            </div>
          </div>
        </div>

        {/* About section */}
        <div id="about" className="bg-accent/10 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  About Us
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  At Lammy's, our commitment to quality service and customer satisfaction has made us the go-to place for dry cleaning, alterations, and key cutting.
                </p>
              </div>
              <div className="mt-8 lg:mt-0">
                <Image
                  className="rounded-lg shadow-lg"
                  src="https://lh3.googleusercontent.com/p/AF1QipP2Zdb6K5blSF3vqvZshnQk1eC9SYYsYPRpeXOJ=s680-w680-h510"
                  alt="Lammy's store front"
                  width={680}
                  height={510}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What Our Customers Say
              </p>
            </div>
            <TestimonialCarousel
              testimonials={[
                {
                  text: "Very reasonable prices. Reliable and will get an item altered with little turn around time if it's urgent. Highly recommended! ",
                  author: "Jennie Collins",
                  role: "Google Review"
                },
                {
                  text: "Absolutely fantastic service. My go-to for alterations, etc, every time!",
                  author: "Jeanette Muscat",
                  role: "Google Review"
                },
                {
                  text: "Came here after several of my friends recommended Lammy's to me. The staff were welcoming, friendly and very accommodating.",
                  author: "Ashleigh Jade",
                  role: "Google Review"
                },
                {
                  text: "Always reliable, fast, quality service at an excellent price. You cannot find a better alterations shop. Thank you Lammys!",
                  author: "Nic Anthony",
                  role: "Google Review"
                },
                {
                  text: "I had alterations done recently and u guys did a fantastic job also keys cut they worked like a dream ...well done.",
                  author: "Celia Kellett",
                  role: "Google Review"
                }
              ]}
            />
          </div>
        </div>

        {/* Location section */}
        <div id="location" className="py-16 bg-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Find Us
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Conveniently located in the heart of the city
              </p>
            </div>
            <div className="mt-10 sm:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-6">
                <div className="mt-5 md:mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <MapPin className="h-6 w-6 text-secondary" />
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=36+Eighth+Ave+Maylands+WA+6051"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      >
                        36 Eighth Ave, Maylands WA 6051
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-secondary" />
                      <span className="ml-3 text-gray-700">
                        Monday-Friday: 9am-5pm<br />
                        Saturday: 9am-1pm<br />
                        Sunday: Closed
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-6 w-6 text-blue-600" />
                      <span className="ml-3 text-gray-700">0483 876 223</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                      <a 
                        href="mailto:team@lammys.au"
                        className="ml-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      >
                        team@lammys.au
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 flex items-center justify-center">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Our Location
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}