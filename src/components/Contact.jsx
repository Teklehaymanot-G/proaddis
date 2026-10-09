// src/components/Contact.jsx
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";
import { useContent } from "../content/ContentContext";
import { API_URL, telHref } from "../lib/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: "",
};

const EXTRA_FIELDS = [
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    autoComplete: "tel",
    placeholder: "Enter your phone number",
  },
  {
    name: "company",
    label: "Company",
    type: "text",
    autoComplete: "organization",
    placeholder: "Enter your company name",
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    autoComplete: "off",
    placeholder: "What is this about?",
  },
];

const Contact = () => {
  const { settings, contact, contactForm } = useContent();

  // Extra fields switched on under Settings → Contact form in the admin
  const extraFields = EXTRA_FIELDS.filter(
    (field) => contactForm.fields[field.name]?.show,
  );

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: settings.phones.map((text) => ({ text, href: telHref(text) })),
    },
    {
      icon: Mail,
      title: "Email",
      details: settings.emails.map((text) => ({
        text,
        href: `mailto:${text}`,
      })),
    },
    {
      icon: MapPin,
      title: "Address",
      details: settings.addressLines.map((text) => ({ text })),
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: settings.hours.map((text) => ({ text })),
    },
  ].filter((info) => info.details.length > 0);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.fromEntries(
            ["name", "email", "message", ...extraFields.map((f) => f.name)].map(
              (name) => [name, formData[name]],
            ),
          ),
        ),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setFormData(EMPTY_FORM);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "");
        console.error("Submission error:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("");
      }, 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="section bg-slate-50">
      <div className="shell">
        <div className="overflow-hidden rounded-[2rem] bg-brand-950 shadow-lift lg:grid lg:grid-cols-12">
          {/* Contact Info */}
          <div className="relative overflow-hidden p-8 text-white md:p-12 lg:col-span-5">
            <div className="grid-texture pointer-events-none absolute inset-0"></div>
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-600/30 blur-[100px]"></div>

            <Reveal className="relative">
              <span className="eyebrow mb-5 !text-brand-300">
                {contact.eyebrow}
              </span>
              <h2 className="display text-white">{contact.title}</h2>
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-brand-100/70">
                {contact.description}
              </p>

              <ul className="mt-10 space-y-7">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <li key={info.title} className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 text-brand-300 ring-1 ring-inset ring-white/10">
                        <Icon size={20} strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-100/50">
                          {info.title}
                        </h3>
                        <div className="mt-1.5 space-y-0.5 text-sm text-white">
                          {info.details.map((detail, detailIndex) =>
                            detail.href ? (
                              <a
                                key={detailIndex}
                                href={detail.href}
                                className="block break-all transition-colors hover:text-brand-300"
                              >
                                {detail.text}
                              </a>
                            ) : (
                              <p key={detailIndex}>{detail.text}</p>
                            ),
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Social Media Links */}
              <SocialLinks className="mt-10" />
            </Reveal>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 lg:col-span-7">
            <Reveal delay={100}>
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                {contact.formTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {contact.formNote}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="field"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="field"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {extraFields.length > 0 && (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {extraFields.map((field, index) => {
                      const required = contactForm.fields[field.name].required;
                      const alone =
                        extraFields.length % 2 === 1 &&
                        index === extraFields.length - 1;
                      return (
                        <div
                          key={field.name}
                          className={alone ? "md:col-span-2" : ""}
                        >
                          <label
                            htmlFor={field.name}
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            {field.label}
                            {required ? " *" : " (optional)"}
                          </label>
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            autoComplete={field.autoComplete}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="field"
                            required={required}
                            placeholder={field.placeholder}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="field resize-none"
                    required
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                </div>

                {!contactForm.enabled && (
                  <p className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    The contact form is currently unavailable. Please reach us
                    by phone or email instead.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !contactForm.enabled}
                  className="btn-primary w-full !py-4 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Messages */}
                <div aria-live="polite">
                  {submitStatus === "success" && (
                    <p className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                      <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                      {contactForm.successMessage}
                    </p>
                  )}

                  {submitStatus === "error" && (
                    <p className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      {errorMessage ||
                        "Sorry, there was an error sending your message. Please try again or contact us directly."}
                    </p>
                  )}
                </div>
              </form>
            </Reveal>
          </div>
        </div>

        {/* Interactive Map Section */}
        {settings.mapUrl && (
        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <div className="flex flex-col gap-1 p-6 md:flex-row md:items-center md:justify-between md:px-8">
              <h3 className="font-display text-lg font-semibold text-ink">
                {contact.mapTitle}
              </h3>
              <p className="text-sm text-slate-500">
                {contact.mapDescription}
              </p>
            </div>
            <iframe
              src={settings.mapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ProAddis Marketing Office Location"
              className="block"
            ></iframe>
          </div>
        </Reveal>
        )}
      </div>
    </section>
  );
};

export default Contact;
