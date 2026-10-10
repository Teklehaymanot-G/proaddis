// src/components/Services.jsx
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../content/ContentContext";
import { getIcon } from "../content/icons";

const Services = () => {
  const { services: section } = useContent();
  const { items: services, tags } = section;

  return (
    <section id="services" className="section bg-slate-50">
      <div className="shell">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        >
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <Reveal key={`${service.title}-${index}`} delay={(index % 4) * 80}>
                <a
                  href="#contact"
                  // Phones: icon beside the text. Larger screens: stacked card.
                  className="group relative flex h-full gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:flex-col sm:gap-0 sm:p-7"
                >
                  <div className="flex flex-shrink-0 items-start justify-between sm:mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <span className="hidden font-display text-sm font-semibold text-slate-300 sm:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:mt-2">
                      {service.description}
                    </p>
                    {/* Hover hint: only where there is a pointer to hover with */}
                    <span className="mt-6 hidden items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 lg:inline-flex">
                      Enquire
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
