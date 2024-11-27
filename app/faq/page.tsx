'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  description: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "Dry Cleaning",
    description: "Common questions about our dry cleaning services",
    items: [
      {
        question: "What types of garments do you dry clean?",
        answer: "We handle all types of garments including suits, dresses, coats, shirts, pants, and delicate items like silk and wool. We also clean household items such as curtains, bedding, and upholstery."
      },
      {
        question: "How long does dry cleaning take?",
        answer: "Standard dry cleaning service typically takes 2-3 business days. We also offer express service with same-day or next-day delivery for an additional fee."
      },
      {
        question: "Do you remove tough stains?",
        answer: "Yes, we specialize in stain removal and use professional-grade products and techniques. However, some stains may be permanent depending on the type of stain and how long it has set."
      },
      {
        question: "What is your pricing for dry cleaning?",
        answer: "Our dry cleaning prices start from $8 for basic items like shirts and pants. Prices vary based on the item type, fabric, and any special handling required. Please visit our pricing page for detailed information."
      }
    ]
  },
  {
    title: "Alterations",
    description: "Information about our clothing alteration services",
    items: [
      {
        question: "What types of alterations do you offer?",
        answer: "We offer a full range of alterations including hemming, taking in/letting out garments, sleeve adjustments, zipper replacement, and custom modifications. We work on all types of clothing from casual wear to formal attire."
      },
      {
        question: "How long do alterations take?",
        answer: "Simple alterations like hemming can be completed in 1-2 days. More complex alterations may take 3-5 days. We offer rush service for an additional fee."
      },
      {
        question: "Do you do wedding dress alterations?",
        answer: "Yes, we specialize in wedding dress alterations. We recommend scheduling these alterations at least 6-8 weeks before the wedding date to allow time for multiple fittings if needed."
      },
      {
        question: "How much do alterations cost?",
        answer: "Alteration costs vary depending on the complexity of the work. Basic hemming starts at $15, while more complex alterations are priced based on the work required. We provide exact quotes after examining the garment."
      }
    ]
  },
  {
    title: "Key Cutting",
    description: "Details about our key cutting services",
    items: [
      {
        question: "What types of keys can you duplicate?",
        answer: "We can duplicate most residential, commercial, and automotive keys. This includes standard house keys, padlock keys, and some basic car keys. However, we cannot duplicate certain high-security or restricted keys."
      },
      {
        question: "How long does key cutting take?",
        answer: "Most standard keys can be cut in 5-10 minutes while you wait. Multiple keys or more complex cuts may take longer."
      },
      {
        question: "Do you program car keys?",
        answer: "We offer basic car key cutting but do not program electronic key fobs or transponder keys. For these services, please contact your car dealer or a specialized automotive locksmith."
      },
      {
        question: "What is your pricing for key cutting?",
        answer: "Standard key cutting starts at $5 per key. Prices may vary based on the key type and complexity. Bulk discounts are available for multiple copies of the same key."
      }
    ]
  },
  {
    title: "General Information",
    description: "General questions about our services",
    items: [
      {
        question: "What are your operating hours?",
        answer: "We are open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We are closed on Sundays and public holidays."
      },
      {
        question: "Do you offer pickup and delivery?",
        answer: "Yes, we offer pickup and delivery services within a 5-mile radius of our store. You can schedule this service through our booking page."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and cash payments. We also offer contactless payment options."
      },
      {
        question: "What is your cancellation policy?",
        answer: "We require at least 24 hours notice for cancellations. Late cancellations or no-shows may incur a fee of 50% of the service price."
      }
    ]
  }
];

const FAQItem = ({ question, answer }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full py-4 text-left flex justify-between items-center hover:text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="py-4 text-gray-600">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = ({ title, description, items }: FAQSection) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="bg-white rounded-lg shadow-lg p-6">
      {items.map((faq, index) => (
        <FAQItem key={index} {...faq} />
      ))}
    </div>
  </div>
);

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Find answers to common questions about our services
        </p>
        {faqSections.map((section, index) => (
          <FAQSection key={index} {...section} />
        ))}
      </div>
    </div>
  );
}
