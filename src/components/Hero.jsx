// src/components/Hero.jsx
import { ArrowDown } from "lucide-react";
import { useContent } from "../content/ContentContext";
import { assetUrl } from "../lib/api";

const Hero = () => {
  const { hero } = useContent();
  const videoSrc = assetUrl(hero.videoUrl);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-black" // 👈 black background fills any empty space
    >
      <video
        key={videoSrc} // reload when the video is replaced
        className="block h-auto w-full"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={videoSrc} />
        Your browser does not support the video tag.
      </video>

      <a
        href="#about"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-brand-950/40 text-white backdrop-blur-md transition-colors duration-300 hover:bg-brand-950/70 md:flex"
      >
        <ArrowDown size={18} />
      </a>
    </section>
  );
};

export default Hero;
