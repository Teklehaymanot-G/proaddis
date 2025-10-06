// Update src/App.jsx
import "./styles/animations.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhyUs from "./components/WhyUs";
import Process from "./components/Process"; // New
import Services from "./components/Services";
import Clients from "./components/Clients";
import Portfolio from "./components/Portfolio";
import CaseStudies from "./components/CaseStudies"; // New
import Testimonials from "./components/Testimonials"; // New
import Team from "./components/Team"; // New
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <WhyUs />
      <Process /> {/* Add Process section */}
      <Services />
      <Clients />
      <Portfolio />
      <CaseStudies /> {/* Add Case Studies */}
      <Testimonials /> {/* Add Testimonials */}
      <Team /> {/* Add Team section */}
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
