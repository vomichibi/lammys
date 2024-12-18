'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services do you offer?",
    answer: "We offer a comprehensive range of services including dry cleaning, alterations, and key cutting. Our dry cleaning service handles all types of garments, from everyday wear to delicate items. Our alterations service can handle everything from simple hemming to complex garment modifications. We also provide professional key cutting services for most types of keys."
  },
  {
    question: "How long does dry cleaning take?",
    answer: "Standard dry cleaning service typically takes 2-3 working days. We also offer an express service for an additional fee, which can have your items ready within 24 hours. Please note that some specialty items or complex stains may require additional time."
  },
  {
    question: "Do you offer same-day service?",
    answer: "Yes, we offer same-day service for items dropped off before 10 AM, Monday through Friday. This service is available for an additional fee and is subject to capacity. Please contact us to confirm availability for same-day service."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, Apple Pay, Google Pay, and cash. For online bookings, payment is processed securely through our Stripe payment system."
  },
  {
    question: "Do you offer pickup and delivery?",
    answer: "Currently, we operate as a drop-off and collection service from our store location. We're working on implementing a pickup and delivery service in the near future."
  },
  {
    question: "How do I prepare my garments for dry cleaning?",
    answer: "Please remove all items from pockets and point out any stains or areas of concern to our staff. If you have any specific preferences for starch or pressing, please let us know when you drop off your items."
  },
  {
    question: "What if my garment is damaged during cleaning?",
    answer: "While we take utmost care with all items, if any damage occurs during the cleaning process, we have a comprehensive insurance policy. Please notify us within 24 hours of collection, and we'll assess the situation and make appropriate arrangements for compensation if necessary."
  },
  {
    question: "Can you handle delicate or specialty items?",
    answer: "Yes, we specialize in handling delicate and specialty items including wedding dresses, evening gowns, suits, and other high-end garments. Our experienced staff uses appropriate cleaning methods and products for different fabric types."
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment through our website by clicking the 'Book Now' button. Select your desired service, choose a convenient time slot, and complete the booking process. You'll receive a confirmation email with your booking details."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We understand that plans can change. You can cancel or reschedule your appointment up to 24 hours before your scheduled time without any charge. Cancellations within 24 hours may incur a fee."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Find answers to common questions about our services. If you can't find what you're looking for, please don't hesitate to contact us.
          </p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 py-4 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Still have questions? We're here to help!
            </p>
            <div className="mt-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
