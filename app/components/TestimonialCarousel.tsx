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
}

const defaultTestimonials: Testimonial[] = [
  {
    text: "The quality of service at Lammy's is exceptional. My clothes always come back looking brand new!",
    author: "Sarah Johnson",
    role: "Regular Customer"
  },
  {
    text: "Quick, efficient, and professional key cutting service. I'm very impressed!",
    author: "Michael Chen",
    role: "Business Owner"
  },
  {
    text: "Their alterations service is top-notch. They fixed my favorite suit perfectly.",
    author: "David Williams",
    role: "Customer"
  }
];

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
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

export function TestimonialCarousel({ testimonials = defaultTestimonials }: TestimonialCarouselProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="relative px-8 sm:px-16 pb-12">
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="px-2 sm:px-4">
            <blockquote className="mt-4">
              <div className="max-w-3xl mx-auto text-base sm:text-xl text-gray-600 text-center">
                "{testimonial.text}"
              </div>
              <footer className="mt-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-base font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        ))}
      </Slider>
    </div>
  );
}
