// Create src/components/CaseStudies.jsx
import { ExternalLink, Eye, BarChart3, Users } from "lucide-react";

const CaseStudies = () => {
  const caseStudies = [
    {
      client: "War Academy Strength Co. Ltd",
      challenge: "Low brand recognition in competitive education market",
      solution: "Comprehensive branding strategy with digital marketing",
      results: "300% increase in enrollment, 150% brand awareness growth",
      image: "/images/case-studies/war-academy.jpg",
      services: ["Brand Strategy", "Digital Advertising", "PR Campaign"],
    },
    {
      client: "Abay Esdee Paints",
      challenge: "Market saturation with international paint brands",
      solution: "Localized branding and distribution network expansion",
      results: "40% sales growth, expanded to 3 new regions",
      image: "/images/case-studies/abay-esdee.jpg",
      services: [
        "Distribution Strategy",
        "Brand Positioning",
        "Packaging Design",
      ],
    },
    // Add more case studies
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Success Stories
        </h2>
        <div className="grid gap-8">
          {caseStudies.map((study, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{study.client}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-600">Challenge</h4>
                      <p>{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-600">
                        Solution
                      </h4>
                      <p>{study.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600">Results</h4>
                      <p>{study.results}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <img
                    src={study.image}
                    alt={study.client}
                    className="rounded-2xl mb-4"
                  />
                  <div className="flex flex-wrap gap-2">
                    {study.services.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
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
