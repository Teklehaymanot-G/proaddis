// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  // 1. Track scroll position for the "glass" fallback
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Intersection Observer – resets when no special section is visible
  useEffect(() => {
    const sectionIds = ["whyus", "process", "portfolio"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Check if any of the observed sections is intersecting
        const isAnyIntersecting = entries.some((entry) => entry.isIntersecting);
        if (isAnyIntersecting) {
          // Find the first one that is intersecting (or you can pick the one with highest ratio)
          const visibleEntry = entries.find((entry) => entry.isIntersecting);
          setActiveSection(visibleEntry.target.id);
        } else {
          // None of the special sections are visible → reset
          setActiveSection(null);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.3, // 30% of the section must be visible
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Determine header classes
  const isSpecialSection =
    activeSection && ["whyus", "process", "portfolio"].includes(activeSection);

  let headerBg = "bg-transparent";
  let headerText = "text-white";
  let logo = "logos/logo.png";
  let menuBg = "bg-transparent";

  if (isSpecialSection) {
    // 🔵 White background + blue text for these sections
    headerBg = "bg-white shadow-md";
    headerText = "text-blue-900";
    logo = "logos/logo2.png";
    menuBg = "bg-white shadow-lg border-t border-gray-200";
  } else if (scrolled) {
    // 🪟 Glass effect when scrolled but not in special sections
    headerBg = "glass py-2";
    headerText = "text-blue-900";
    logo = "logos/logo2.png";
    menuBg = "bg-white shadow-lg border-t border-gray-200";
  } else {
    // 🌟 Transparent at the very top
    headerBg = "bg-transparent py-4";
    headerText = "text-white";
    logo = "logos/logo.png";
    menuBg = "glass";
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${headerBg}`}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 slide-in-left">
          <img src={logo} alt="ProAddis Logo" className="w-auto h-[45px]" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {["Home", "Services", "Clients", "Portfolio", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`transition-colors duration-300 relative group font-medium ${headerText} hover:${
                  isSpecialSection || scrolled
                    ? "text-blue-600"
                    : "text-blue-300"
                }`}
              >
                {item}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isSpecialSection || scrolled ? "bg-blue-600" : "bg-blue-400"
                  }`}
                ></span>
              </a>
            ),
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            color: isSpecialSection || scrolled ? "#006aab" : "#ffffff",
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`absolute top-full left-0 w-full md:hidden ${menuBg}`}
          >
            <div className="flex flex-col space-y-4 p-6">
              {["Home", "Services", "Clients", "Portfolio", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`transition-colors duration-300 font-medium ${headerText}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
