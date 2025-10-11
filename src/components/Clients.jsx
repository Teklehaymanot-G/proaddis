// src/components/Clients.jsx
import { useState, useRef, useEffect } from "react";

const Clients = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);

  // Sample client logos - replace with actual client logos from your PDF
  const clients = [
    {
      name: "Warka Academy",
      logo: "warka.png",
      category: "Education",
      project: "Complete Branding & Marketing Strategy",
    },
    {
      name: "Abay Esdee Paints",
      logo: "abay.png",
      category: "Manufacturing",
      project: "Distribution Strategy & Digital Advertising",
    },
    {
      name: "Little Limited",
      logo: "little.png",
      category: "Transportation",
      project: "Packaging Design & Traditional Advertising",
    },
    {
      name: "Tranquil Forwarding",
      logo: "tranquil.jpg",
      category: "Transportation",
      project: "Brand Identity & Market Positioning",
    },
    {
      name: "Visa",
      logo: "visa.png",
      category: "Finance",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Bank of Abyssinia",
      logo: "BOA.png",
      category: "Finance",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Sika Chemical Engineering",
      logo: "sika.jpg",
      category: "Manufacturing",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Alema Farms",
      logo: "alema farms.jpg",
      category: "Agro Industry",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "E-Mecce Agro",
      logo: "e mecce agro.png",
      category: "Agro Industry",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Dreamliner Hotel",
      logo: "dreamliner.webp",
      category: "Hotel",
      project: "E-commerce Development & Digital Marketing",
    },
  ];

  const categories = [
    "All",
    "Education",
    "Transportation",
    "Manufacturing",
    "Finance",
    "Agro Industry",
    "Hotel",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredClients =
    activeCategory === "All"
      ? clients
      : clients.filter((client) => client.category === activeCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems([]);
            filteredClients.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index]);
              }, index * 100);
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
  }, [activeCategory]);

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            Our Valued Clients
          </h2>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Trusted by leading businesses and organizations across Ethiopia
          </p> */}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift ${
                activeCategory === category
                  ? "bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Clients Logos Grid (logo-only tiles) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredClients.map((client, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-4 flex items-center justify-center hover-lift transition-all duration-500 border border-gray-100 ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-6 scale-95"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className="max-h-12 object-contain mx-auto"
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { number: "50+", label: "Projects Completed" },
            { number: "30+", label: "Happy Clients" },
            { number: "5+", label: "Years Experience" },
            { number: "15+", label: "Team Members" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default Clients;
