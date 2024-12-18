'use client';

import Footer from '@/components/ui/Footer';

export default function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
            
            <div className="space-y-6 text-gray-600">
              <p className="text-sm text-gray-500">Effective Date: January 1, 2024</p>

              <div className="prose max-w-none">
                <p>
                  Welcome to Lammy&apos;s Multi Services, these Terms and Conditions (&quot;Terms&quot;) outline the rules and regulations for using our services. 
                  By engaging with us, you agree to be bound by these Terms. If you do not agree, please refrain from using our services.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">1. Services Offered</h2>
                <p>
                  Lammy&apos;s Multi Services provides a variety of property maintenance and cleaning services, including but not limited to tree removal, 
                  garden maintenance, lawn mowing, pressure cleaning, gutter cleaning, and general property maintenance. Specific terms may apply to 
                  individual services, which will be communicated to you at the time of booking.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">2. Bookings and Payments</h2>
                <ul className="list-disc ml-6">
                  <li><strong>Service Requests:</strong> All service requests must be submitted via our website booking system, phone, or email.</li>
                  <li><strong>Quotations:</strong> Any quotes provided are valid for 14 days and subject to final confirmation after site inspection.</li>
                  <li><strong>Payments:</strong> We accept credit/debit cards, bank transfers, and cash payments. Payment terms will be specified in your service agreement.</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Cancellations and Refunds</h2>
                <ul className="list-disc ml-6">
                  <li><strong>Cancellations:</strong> Please notify us at least 48 hours in advance of your scheduled service. Late cancellations may incur a fee of up to 50% of the quoted service price.</li>
                  <li><strong>Refunds:</strong> Refund requests must be submitted within 7 days of service completion and will be assessed on a case-by-case basis.</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Liability and Warranty</h2>
                <ul className="list-disc ml-6">
                  <li><strong>Service Quality:</strong> We guarantee our workmanship and will address any concerns raised within 7 days of service completion.</li>
                  <li><strong>Limitation of Liability:</strong> While we exercise due care, we are not liable for:
                    <ul className="list-disc ml-6">
                      <li>Pre-existing property damage or defects</li>
                      <li>Damage caused by natural events or circumstances beyond our control</li>
                      <li>Indirect, incidental, or consequential damages</li>
                    </ul>
                  </li>
                  <li><strong>Maximum Liability:</strong> Our liability is limited to the cost of the service provided.</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">5. Customer Obligations</h2>
                <ul className="list-disc ml-6">
                  <li>Provide accurate and complete information regarding service requirements</li>
                  <li>Ensure safe access to the service area</li>
                  <li>Inform us of any potential hazards or special considerations</li>
                  <li>Be available or contactable during the scheduled service time</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">6. Privacy</h2>
                <p>
                  We respect your privacy and handle your personal information in accordance with our Privacy Policy. By using our services, 
                  you consent to the collection and use of your information as outlined in the policy.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">7. Intellectual Property</h2>
                <p>
                  All materials, content, and branding used in connection with our services remain the property of Lammy&apos;s Multi Services. 
                  You may not copy, reproduce, or use our intellectual property without our prior written consent.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">8. Dispute Resolution</h2>
                <p>
                  In the event of a dispute, we encourage you to contact us directly to seek resolution. If the matter cannot be resolved, 
                  it will be subject to the jurisdiction of the courts in Western Australia.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">9. Changes to Terms</h2>
                <p>
                  We reserve the right to update these Terms at any time. Any changes will be communicated via our website. 
                  Continued use of our services constitutes acceptance of the updated Terms.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-6">10. Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                  <br />
                  Lammy&apos;s Multi Services<br />
                  Phone: 0483 876 223<br />
                  Email: team@lammys.au<br />
                  Address: 36 Eighth Ave, Maylands WA 6051
                </p>

                <p className="mt-6">
                  By engaging our services, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
