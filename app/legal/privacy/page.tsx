'use client';

import Footer from '@/components/ui/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-screen bg-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-sm text-gray-600 mb-8">Effective Date: January 1, 2024</p>

            <p className="mb-8">
              Lammy&apos;s Multi Services (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) values your privacy and is committed to protecting 
              your personal information. This Privacy Policy explains how we collect, use, and protect the information 
              you provide to us when using our dry cleaning, alterations, and key cutting services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li>
                <strong>Contact Information:</strong> Your name, phone number, email address, and postal address for 
                service delivery and communication.
              </li>
              <li>
                <strong>Service Details:</strong> Information about your dry cleaning, alterations, or key cutting needs, 
                including garment details, fabric types, measurements, and service preferences.
              </li>
              <li>
                <strong>Payment Information:</strong> Payment details to process transactions securely through our 
                payment providers.
              </li>
              <li>
                <strong>Booking Information:</strong> Appointment dates, times, and service history to manage your 
                bookings effectively.
              </li>
              <li>
                <strong>Other Information:</strong> Any additional details you choose to provide when contacting us, 
                using our online booking system, or visiting our store.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>To provide and manage our services including dry cleaning, alterations, and key cutting</li>
              <li>To process and manage your online bookings</li>
              <li>To contact you regarding your orders or inquiries</li>
              <li>To process payments securely</li>
              <li>To send service notifications and updates</li>
              <li>To improve our services and customer experience</li>
              <li>To comply with legal requirements and resolve disputes</li>
              <li>For internal record-keeping and business analysis</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell, rent, or share your personal information with third parties, except:
            </p>
            <ul>
              <li>
                <strong>With Service Providers:</strong> To facilitate services such as payment processing, 
                appointment scheduling, or delivery services
              </li>
              <li>
                <strong>For Legal Compliance:</strong> To comply with legal obligations or enforce our terms 
                and conditions
              </li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information 
              from unauthorized access, use, or disclosure. While we strive to safeguard your information, no 
              method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of any inaccurate or incomplete information</li>
              <li>Request deletion of your personal information, subject to legal obligations</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Opt-out of our email notifications</li>
            </ul>

            <h2>6. Website and Online Booking</h2>
            <p>
              Our website uses cookies and similar technologies to improve your browsing and booking experience. 
              These cookies collect non-identifiable data such as your device type, browser type, and browsing 
              activity. You can manage your cookie preferences through your browser settings.
            </p>

            <h2>7. Updates to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal 
              obligations. The updated policy will be available on our website or by request.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions, concerns, or complaints regarding this Privacy Policy or the handling 
              of your personal information, please contact us at:
            </p>
            <p className="ml-4">
              Lammy&apos;s Multi Services<br />
              Address: 36 Eighth Ave, Maylands WA 6051<br />
              Email: team@lammys.au<br />
              Phone: 0483 876 223
            </p>

            <div className="mt-8 text-sm text-gray-600">
              <p>
                This Privacy Policy complies with Australian privacy laws, including the Privacy Act 1988 (Cth) 
                and the Australian Privacy Principles (APPs).
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
