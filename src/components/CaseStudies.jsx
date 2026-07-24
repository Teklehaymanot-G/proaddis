// src/components/CaseStudies.jsx
import { Target, TrendingUp, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CaseStudies = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);

  const caseStudies = [
    {
      id: 1,
      client: "Warka Academy Strength Co. Ltd",
      industry: "Education",
      challenge: "Low brand recognition in a competitive education market.",
      solution:
        "Comprehensive branding strategy combined with a targeted digital marketing campaign.",
      results:
        "300% increase in student enrollment & 150% growth in brand awareness.",
      image: "/projects/warka-website.png",
      metrics: [
        { label: "Enrollment Growth", value: "+300%" },
        { label: "Brand Awareness", value: "+150%" },
        { label: "ROI", value: "4.5x" },
      ],
      services: ["Brand Strategy", "Digital Advertising", "PR Campaign"],
    },
    {
      id: 2,
      client: "Abay Esdee Paints",
      industry: "Manufacturing",
      challenge: "Facing market saturation from international paint brands.",
      solution:
        "Developed a localized branding strategy and expanded the distribution network.",
      results: "40% sales growth and expansion into 3 new regions.",
      image: "/projects/abay tiktok.png",
      metrics: [
        { label: "Sales Growth", value: "+40%" },
        { label: "New Regions", value: "3" },
        { label: "Market Share", value: "+12%" },
      ],
      services: [
        "Distribution Strategy",
        "Brand Positioning",
        "Packaging Design",
      ],
    },
  ];

  // Only show these two
  const displayedCaseStudies = caseStudies;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            displayedCaseStudies.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => {
                  if (!prev.includes(index)) return [...prev, index];
                  return prev;
                });
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-blue-200">
            <Award className="text-[#006AAB]" size={24} />
            <span className="text-[#005F94] font-semibold">
              Success Stories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006AAB] to-[#72BBDA]">
              Case Studies
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real results from real partnerships.
          </p>
        </div>

        {/* Case Studies – no cards, just clean rows */}
        <div className="flex flex-col gap-12 max-w-5xl mx-auto">
          {displayedCaseStudies.map((study, index) => (
            <div
              key={study.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-700 ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Image */}
              <div
                className={`order-1 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}
              >
                <img
                  src={study.image}
                  alt={study.client}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg" // mild shadow, not a card
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x400/006AAB/FFFFFF?text=Case+Study";
                  }}
                />
              </div>

              {/* Content */}
              <div
                className={`space-y-4 ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}
              >
                <div>
                  <span className="text-sm font-medium text-[#006AAB] uppercase tracking-wider bg-blue-100 px-3 py-1 rounded-full">
                    {study.industry}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2">
                    {study.client}
                  </h3>
                </div>

                <div className="flex items-start gap-3">
                  <Target
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-700">Challenge</h4>
                    <p className="text-gray-600 text-sm">{study.challenge}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp
                    className="text-purple-600 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-700">Solution</h4>
                    <p className="text-gray-600 text-sm">{study.solution}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-6 pt-2">
                  {study.metrics.map((metric, idx) => (
                    <div key={idx}>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#006AAB] to-[#72BBDA]">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {study.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
