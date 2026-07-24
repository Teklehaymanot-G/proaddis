// src/components/Hero.jsx
const Hero = () => {
  return (
    <section
      id="hero"
      className="w-full overflow-hidden bg-black" // 👈 black background fills any empty space
    >
      <video
        className="w-full h-auto"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/hero-poster.jpg"
      >
        <source src="/Comp 3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default Hero;
