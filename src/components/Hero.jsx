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
      style={{}}
    >
      {/* Video on md+ screens, image fallback on small screens */}
      <div className="absolute inset-0 -z-10">
        <video
          className="hidden md:block w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
        >
          <source src="/Comp 3.mp4" type="video/mp4" />
        </video>

        {/* Fallback background image for small screens */}
        <div
          className="md:hidden w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-poster.jpg')" }}
        />
      </div>
    </section>
  );
};

export default Hero;
