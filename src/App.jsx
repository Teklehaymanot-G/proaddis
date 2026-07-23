// src/App.jsx
import "./styles/animations.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhyUs from "./components/WhyUs";
import Process from "./components/Process";
import Services from "./components/Services";
import Clients from "./components/Clients";
import Portfolio from "./components/Portfolio";
import CaseStudies from "./components/CaseStudies";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      {/* Added id="hero" so the header can detect it */}
      <section id="hero">
        <Hero />
      </section>
      <section id="whyus">
        <WhyUs />
      </section>
      <Services />
      <section id="process">
        <Process />
      </section>
      <Clients />
      <section id="portfolio">
        <Portfolio />
      </section>
      <CaseStudies />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
