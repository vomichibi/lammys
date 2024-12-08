'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Define FAQ items with more engaging content
const faqData = [
  {
    id: 1,
    icon: '🧼',
    title: 'Dry Cleaning Magic',
    question: 'How do you handle delicate fabrics?',
    answer: 'We use state-of-the-art cleaning techniques that are gentle on fabrics but tough on stains. Our experts carefully assess each garment to ensure the best cleaning method, preserving color, texture, and shape.',
    color: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    id: 2,
    icon: '✂️',
    title: 'Alteration Artistry',
    question: 'Can you do custom alterations?',
    answer: 'Absolutely! Our skilled tailors can transform any garment. From simple hem adjustments to complete redesigns, we turn your clothing dreams into reality. We specialize in precision fitting and creative modifications.',
    color: 'bg-green-50',
    hoverColor: 'hover:bg-green-100'
  },
  {
    id: 3,
    icon: '🔑',
    title: 'Key Cutting Precision',
    question: 'What types of keys can you duplicate?',
    answer: 'We cut keys for homes, offices, cars, and more! Using advanced key cutting technology, we ensure perfect duplicates for most standard and modern key types. Quick, accurate, and reliable key services.',
    color: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    id: 4,
    icon: '⏰',
    title: 'Turnaround Time',
    question: 'How quickly can you complete services?',
    answer: 'Most dry cleaning orders are ready within 24-48 hours. Alterations typically take 3-7 days depending on complexity. Key cutting is usually done while you wait! We prioritize speed without compromising quality.',
    color: 'bg-yellow-50',
    hoverColor: 'hover:bg-yellow-100'
  },
  {
    id: 5,
    icon: '💸',
    title: 'Pricing Transparency',
    question: 'How are your prices determined?',
    answer: 'We believe in fair, transparent pricing. Our rates are competitive and based on garment type, fabric, and complexity of service. No hidden fees - we provide upfront quotes for all our services.',
    color: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100'
  },
  {
    id: 6,
    icon: '🌍',
    title: 'Eco-Friendly Approach',
    question: 'Are your cleaning methods environmentally friendly?',
    answer: 'We\'re committed to sustainability! We use biodegradable cleaning solutions, minimize water waste, and continuously invest in eco-friendly technologies to reduce our environmental impact.',
    color: 'bg-teal-50',
    hoverColor: 'hover:bg-teal-100'
  }
];

export default function FAQPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/5 to-gray-100/5 py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black/90 mb-6 break-words">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Got questions? We've got answers! Dive into our most common inquiries about Lammy's services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 px-4 mb-16">
          {faqData.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: faq.id * 0.1 }}
              className={`
                relative rounded-xl shadow-lg overflow-hidden 
                transition-all duration-300 ease-in-out
                ${faq.color} ${faq.hoverColor}
                ${activeCard === faq.id ? 'z-10' : 'z-0'}
              `}
              style={{ 
                position: 'relative',
                height: activeCard === faq.id ? 'auto' : 'fit-content' 
              }}
            >
              <div 
                onClick={() => toggleCard(faq.id)}
                className="cursor-pointer p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{faq.icon}</span>
                  <h2 className="text-xl font-bold text-black/90">{faq.title}</h2>
                </div>
                {activeCard === faq.id ? (
                  <FaChevronUp className="text-black/60" />
                ) : (
                  <FaChevronDown className="text-black/60" />
                )}
              </div>

              <AnimatePresence>
                {activeCard === faq.id && (
                  <motion.div
                    key={`answer-${faq.id}`}
                    initial={{ 
                      opacity: 0, 
                      height: 0,
                      marginTop: 0
                    }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto',
                      marginTop: 16
                    }}
                    exit={{ 
                      opacity: 0, 
                      height: 0,
                      marginTop: 0
                    }}
                    transition={{ 
                      duration: 0.3,
                      type: "tween"
                    }}
                    className="px-6 pb-6 overflow-hidden"
                  >
                    <p className="text-black/80 text-base">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/90 rounded-xl shadow-lg p-10 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-black/90 mb-6">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-8">
              We're here to help! If you can't find the answer you're looking for, 
              don't hesitate to reach out to our friendly customer support team.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-secondary text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary/90 transition-all"
            >
              Contact Us
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
