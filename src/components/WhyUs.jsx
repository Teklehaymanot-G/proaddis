// src/components/WhyUs.jsx
import { useState, useEffect, useRef } from "react";
import Reveal from "./Reveal";
import Emphasis from "./Emphasis";
import { useContent } from "../content/ContentContext";
import { getIcon } from "../content/icons";

const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;
    let animationFrame;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let startTime = null;

        const animateCount = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const percentage = Math.min(progress / duration, 1);

          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
          setCount(Math.floor(easeOutQuart * end));

          if (progress < duration) {
            animationFrame = requestAnimationFrame(animateCount);
          } else {
            setCount(end);
          }
        };

        animationFrame = requestAnimationFrame(animateCount);
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return (
    <span ref={countRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

const WhyUs = () => {
  const { about } = useContent();
  const { features, stats } = about;

  return (
    <section
      id="about"
      className="section relative overflow-hidden bg-brand-950 text-white"
    >
      {/* Background: soft glow + faint grid */}
      <div className="grid-texture pointer-events-none absolute inset-0"></div>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px]"></div>

      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Intro */}
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <span className="eyebrow mb-5 !text-brand-300">
                {about.eyebrow}
              </span>
              <h2 className="display text-white">
                Why Choose{" "}
                <span className="whitespace-nowrap">
                  Pr
                  <img
                    src="logos/mark.png"
                    alt="o"
                    className="mx-[0.02em] inline h-[0.62em] w-auto align-baseline"
                  />
                  Addis?
                </span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-100/70">
                <Emphasis text={about.intro} className="font-medium text-white" />
              </p>
              <p className="mt-8 border-l-2 border-brand-300 pl-4 font-display text-base italic text-brand-200">
                &ldquo;{about.quote}&rdquo;
              </p>
            </div>
          </Reveal>

          {/* Feature grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {features.map((feature, index) => {
              const Icon = getIcon(feature.icon);
              return (
                <Reveal key={`${feature.title}-${index}`} delay={(index % 2) * 100}>
                  <div className="group flex h-full gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-brand-300/40 hover:bg-white/[0.06] sm:block sm:p-7">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-300 ring-1 ring-inset ring-brand-300/20 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white sm:mb-6">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-brand-100/60 sm:mt-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Stats with animated counters */}
        <Reveal className="mt-16 md:mt-20">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="flex flex-col-reverse gap-2 bg-brand-950 p-5 sm:p-7 md:p-9"
              >
                <dt className="text-sm text-brand-100/60">{stat.label}</dt>
                <dd className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                  <Counter
                    end={Number(stat.number) || 0}
                    duration={2500}
                    suffix={stat.suffix}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyUs;
