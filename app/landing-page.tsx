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
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
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
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Services</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need, all in one place
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-6 sm:space-y-8 md:space-y-0 md:grid md:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <Link href="/services/dry-cleaning" className="block">
                  <div className="relative p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <dt className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white">
                        <Shirt className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-4 text-base sm:text-lg font-medium text-gray-900">Dry Cleaning</p>
                    </dt>
                  </div>
                </Link>

                <Link href="/services/alterations" className="block">
                  <div className="relative p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <dt className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white">
                        <Scissors className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-4 text-base sm:text-lg font-medium text-gray-900">Alterations</p>
                    </dt>
                  </div>
                </Link>

                <Link href="/services/key-cutting" className="block">
                  <div className="relative p-4 sm:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <dt className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white">
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
        <div id="about" className="bg-blue-50 py-16 lg:py-24">
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
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimonials</h2>
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
        <div id="location" className="py-16 bg-blue-50">
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
                      <MapPin className="h-6 w-6 text-blue-600" />
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
                      <Clock className="h-6 w-6 text-blue-600" />
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

        {/* Footer */}
        <footer className="bg-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344 1.064-.182 1.791-.398 2.427-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2024 Lammy's Multi Services. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}