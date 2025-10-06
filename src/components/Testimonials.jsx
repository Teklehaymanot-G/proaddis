// Create src/components/Testimonials.jsx
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "ProAddis transformed our brand presence in Ethiopia. Their data-driven approach delivered exceptional results.",
      author: "War Academy Strength Co. Ltd",
      position: "CEO",
    },
    {
      quote:
        "The team's understanding of the local market combined with international standards is remarkable.",
      author: "Abay Esdee Paints",
      position: "Marketing Manager",
    },
    {
      quote:
        "From strategy to execution, ProAddis delivered beyond our expectations. True partners in growth.",
      author: "Grace Trading",
      position: "Director",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-xl text-gray-600">
            What our clients say about working with us
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 relative shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote
                className="text-blue-100 absolute top-6 right-6 opacity-40"
                size={32}
              />

              {/* Avatar and rating row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" size={16} />
                  ))}
                </div>
              </div>

              <blockquote className="text-gray-700 mb-6 italic text-sm md:text-base">
                “{testimonial.quote}”
              </blockquote>

              {/* Optional footer could go here */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
