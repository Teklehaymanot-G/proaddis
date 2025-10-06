// src/components/Hero.jsx
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Play,
  Target,
  Star,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const heroRef = useRef(null);

  const texts = [
    "Strategic Marketing Solutions",
    "Data-Driven Insights",
    "Creative Innovation",
    "Your Path to Success",
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
      className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
    >
      {/* Animated Background Elements - More Dynamic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Moving gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float delay-75"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-float delay-150"></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Animated lines */}
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30 animate-pulse delay-75"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-6 text-center">
          {/* Enhanced Logo Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="bg-white/10 backdrop-blur-lg rounded-full p-8 border border-white/20 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <Target
                  className="text-white group-hover:text-blue-300 transition-colors duration-300"
                  size={80}
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Enhanced Typography */}
          <div className="mb-8 space-y-4">
            <h1 className="text-7xl md:text-9xl font-black text-white mb-4 animate-slide-in-from-top bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent">
              ProAddis
            </h1>
            <div className="text-4xl md:text-6xl font-light text-blue-200 animate-slide-in-from-bottom tracking-widest">
              MARKETING
            </div>
          </div>

          {/* Enhanced Tagline */}
          <div className="h-24 mb-8 flex items-center justify-center">
            <div className="relative group">
              <h2 className="text-3xl md:text-5xl text-blue-200 font-light min-h-[4rem] flex items-center justify-center">
                <span className="typewriter-text bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  {displayedText}
                </span>
                <span className="typewriter-cursor animate-blink text-white">
                  |
                </span>
              </h2>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-48 transition-all duration-1000"></div>
            </div>
          </div>

          {/* Enhanced Description */}
          <p className="text-2xl text-white/90 mb-12 max-w-4xl mx-auto animate-fade-in-up delay-1000 leading-relaxed font-light">
            Transforming businesses through{" "}
            <span className="text-blue-300 font-semibold">
              innovative marketing solutions
            </span>{" "}
            and{" "}
            <span className="text-purple-300 font-semibold">
              data-driven strategies
            </span>{" "}
            in Ethiopia's dynamic market landscape.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-1500">
            <button className="group relative bg-white text-blue-600 px-12 py-5 rounded-2xl font-bold hover-lift shadow-2xl transform transition-all duration-300 hover:scale-105 overflow-hidden text-lg">
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  size={20}
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>

            <button className="group relative border-2 border-white/50 text-white px-12 py-5 rounded-2xl font-semibold hover-lift backdrop-blur-lg transform transition-all duration-300 hover:scale-105 overflow-hidden text-lg hover:border-white">
              <span className="relative z-10 flex items-center gap-3">
                <Play
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Watch Our Story
              </span>
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      {/* <div className="relative z-10 pb-12">
        <div className="flex flex-col items-center gap-3 animate-bounce-slow">
          <span className="text-white/80 text-sm font-light tracking-widest uppercase bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            Discover Our World
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
            <ChevronDown className="text-white" size={24} />
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
