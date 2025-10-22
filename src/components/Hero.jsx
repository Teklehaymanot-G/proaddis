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
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentText]);

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
      className="relative flex flex-col justify-between min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen overflow-hidden"
    >
      {/* Enhanced responsive video background */}
      <div className="absolute inset-0 -z-10">
        {/* Video for all screens with proper sizing */}
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          // Add these styles for better mobile performance
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source src="/Comp 3.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

        {/* Optional: Gradient overlay for better text readability */}
      </div>
    </section>
  );
};

export default Hero;
