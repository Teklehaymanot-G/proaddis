// src/components/Portfolio.jsx
import { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  Github,
  Target,
  Filter,
  ChevronDown,
} from "lucide-react";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleItems, setVisibleItems] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "Abay Paints Social Media Campaign",
      category: "social media",
      image: "projects/abay tiktok.png",
      description: "Social media marketing campaign for Abay Paints",
      technologies: ["FaceBook", "TikTok", "Instagram", "Telegram"],
      liveUrl: "https://www.tiktok.com/@abayesdeepaints",
    },
    {
      id: 2,
      title: "Warka Academy Social Media Campaign",
      category: "social media",
      image: "projects/warka tiktok.png",
      description: "Social media marketing campaign for Warka Academy",
      technologies: ["FaceBook", "TikTok", "Instagram", "Telegram"],
      liveUrl: "https://www.tiktok.com/@warkaacademy",
    },
    {
      id: 3,
      title: "Valtra Logistics",
      category: "website",
      image:
        "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500",
      description: "Website development for valtra logistics",
      technologies: ["WordPress"],
      liveUrl: "https://www.valtralogistics.com",
    },
    {
      id: 4,
      title: "Valtra Logistics Logo Design",
      category: "web",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
      description: "Logo design for Valtra Logistics",
      technologies: ["Logo", "Brand Color", "Letterhead Design"],
    },
    {
      id: 5,
      title: "Sika Chemical Engineering Sinage",
      category: "mobile",
      image: "projects/sika sinage.jpg",
      description: "Signage design for Sika Chemical Engineering",
      technologies: ["Signage", "Lightbox"],
    },
    {
      id: 6,
      title: "Sika Chemical Engineering Production",
      category: "mobile",
      image: "projects/sika production.jpg",
      description: "Production design for Sika Chemical Engineering",
      technologies: ["Production"],
    },
    {
      id: 8,
      title: "Tap & Go Campaign",
      category: "marketing",
      image: "projects/tap & go.jpg",
      description: "Tap & Go Campaign for Little, Visa & Bank of Abyssinia",
      technologies: ["Outdoor Screen", "QR Code Scanner", "Analytics"],
    },
  ];

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "web", label: "Web Development" },
    { key: "mobile", label: "Mobile Apps" },
    { key: "design", label: "Design" },
    { key: "marketing", label: "Marketing" },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  // Show only 3 projects initially, then all when "View More" is clicked
  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems([]);
            filteredProjects.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [activeFilter]);

  const handleViewMore = () => {
    setShowAll(true);
    // Scroll to the portfolio section when showing more
    setTimeout(() => {
      document.getElementById("portfolio").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleViewLess = () => {
    setShowAll(false);
    // Scroll to the portfolio section when showing less
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
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-[#001827] to-[#006AAB] relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 animate-fade-in-up border border-blue-500/30">
            <Filter className="text-blue-300" size={24} />
            <span className="text-blue-200 font-semibold">Projects</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Our{" "}
            <span className="bg-gradient-to-r from-[#006AAB] to-[#72BBDA] bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
        </div>

        {/* Updated Filter Buttons with Brand Colors */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter, index) => (
            <button
              key={filter.key}
              onClick={() => {
                setActiveFilter(filter.key);
                setShowAll(false);
              }}
              className={`group px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift relative overflow-hidden ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white shadow-lg transform scale-105"
                  : "bg-white/10 backdrop-blur-sm text-blue-100 border border-blue-500/30 hover:border-blue-400"
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {activeFilter === filter.key && <Target size={16} />}
                {filter.label}
              </span>
              {activeFilter === filter.key && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#006AAB] to-[#72BBDA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              )}
            </button>
          ))}
        </div>

        {/* Projects Counter */}
        <div className="text-center mb-8">
          <p className="text-blue-200">
            Showing {displayedProjects.length} of {filteredProjects.length}{" "}
            projects
            {filteredProjects.length > 3 &&
              !showAll &&
              " (3 featured projects)"}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-blue-400/50 transition-all duration-500 hover-lift ${
                visibleItems.includes(index)
                  ? "opacity-100 transform translate-y-0 scale-100"
                  : "opacity-0 transform translate-y-10 scale-95"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative group overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {project.liveUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center gap-4 p-6">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      className="bg-white text-blue-600 p-3 rounded-full hover-lift transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 hover:scale-110"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white text-xs font-semibold rounded-full shadow-lg">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-blue-100 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More / View Less Button */}
        {filteredProjects.length > 3 && (
          <div className="text-center mt-12">
            {!showAll ? (
              <button
                onClick={handleViewMore}
                className="group bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white px-8 py-4 rounded-2xl font-semibold hover-lift transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3 mx-auto animate-fade-in-up"
              >
                <span>View All Projects</span>
                <ChevronDown
                  size={20}
                  className="group-hover:translate-y-1 transition-transform duration-300"
                />
                <span className="text-blue-200 text-sm ml-2">
                  ({filteredProjects.length - 3} more)
                </span>
              </button>
            ) : (
              <button
                onClick={handleViewLess}
                className="group bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white px-8 py-4 rounded-2xl font-semibold hover-lift transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3 mx-auto animate-fade-in-up"
              >
                <span>Show Featured Only</span>
                <ChevronDown
                  size={20}
                  className="group-hover:-translate-y-1 transition-transform duration-300 rotate-180"
                />
              </button>
            )}
          </div>
        )}

        {/* Portfolio CTA */}
        {/* <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 max-w-4xl mx-auto hover-lift transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch to discuss
              your next project.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover-lift transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto">
              <Target size={20} />
              Start Your Project
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Portfolio;
