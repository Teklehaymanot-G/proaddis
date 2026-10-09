// src/components/CaseStudies.jsx
import { Target, TrendingUp } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../content/ContentContext";
import { assetUrl } from "../lib/api";

const CaseStudies = () => {
  const { caseStudies: section } = useContent();
  const caseStudies = section.items;

  return (
    <section id="case-studies" className="section bg-slate-50">
      <div className="shell">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="flex flex-col gap-8">
          {caseStudies.map((study, index) => (
            <Reveal key={`${study.client}-${index}`}>
              <article className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
                {/* Image */}
                <div
                  className={`relative min-h-[16rem] bg-brand-50 ${
                    index % 2 === 0 ? "" : "lg:order-2"
                  }`}
                >
                  <img
                    src={assetUrl(study.image)}
                    alt={study.client}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col p-8 md:p-12">
                  <span className="chip self-start uppercase tracking-wider">
                    {study.industry}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                    {study.client}
                  </h3>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        <Target size={15} className="text-brand-600" />
                        Challenge
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {study.challenge}
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        <TrendingUp size={15} className="text-brand-600" />
                        Solution
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-slate-200 py-6">
                    {(study.metrics || []).map((metric, metricIndex) => (
                      <div
                        key={`${metric.label}-${metricIndex}`}
                        className="flex flex-col-reverse gap-1"
                      >
                        <dt className="text-xs text-slate-500">
                          {metric.label}
                        </dt>
                        <dd className="font-display text-2xl font-bold tracking-tight text-brand-600 md:text-4xl">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {/* Services */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(study.services || []).map((service, serviceIndex) => (
                      <span key={`${service}-${serviceIndex}`} className="chip">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
