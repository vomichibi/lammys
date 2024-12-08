'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    // Here you would typically send the form data to your backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleOpenGoogleMaps = () => {
    const address = '36 Eighth Ave, Maylands WA 6051, Australia';
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-secondary/10 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Contact Information Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Got questions about our services? We're here to help! Reach out through our contact form, 
            give us a call, or visit our store. Our friendly team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Methods */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all hover:scale-[1.02] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Get in Touch
            </h2>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 mr-4 p-2 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-all">
                  <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <a 
                    href="tel:0483876223"
                    className="text-gray-600 hover:text-secondary transition-colors duration-200 font-semibold"
                  >
                    0483 876 223
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 mr-4 p-2 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-all">
                  <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <a 
                    href="mailto:team@lammys.au"
                    className="text-gray-600 hover:text-secondary transition-colors duration-200 font-semibold"
                  >
                    team@lammys.au
                  </a>
                  <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 mr-4 p-2 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-all">
                  <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Location</h3>
                  <button 
                    onClick={handleOpenGoogleMaps}
                    className="text-gray-600 hover:text-secondary transition-colors duration-200 text-left font-semibold"
                  >
                    36 Eighth Ave, Maylands WA 6051
                  </button>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start group">
                <div className="flex-shrink-0 mr-4 p-2 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-all">
                  <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>
                  <div className="mt-1 space-y-1 text-gray-600">
                    <p>Monday: 9 am–5 pm</p>
                    <p>Tuesday: 9 am–5 pm</p>
                    <p>Wednesday: 9 am–5 pm</p>
                    <p>Thursday: 9 am–5 pm</p>
                    <p>Friday: 9 am–5 pm</p>
                    <p>Saturday: 9 am–1 pm</p>
                    <p className="text-gray-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all hover:scale-[1.02] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black/90 mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required 
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black/90 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black/90 mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black/90 mb-2">Subject</label>
                <select
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="service">Service Question</option>
                  <option value="booking">Booking Issue</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black/90 mb-2">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${submitStatus === 'loading' ? 'bg-primary' : 'bg-primary hover:bg-primary-dark'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Something went wrong. Please try again later.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
          <div className="w-full h-[450px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3386.146741907736!2d115.88884337645949!3d-31.92977598124055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32baf380f6d011%3A0xd2f2c713b6db2a9d!2sLammy&#39;s%20Multi%20Service!5e0!3m2!1sen!2sau!4v1699405283644!5m2!1sen!2sau"
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lammy's Multi Service Location Map"
              aria-label="Google Maps showing Lammy's Multi Service location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
