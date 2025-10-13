// src/components/Clients.jsx
import { useState, useRef, useEffect } from "react";

const Clients = () => {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const clients = [
    {
      name: "Warka Academy",
      logo: "logos/warka.png",
      category: "Education",
      project: "Complete Branding & Marketing Strategy",
    },
    {
      name: "Abay Esdee Paints",
      logo: "logos/abay.png",
      category: "Manufacturing",
      project: "Distribution Strategy & Digital Advertising",
    },
    {
      name: "Little Limited",
      logo: "logos/little.png",
      category: "Transportation",
      project: "Packaging Design & Traditional Advertising",
    },
    {
      name: "Valtra Logistics",
      logo: "logos/VALTRA Logistics.jpg",
      category: "Transportation",
      project: "Brand Identity & Market Positioning",
    },
    {
      name: "Visa",
      logo: "logos/visa.png",
      category: "Finance",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Bank of Abyssinia",
      logo: "logos/BOA.png",
      category: "Finance",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Sika Chemical Engineering",
      logo: "logos/sika.jpg",
      category: "Manufacturing",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Alema Farms",
      logo: "logos/alema farms.jpg",
      category: "Agro Industry",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "E-Mecce Agro",
      logo: "logos/e mecce agro.png",
      category: "Agro Industry",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Dreamliner Hotel",
      logo: "logos/dreamliner.webp",
      category: "Hotel",
      project: "E-commerce Development & Digital Marketing",
    },
    {
      name: "Meneshaye",
      logo: "logos/meneshaye.png",
      category: "Kids Products",
      project: "Megazine Ad.",
    },
    {
      name: "Doue Dutch Vodka",
      logo: "logos/Doue Dutch Vodka.png",
      category: "Beverages",
      project: "Printing Services",
    },
    {
      name: "Fresco Juice",
      logo: "logos/fresco.webp",
      category: "Logo Design",
      project: "Logo Design",
    },
  ];

  const filteredClients = clients;

  // Duplicate clients for seamless infinite loop
  const duplicatedClients = [
    ...filteredClients,
    ...filteredClients,
    ...filteredClients,
  ];

  // JavaScript-based scroll animation as fallback
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let animationFrameId;
    let startTime = null;
    const duration = 40000; // 40 seconds for full scroll

    const animateScroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // Calculate scroll position (0% to 33.333% since we have 3 copies)
      const scrollPosition = (progress / duration) * 33.333;

      container.style.transform = `translateX(-${scrollPosition}%)`;

      // Reset when complete
      if (progress > duration) {
        startTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(animateScroll);
    };

    // Start animation after a short delay
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animateScroll);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [filteredClients]);

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="text-center ">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Valued Clients
          </h2>
        </div>

        {/* Single Row - Infinite Horizontal Scroll */}
        <div className="relative overflow-hidden py-8">
          <div
            ref={scrollContainerRef}
            className="flex space-x-8 min-w-max transition-transform duration-1000 ease-linear"
          >
            {duplicatedClients.map((client, index) => (
              <div
                key={`client-${index}`}
                className="flex-shrink-0 bg-white rounded-2xl p-6 flex items-center justify-center transition-all duration-300 border border-gray-100 shadow-lg min-w-[160px] h-28 hover:shadow-xl hover:scale-105"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-14 max-w-[130px] object-contain mx-auto"
                />
              </div>
            ))}
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
