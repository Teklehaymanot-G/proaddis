// src/components/Footer.jsx
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import SocialLinks from "./SocialLinks";
import { useContent } from "../content/ContentContext";
import { telHref } from "../lib/api";

const companyLinks = [
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const { footer } = useContent();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-white">
      <div className="shell">
        {/* Closing call to action */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <h2 className="display max-w-2xl text-white">
            {footer.ctaTitle}
          </h2>
          <a href="#contact" className="btn-light flex-shrink-0 self-start md:self-auto">
            {footer.ctaLabel}
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-12">
          {/* Brand + Short */}
          <div className="col-span-2 md:col-span-5">
            <img
              src="logos/logo.png"
              alt="ProAddis Marketing"
              className="h-10 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-brand-100/60">
              {footer.description}
            </p>
            <SocialLinks className="mt-6" />
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-100/50">
              Services
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footer.serviceLinks.map((s, index) => (
                <li key={`${s}-${index}`}>
                  <a
                    href="#services"
                    className="text-brand-100/80 transition-colors hover:text-white"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-100/50">
              Company
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-brand-100/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-100/50">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-brand-100/80">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="flex-shrink-0 text-brand-300" />
                <span>{footer.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="flex-shrink-0 text-brand-300" />
                <a
                  href={telHref(footer.phone)}
                  className="transition-colors hover:text-white"
                >
                  {footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0 text-brand-300" />
                <a
                  href={`mailto:${footer.email}`}
                  className="transition-colors hover:text-white"
                >
                  {footer.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-brand-100/50 md:flex-row">
          <p>&copy; {currentYear} ProAddis Marketing. All rights reserved.</p>
          <a href="#hero" className="transition-colors hover:text-white">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
