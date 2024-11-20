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

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: "max-w-4xl mx-auto",
    dotsClass: "slick-dots !bottom-[-3rem]",
    appendDots: (dots: any) => (
      <div style={{ bottom: "-3rem" }}>
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300 hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <span className="sr-only">Go to slide</span>
      </button>
    )
  };

  return (
    <div className="relative px-8 sm:px-16 pb-12">
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="px-2 sm:px-4">
            <blockquote className="mt-4">
              <div className="max-w-3xl mx-auto text-base sm:text-xl text-gray-600 text-center">
                <div className="relative inline-block">
                  <span className="text-3xl sm:text-5xl text-blue-500 absolute -left-4 sm:-left-8 -top-4 sm:-top-6 leading-none">"</span>
                  <p className="relative px-4 sm:px-8">
                    {testimonial.text}
                  </p>
                  <span className="text-3xl sm:text-5xl text-blue-500 absolute -right-2 sm:-right-4 -top-4 sm:-top-6 leading-none">"</span>
                </div>
                <footer className="mt-4 sm:mt-8">
                  <div className="flex flex-col items-center">
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm sm:text-base text-gray-500">{testimonial.role}</p>
                  </div>
                </footer>
              </div>
            </blockquote>
          </div>
        ))}
      </Slider>
    </div>
  );
}
