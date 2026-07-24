// src/components/Portfolio.jsx
import { useState, useRef, useEffect } from "react";
import {
  ExternalLink,
  Target,
  Filter,
  ChevronDown,
  Globe,
  Share2,
  Palette,
  Smartphone,
  Megaphone,
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
      id: 10,
      title: "Yonatan BT Furniture Social Media",
      category: "social media", // now properly under "social media"
      image: "projects/yonathan.png",
      description: "Social media management for Yonatan BT Furniture",
      technologies: ["Instagram", "Facebook", "Content Creation"],
      liveUrl: "https://www.tiktok.com/@yonatanbtfurniture",
    },
    {
      id: 3,
      title: "Valtra Logistics",
      category: "website",
      image:
        "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500",
      description: "Website development for Valtra Logistics",
      technologies: ["WordPress"],
      liveUrl: "https://www.valtralogistics.com",
    },
    {
      id: 4,
      title: "Valtra Logistics Logo Design",
      category: "logo",
      image: "logos/valtra.jpg",
      description: "Logo design for Valtra Logistics",
      technologies: ["Logo", "Brand Color", "Letterhead Design"],
      liveUrl: "https://www.valtralogistics.com",
    },
    {
      id: 5,
      title: "Sika Chemical Engineering Signage",
      category: "mobile",
      image: "projects/sika sinage.jpg",
      description: "Signage design for Sika Chemical Engineering",
      technologies: ["Signage", "Lightbox"],
      liveUrl: "https://eth.sika.com/",
    },
    {
      id: 6,
      title: "Sika Chemical Engineering Production",
      category: "mobile",
      image: "projects/sika.png",
      description: "Production design for Sika Chemical Engineering",
      technologies: ["Production"],
      liveUrl: "https://eth.sika.com/",
    },
    {
      id: 8,
      title: "Tap & Go Campaign",
      category: "marketing",
      image: "projects/tap & go.jpg",
      description: "Tap & Go Campaign for Little, Visa & Bank of Abyssinia",
      technologies: ["Outdoor Screen", "QR Code Scanner", "Analytics"],
      liveUrl: "https://www.little.africa/",
    },
    // ----- NEW PROJECTS -----
    {
      id: 9,
      title: "Warka Academy Website",
      category: "website",
      image: "projects/warka-website.png",
      description: "Website development for Warka Academy",
      technologies: ["WordPress", "Custom Design"],
      liveUrl: "https://www.warkaacademy.com",
    },
    {
      id: 11,
      title: "Duratek Importer Website & Branding",
      category: "website",
      image: "projects/duratek-website.png",
      description: "Website development and branding for Duratek Importer",
      technologies: ["WordPress", "Brand Identity", "Logo Design"],
      liveUrl: "https://duratek-importer.com/",
    },
    {
      id: 12,
      title: "DTA Sales Marketing Campaign",
      category: "marketing",
      image: "projects/dta.png",
      description: "Sales marketing campaign for DTA",
      technologies: ["Strategy", "Digital Ads", "Lead Generation"],
    },
  ];

  // Filter definitions with icons
  const filters = [
    { key: "all", label: "All Projects", icon: Filter },
    { key: "web", label: "Web Development", icon: Globe },
    { key: "mobile", label: "Mobile Apps", icon: Smartphone },
    { key: "design", label: "Design", icon: Palette },
    { key: "social", label: "Social Media", icon: Share2 }, // NEW
    { key: "marketing", label: "Marketing", icon: Megaphone },
  ];

  // Map project category → filter key
  const categoryMap = {
    "social media": "social",
    website: "web",
    logo: "design",
    mobile: "mobile",
    marketing: "marketing",
  };

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => {
          const mapped = categoryMap[project.category] || project.category;
          return mapped === activeFilter;
        });

  const displayedProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, 3);

  // Intersection Observer for animations
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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [activeFilter]);

  const handleViewMore = () => {
    setShowAll(true);
    setTimeout(() => {
      document.getElementById("portfolio").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleViewLess = () => {
    setShowAll(false);
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
      {/* Decorative background pattern */}
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
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 animate-fade-in-up border border-blue-500/30">
            <Filter className="text-blue-300" size={24} />
            <span className="text-blue-200 font-semibold">Our Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Featured{" "}
            <span className="bg-gradient-to-r from-[#006AAB] to-[#72BBDA] bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto animate-fade-in-up">
            Explore our latest projects across web, design, social media, and
            marketing.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter, index) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => {
                  setActiveFilter(filter.key);
                  setShowAll(false);
                }}
                className={`group px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white shadow-lg transform scale-105"
                      : "bg-white/10 backdrop-blur-sm text-blue-100 border border-blue-500/30 hover:border-blue-400 hover:bg-white/20"
                  }
                `}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-blue-300"}
                />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Projects counter */}
        <div className="text-center mb-8">
          <p className="text-blue-200 text-sm">
            Showing{" "}
            <span className="font-semibold text-white">
              {displayedProjects.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">
              {filteredProjects.length}
            </span>{" "}
            projects
            {filteredProjects.length > 3 && !showAll && (
              <span className="text-blue-300"> (3 featured)</span>
            )}
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => {
            const isVisible = visibleItems.includes(index);
            return (
              <div
                key={project.id}
                className={`group relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 
                  transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20
                  ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image container */}
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300/006AAB/FFFFFF?text=Project";
                    }}
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                        aria-label={`Visit ${project.title}`}
                      >
                        <ExternalLink size={18} />
                        Visit Project
                      </a>
                    ) : (
                      <span className="text-white/70 text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white text-xs font-semibold rounded-full shadow-lg uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-blue-100 mb-4 text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More / View Less */}
        {filteredProjects.length > 3 && (
          <div className="text-center mt-12">
            {!showAll ? (
              <button
                onClick={handleViewMore}
                className="group bg-gradient-to-r from-[#006AAB] to-[#72BBDA] text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3 mx-auto"
              >
                <span>View All Projects</span>
                <ChevronDown
                  size={20}
                  className="group-hover:translate-y-1 transition-transform duration-300"
                />
                <span className="text-blue-200 text-sm ml-1">
                  ({filteredProjects.length - 3} more)
                </span>
              </button>
            ) : (
              <button
                onClick={handleViewLess}
                className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-3 mx-auto"
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
      </div>
    </section>
  );
};

export default Portfolio;
