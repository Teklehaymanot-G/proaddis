// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "py-4"
      }`}
    >
      <nav className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo that changes on scroll */}
        <div className="flex items-center space-x-2 slide-in-left">
          {scrolled ? (
            // Blue logo for scrolled state (white background)
            <img
              src="logos/logo2.png"
              alt="ProAddis Logo"
              className="w-auto h-[45px]"
            />
          ) : (
            // White logo for normal state (transparent background)
            <img
              src="logos/logo.png"
              alt="ProAddis Logo"
              className="w-auto h-[45px]"
            />
          )}
        </div>

        {/* Desktop Menu - Changes color on scroll */}
        <div className="hidden md:flex space-x-8">
          {["Home", "Services", "Clients", "Portfolio", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`transition-colors duration-300 relative group font-medium ${
                  scrolled
                    ? "text-blue-900 hover:text-blue-600"
                    : "text-white hover:text-blue-300"
                }`}
              >
                {item}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    scrolled ? "bg-blue-600" : "bg-blue-400"
                  }`}
                ></span>
              </a>
            )
          )}
        </div>

        {/* Mobile Menu Button - Changes color on scroll */}
        <button
          className="md:hidden transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            color: scrolled ? "#006aab" : "#ffffff",
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu - Changes background and text color on scroll */}
        {isMenuOpen && (
          <div
            className={`absolute top-full left-0 w-full md:hidden ${
              scrolled ? "bg-white shadow-lg border-t border-gray-200" : "glass"
            }`}
          >
            <div className="flex flex-col space-y-4 p-6">
              {["Home", "Services", "Clients", "Portfolio", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`transition-colors duration-300 font-medium ${
                      scrolled
                        ? "text-blue-900 hover:text-blue-600"
                        : "text-white hover:text-blue-300"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
