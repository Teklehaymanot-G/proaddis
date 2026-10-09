// src/components/Portfolio.jsx
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useContent } from "../content/ContentContext";
import { assetUrl } from "../lib/api";

const FEATURED_COUNT = 3;

const Portfolio = () => {
  const { portfolio } = useContent();
  const { projects, categories } = portfolio;
  const filters = [{ key: "all", label: "All Projects" }, ...categories];
  const labelOf = (key) =>
    categories.find((category) => category.key === key)?.label || key;

  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, FEATURED_COUNT);

  const countFor = (key) =>
    key === "all"
      ? projects.length
      : projects.filter((project) => project.category === key).length;

  const toggleShowAll = (next) => {
    setShowAll(next);
    setTimeout(() => {
      document.getElementById("portfolio").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <section
      id="portfolio"
      className="section relative overflow-hidden bg-brand-950"
    >
      <div className="grid-texture pointer-events-none absolute inset-0"></div>
      <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-600/20 blur-[120px]"></div>

      <div className="shell relative">
        <SectionHeading
          dark
          eyebrow={portfolio.eyebrow}
          title={portfolio.title}
          description={portfolio.description}
        />

        {/* Filter buttons */}
        <Reveal className="-mx-6 mb-10 overflow-x-auto px-6 pb-2 lg:mx-0 lg:px-0">
          <div
            role="group"
            aria-label="Filter projects"
            className="flex w-max gap-2"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setActiveFilter(filter.key);
                    setShowAll(false);
                  }}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-white text-brand-900"
                      : "border border-white/10 bg-white/5 text-brand-100/80 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`text-xs tabular-nums ${
                      isActive ? "text-brand-600" : "text-brand-100/40"
                    }`}
                  >
                    {countFor(filter.key)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Projects grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project, index) => {
            const Card = project.liveUrl ? "a" : "div";
            const linkProps = project.liveUrl
              ? {
                  href: project.liveUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "aria-label": `Visit ${project.title}`,
                }
              : {};

            return (
              // key includes the filter so cards re-run their reveal on change
              <Reveal
                key={`${activeFilter}-${project.title}-${index}`}
                delay={(index % 3) * 100}
              >
                <Card
                  {...linkProps}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-brand-300/40 hover:bg-white/[0.06]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-800 to-brand-900">
                    <img
                      src={assetUrl(project.image)}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-brand-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      {labelOf(project.category)}
                    </span>
                    {project.liveUrl ? (
                      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-900 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        <ArrowUpRight size={18} />
                      </span>
                    ) : (
                      <span className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-100/60">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(project.technologies || []).map((tech, techIndex) => (
                        <span key={`${tech}-${techIndex}`} className="chip-dark">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* View More / View Less */}
        {filteredProjects.length > FEATURED_COUNT && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => toggleShowAll(!showAll)}
              className={showAll ? "btn-ghost" : "btn-light"}
            >
              {showAll
                ? "Show Featured Only"
                : `View All Projects (${filteredProjects.length - FEATURED_COUNT} more)`}
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
