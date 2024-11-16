import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Lammy's Dry Cleaning</h1>
          <p className="text-xl mb-8">Professional Care for Your Finest Garments</p>
          <Link 
            href="/booking" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link 
                  href="/services" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const services = [
  {
    title: "Dry Cleaning",
    description: "Professional dry cleaning for all your delicate garments.",
  },
  {
    title: "Laundry Service",
    description: "Full-service laundry with attention to detail.",
  },
  {
    title: "Express Service",
    description: "Same-day service for urgent cleaning needs.",
  },
];

const features = [
  {
    icon: "⭐",
    title: "Quality Service",
    description: "Premium care for your garments",
  },
  {
    icon: "⚡",
    title: "Fast Turnaround",
    description: "Quick and efficient service",
  },
  {
    icon: "🌿",
    title: "Eco-Friendly",
    description: "Environmental conscious cleaning",
  },
  {
    icon: "💎",
    title: "Expert Care",
    description: "Experienced professionals",
  },
];
