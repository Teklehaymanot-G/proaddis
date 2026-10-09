// src/components/Testimonials.jsx
import { Star, Quote } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../content/ContentContext";

const Testimonials = () => {
  const { testimonials: section } = useContent();
  const testimonials = section.items;

  return (
    <section id="testimonials" className="section bg-white">
      <div className="shell">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={`${testimonial.author}-${index}`} delay={index * 100}>
              <figure className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:border-brand-200 hover:bg-white hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-0.5"
                    role="img"
                    aria-label="5 out of 5 stars"
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="fill-amber-400 text-amber-400"
                        size={16}
                      />
                    ))}
                  </div>
                  <Quote className="text-brand-200" size={28} />
                </div>

                <blockquote className="mt-6 flex-1 font-display text-lg font-medium leading-relaxed text-ink">
                  “{testimonial.quote}”
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4 border-t border-slate-200 pt-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-semibold text-white">
                    {String(testimonial.author || "")
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-slate-500">
                      {testimonial.position}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
