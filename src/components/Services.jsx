// src/components/Services.jsx
import { useState, useRef, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Users,
  Package,
  Radio,
  Tv,
  Newspaper,
  Megaphone,
  Camera,
  Code,
  HeartHandshake,
} from "lucide-react";

const Services = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);

  const services = [
    {
      icon: <Target size={48} />,
      title: "Product Strategy",
      description:
        "Product positioning, branding, and lifecycle management analysis",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <TrendingUp size={48} />,
      title: "Price Strategy",
      description: "Data-driven pricing strategies for maximum profitability",
      color: "from-blue-600 to-purple-600",
    },
    {
      icon: <Package size={48} />,
      title: "Distribution Strategy",
      description: "Traditional and digital channel optimization",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Megaphone size={48} />,
      title: "Promotion Strategy",
      description: "Data-based promotion strategies for brand visibility",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <Tv size={48} />,
      title: "Traditional Advertising",
      description: "TV, Radio, Print, Billboards, Signage, and Packaging",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Users size={48} />,
      title: "Digital Advertising",
      description: "Search Engine, Social Media, and Display Advertising",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <HeartHandshake size={48} />,
      title: "Public Relations",
      description:
        "Media relations, corporate events, and reputation management",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Target size={48} />,
      title: "Branding Services",
      description: "Brand strategy, visual identity, and positioning",
      color: "from-cyan-500 to-purple-500",
    },
    {
      icon: <Camera size={48} />,
      title: "Photography & Videography",
      description: "Commercial, corporate, event, and social media content",
      color: "from-blue-500 to-pink-500",
    },
    {
      icon: <Code size={48} />,
      title: "Web Development",
      description: "ERP solutions, SEO, mobile apps, and e-commerce",
      color: "from-purple-600 to-blue-600",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            services.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 animate-fade-in-up border border-blue-200">
            <Target className="text-blue-600" size={24} />
            <span className="text-blue-700 font-semibold">Our Services</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            Innovative Marketing Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Powered by Data and Creative Excellence
          </p>

          {/* Updated Tags with Brand Colors */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              "Creative",
              "Innovative",
              "Data-Driven",
              "Strategic",
              "Impactful",
            ].map((tag, index) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg hover-lift transform transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100 + 500}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl p-6 hover-lift transition-all duration-500 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl ${
                visibleItems.includes(index)
                  ? "opacity-100 transform translate-y-0 scale-100"
                  : "opacity-0 transform translate-y-10 scale-95"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {service.description}
              </p>

              {/* Hover effect line */}
              <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 group-hover:w-12 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto shadow-2xl hover-lift transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Let's discuss how our data-driven marketing strategies can drive
              your success in the Ethiopian market.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover-lift transform hover:scale-105 transition-all duration-300 shadow-lg">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
