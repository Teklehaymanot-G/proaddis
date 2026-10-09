// src/components/Process.jsx
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../content/ContentContext";
import { getIcon } from "../content/icons";

const Process = () => {
  const { process } = useContent();
  const { steps } = process;

  return (
    <section id="process" className="section bg-white">
      <div className="shell">
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          description={process.description}
        />

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200 md:block"
          ></div>

          <ol className="grid gap-10 md:auto-cols-fr md:grid-flow-col md:gap-6">
          {steps.map((step, index) => {
            const Icon = getIcon(step.icon);
            return (
              <Reveal as="li" key={`${step.title}-${index}`} delay={index * 100}>
                <div className="group relative flex gap-5 md:block">
                  <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-600 shadow-soft transition-colors duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <div className="md:mt-7">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
};
export default Process;
