// src/components/Header.jsx
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Clients", id: "clients" },
  { label: "Portfolio", id: "portfolio" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isHeroVisible, setIsHeroVisible] = useState(true); // hero is visible initially

  // 1. Detect if Hero section is in view (header stays out of the video's way)
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }, // 20% of hero visible to trigger
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // 2. Track which section crosses the middle of the viewport
  useEffect(() => {
    const sections = [...navItems.map((item) => item.id), "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // 3. Close the mobile menu whenever the header hides
  useEffect(() => {
    if (isHeroVisible) setIsMenuOpen(false);
  }, [isHeroVisible]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-all duration-500 ${
        isHeroVisible
          ? "pointer-events-none -translate-y-4 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <nav
        aria-label="Main"
        className="relative mx-auto flex max-w-6xl items-center justify-between rounded-full border border-slate-200/70 bg-white/80 py-2 pl-6 pr-2 shadow-soft backdrop-blur-xl"
      >
        <a href="#hero" aria-label="ProAddis Marketing – home">
          <img
            src="logos/logo2.png"
            alt="ProAddis Marketing"
            className="h-8 w-auto"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:text-brand-700"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a href="#contact" className="btn-primary hidden !py-2.5 sm:inline-flex">
            Let&apos;s talk
            <ArrowUpRight size={16} />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-800 transition-colors hover:bg-brand-50 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-full mt-3 rounded-3xl border border-slate-200/70 bg-white p-3 shadow-lift md:hidden">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="btn-primary mt-2 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Let&apos;s talk
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
