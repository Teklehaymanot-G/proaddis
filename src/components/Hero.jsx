// src/components/Hero.jsx
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Play,
  Target,
  Star,
  Sparkles,
  ArrowRight,
  Circle,
  Smile,
} from "lucide-react";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef(null);

  const texts = [
    "Walking Your Path to Success",
    // "Strategic Marketing Solutions",
    // "Data-Driven Insights",
    // "Creative Innovation",
    // "Your Path to Success",
  ];

  // Typewriter effect
  useEffect(() => {
    const currentFullText = texts[currentText];

    if (currentIndex < currentFullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentFullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentText((currentText + 1) % texts.length);
        setCurrentIndex(0);
        setDisplayedText("");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentText]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex flex-col justify-between relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #006aab 0%, #004a7c 50%, #002a4d 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Color Orbs */}
        <div
          className="absolute top-10 left-10 w-80 h-80 rounded-full opacity-20 animate-float"
          style={{ backgroundColor: "#006aab" }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-64 h-64 rounded-full opacity-15 animate-float delay-75"
          style={{ backgroundColor: "#0088cc" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-72 h-72 rounded-full opacity-25 animate-float delay-150"
          style={{ backgroundColor: "#005599" }}
        ></div>

        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, #0088cc 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, #004a7c 0%, transparent 50%)`,
              backgroundSize: "60% 60%",
            }}
          ></div>
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(#0088cc 1px, transparent 1px), 
                             linear-gradient(90deg, #0088cc 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Floating Circles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 opacity-10 animate-float-slow"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              borderColor: i % 2 === 0 ? "#0088cc" : "#004a7c",
            }}
          />
        ))}

        {/* Animated Lines */}
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-#0088cc to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-#006aab to-transparent opacity-30 animate-pulse delay-75"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-6 text-center">
          {/* Enhanced Logo Animation */}
          {/* <div className="flex justify-center mb-8">
            <div className="relative group">
              <div
                className="backdrop-blur-lg rounded-full p-8 border shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Target
                  className="transition-colors duration-300 group-hover:scale-110"
                  size={80}
                  style={{ color: "#ffffff" }}
                />
              </div>
              <div
                className="absolute -inset-4 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: "#0088cc" }}
              ></div>
            </div>
          </div> */}

          {/* Enhanced Typography with Lato */}
          <div className="mb-8 space-y-4">
            <h1
              className="text-7xl md:text-9xl font-black mb-4 animate-slide-in-from-top tracking-tight"
              style={{
                color: "#ffffff",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                fontFamily: "Lato, sans-serif",
              }}
            >
              Pr
              <img
                src="/mark.png"
                alt="ProAddis Logo"
                className="inline w-auto h-[90px] mb-2"
              />
              Addis
            </h1>
            <div
              className="text-4xl md:text-6xl font-light animate-slide-in-from-bottom tracking-widest"
              style={{
                color: "#FFF",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              MARKETING
            </div>
          </div>

          {/* Enhanced Tagline */}
          <div className="h-24 mb-8 flex items-center justify-center">
            <div className="relative group">
              <h2
                className="text-3xl md:text-5xl font-light min-h-[4rem] flex items-center justify-center"
                style={{
                  color: "#e6f3ff",
                  fontFamily: "Lato, sans-serif",
                }}
              >
                <span className="typewriter-text">{displayedText}</span>
                <span
                  className="typewriter-cursor animate-blink"
                  style={{ color: "#ffffff" }}
                >
                  |
                </span>
              </h2>
              <div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-1 group-hover:w-48 transition-all duration-1000"
                style={{ backgroundColor: "#0088cc" }}
              ></div>
            </div>
          </div>

          {/* Enhanced Description */}
          <p
            className="text-2xl mb-12 max-w-4xl mx-auto animate-fade-in-up delay-1000 leading-relaxed font-light"
            style={{
              color: "#cce6ff",
              fontFamily: "Lato, sans-serif",
            }}
          >
            Provides
            <strong style={{ color: "#ffffff" }}>
              {" "}
              strategic marketing solutions
            </strong>{" "}
            through{" "}
            <strong style={{ color: "#ffffff" }}>
              creative, innovative and data-driven
            </strong>{" "}
            insights to help organizations achieve their goals and succeed in
            Ethiopia's volatile business landscape.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-1500">
            <button
              className="group relative px-12 py-5 rounded-2xl font-bold hover-lift shadow-2xl transform transition-all duration-300 hover:scale-105 overflow-hidden text-lg"
              style={{
                backgroundColor: "#ffffff",
                color: "#006aab",
                fontFamily: "Lato, sans-serif",
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Read More
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  size={20}
                />
              </span>
              <div
                className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ backgroundColor: "#f0f8ff" }}
              ></div>
            </button>

            {/* <button
              className="group relative border-2 px-12 py-5 rounded-2xl font-semibold hover-lift backdrop-blur-lg transform transition-all duration-300 hover:scale-105 overflow-hidden text-lg"
              style={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                color: "#ffffff",
                fontFamily: "Lato, sans-serif",
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Watch Our Story
              </span>
              <div
                className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              ></div>
            </button> */}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up delay-2000">
            {[
              { icon: <Star size={20} />, text: "1+ Years Experience" },
              { icon: <Target size={20} />, text: "25+ Projects" },
              { icon: <Circle size={20} />, text: "10+ Clients" },
              { icon: <Smile size={20} />, text: "98% Satisfaction" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#e6f3ff",
                  fontFamily: "Lato, sans-serif",
                }}
              >
                <div style={{ color: "#0088cc" }}>{item.icon}</div>
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      {/* <div className="relative z-10 pb-12">
        <div className="flex flex-col items-center gap-3 animate-bounce-slow">
          <span
            className="text-sm font-light tracking-widest uppercase px-6 py-3 rounded-full border backdrop-blur-sm"
            style={{
              color: "#e6f3ff",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              fontFamily: "Lato, sans-serif",
            }}
          >
            Discover Our World
          </span>
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-1 rounded-full animate-pulse"
              style={{ backgroundColor: "#0088cc" }}
            ></div>
            <div
              className="w-1 h-1 rounded-full animate-pulse delay-75"
              style={{ backgroundColor: "#006aab" }}
            ></div>
            <div
              className="w-1 h-1 rounded-full animate-pulse delay-150"
              style={{ backgroundColor: "#004a7c" }}
            ></div>
            <ChevronDown size={24} style={{ color: "#ffffff" }} />
          </div>
        </div>
      </div> */}

      {/* Particle effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.6 + 0.2,
              backgroundColor:
                i % 3 === 0 ? "#0088cc" : i % 3 === 1 ? "#006aab" : "#004a7c",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
