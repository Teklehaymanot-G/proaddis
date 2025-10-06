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
        {/* Logo with ProAddis colors */}
        <div className="flex items-center space-x-2 slide-in-left">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div className="text-white">
            <div className="text-xl font-bold leading-tight">ProAddis</div>
            <div className="text-sm font-light text-gray-300">MARKETING</div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {["Home", "Services", "Clients", "Portfolio", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white hover:text-blue-300 transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full glass md:hidden">
            <div className="flex flex-col space-y-4 p-6">
              {["Home", "Services", "Clients", "Portfolio", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-white hover:text-blue-300 transition-colors duration-300"
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
