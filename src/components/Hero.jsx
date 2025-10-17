import { useState, useEffect } from "react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const texts = ["Walking Your Path to Success"];

  useEffect(() => {
    const fullText = texts[currentText];
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentText((currentText + 1) % texts.length);
        setCurrentIndex(0);
        setDisplayedText("");
      }, 4000); // Longer pause before restarting
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentText]);

  // Hide scroll indicator when user starts scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-col justify-between min-h-screen overflow-hidden"
      style={{
        background: "url('projects/hero.jpg') no-repeat center center/cover",
      }}
    >
      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-[1px]" />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center px-6 max-w-5xl mx-auto w-full">
          {/* Logo Title with Enhanced Animation */}
          <div className="mb-8 animate-fade-in-up">
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tight"
              style={{
                fontFamily: "Lato, sans-serif",
                background: "linear-gradient(90deg, #004a7c, #0073b1, #f6c945)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "300% 100%",
                animation: "titleGradient 8s ease infinite",
              }}
            >
              Pr
              <img
                src="logos/mark.png"
                alt="ProAddis Logo Mark"
                className="inline w-auto h-[85px] md:h-[100px] lg:h-[120px] mb-1 mx-1 transform hover:scale-110 transition-transform duration-300"
              />
              Addis
            </h1>
          </div>

          {/* Subtitle with Enhanced Styling */}
          <div className="mb-12 animate-fade-in-up delay-300">
            <div
              className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.4em] uppercase"
              style={{
                fontFamily: "Poppins, sans-serif",
                color: "#2D3748",
                letterSpacing: "0.5em",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              MARKETING
            </div>
          </div>

          {/* Animated Tagline with Enhanced Design */}
          <div className="mb-8 animate-fade-in-up delay-500">
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-8 min-h-[4rem] flex items-center justify-center"
              style={{
                fontFamily: "Lato, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-yellow-500 to-purple-600"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "textShine 3s ease-in-out infinite",
                }}
              >
                {displayedText}
              </span>
              <span className="animate-pulse text-gray-600 ml-1">|</span>
            </h2>

            {/* Animated underline */}
            <div className="w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto animate-typewriter-line mt-2"></div>
          </div>

          {/* Enhanced Description */}
          <div className="mb-12 animate-fade-in-up delay-700">
            <p
              className="text-lg md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed font-light"
              style={{
                color: "#4A5568",
                fontFamily: "Lato, sans-serif",
                lineHeight: "1.8",
                textShadow: "0 1px 2px rgba(255,255,255,0.8)",
              }}
            >
              Providing{" "}
              <strong className="text-blue-600 font-semibold bg-white/50 px-2 py-1 rounded-lg">
                strategic marketing solutions
              </strong>{" "}
              through{" "}
              <strong className="text-yellow-600 font-semibold bg-white/50 px-2 py-1 rounded-lg">
                creative, innovative, and data-driven
              </strong>{" "}
              insights to help organizations succeed in Ethiopia's evolving
              business landscape.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-1000">
            <button
              className="group relative px-12 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-500 flex items-center gap-3 transform hover:scale-105"
              style={{
                background:
                  "linear-gradient(90deg, #004a7c, #0073b1, #f6c945, #784ba0)",
                color: "#fff",
                backgroundSize: "300% 100%",
                animation: "gradientMove 6s ease infinite",
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </span>
              <div className="absolute inset-0 bg-white/10 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>

            <button className="group relative px-10 py-4 rounded-full font-semibold text-lg border-2 border-gray-600 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center gap-3 transform hover:scale-105 backdrop-blur-sm bg-white/50">
              <span className="relative z-10 flex items-center gap-3">
                <Play
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Watch Demo
              </span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in-up delay-1200">
            {[
              { number: "50+", label: "Projects" },
              { number: "30+", label: "Clients" },
              { number: "5+", label: "Years Experience" },
              { number: "98%", label: "Satisfaction" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center px-4 py-3 rounded-2xl backdrop-blur-sm bg-white/60 border border-white/80"
                style={{
                  fontFamily: "Lato, sans-serif",
                }}
              >
                <div className="text-xl font-bold text-gray-800">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div
        className={`relative z-10 pb-8 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-gray-600 text-sm font-light tracking-widest uppercase bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/80">
            Scroll to explore
          </span>
          <ChevronDown size={24} className="text-gray-600" />
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes titleGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes textShine {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes typewriterLine {
          from { width: 0; }
          to { width: 480px; }
        }

        .animate-typewriter-line {
          animation: typewriterLine 3s ease-in-out 1s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .delay-1200 {
          animation-delay: 1200ms;
        }

        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
