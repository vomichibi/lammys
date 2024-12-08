'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  text: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  service: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Next slide"
    >
      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    </button>
  );
};

export function TestimonialCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    arrows: false,
    swipe: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <Slider {...settings}>
          {[
            {
              text: "Absolutely amazing service! The team at Lammy's went above and beyond to ensure my car looked immaculate. Their attention to detail is unmatched.",
              author: "Michael Chen",
              role: "Regular Customer",
              location: "Perth",
              rating: 5,
              service: "Premium Detail Package"
            },
            {
              text: "I've been taking my cars to Lammy's for years now. Their ceramic coating service is top-notch, and the results always exceed my expectations.",
              author: "Sarah Thompson",
              role: "Loyal Client",
              location: "Maylands",
              rating: 5,
              service: "Ceramic Coating"
            },
            {
              text: "Professional, punctual, and perfect results every time. The paint correction they did on my vintage car was remarkable.",
              author: "James Wilson",
              role: "Classic Car Enthusiast",
              location: "Mount Lawley",
              rating: 5,
              service: "Paint Correction"
            },
            {
              text: "The interior detailing service was fantastic. They removed stains I thought would never come out. My car feels brand new!",
              author: "Emma Davis",
              role: "First-time Customer",
              location: "Bayswater",
              rating: 4,
              service: "Interior Detailing"
            },
            {
              text: "Great value for money. The team is knowledgeable, friendly, and truly cares about delivering the best results.",
              author: "David Miller",
              role: "Business Owner",
              location: "Perth CBD",
              rating: 5,
              service: "Full Detail Package"
            }
          ].map((testimonial, index) => (
            <div key={index} className="px-4 h-full">
              <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                      {testimonial.author[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary/10 rounded-full" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                <div className="relative flex-grow">
                  <svg
                    className="absolute -top-2 -left-2 w-8 h-8 text-primary/20"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative text-gray-600 leading-relaxed min-h-[6rem]">
                    {testimonial.text}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {testimonial.rating}.0 out of 5
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {testimonial.service}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
