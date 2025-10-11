// src/components/Footer.jsx
import { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // client-side only: simulate subscription
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#006AAB] text-white pt-14 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand + Short */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-bold mb-3">ProAddis Marketing</h3>
            <p className="text-blue-100 mb-6 max-w-md">
              We help Ethiopian businesses grow with tailored marketing, digital
              products, and creative strategy.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-blue-100">
              {[
                "Product Strategy",
                "Digital Advertising",
                "Branding",
                "Web Development",
              ].map((s) => (
                <li key={s}>
                  <a href="#services" className="hover:underline">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-blue-100">
              {["About", "Portfolio", "Careers", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="hover:underline">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <div className="text-blue-100 space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+251912345678" className="hover:underline">
                  +251 91 234 5678
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:hello@proaddis.com" className="hover:underline">
                  hello@proaddis.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* <h4 className="text-lg font-semibold mb-3">Subscribe</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-gray-900"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-white text-[#001827] px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform"
                aria-label="Subscribe"
              >
                {submitted ? (
                  "Thanks"
                ) : (
                  <>
                    <Send size={14} /> <span>Join</span>
                  </>
                )}
              </button>
            </form> */}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-sm text-blue-100 flex flex-col md:flex-row items-center justify-center gap-4">
          &copy; {currentYear} ProAddis Marketing. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
