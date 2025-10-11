// src/components/Contact.jsx
import { useState, useRef, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Target,
  Star,
  Navigation,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);

  const contactInfo = [
    {
      icon: <Phone size={32} />,
      title: "Phone",
      details: ["+251 (988) 11-88-88", "+251 (964) 22-28-88"],
      color: "from-blue-500 to-cyan-500",
      delay: "0",
    },
    {
      icon: <Mail size={32} />,
      title: "Email",
      details: ["proaddismarketing@gmail.com", "contact@proaddismarketing.com"],
      color: "from-purple-500 to-pink-500",
      delay: "100",
    },
    {
      icon: <MapPin size={32} />,
      title: "Address",
      details: [
        "Mexico to Kera road, next to Total station",
        "Metamen Building 2nd Floor",
        "Addis Ababa, Ethiopia",
      ],
      color: "from-cyan-500 to-blue-500",
      delay: "200",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems([]);
            contactInfo.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
      alert("Thank you for your message! We will get back to you soon.");
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Google Maps embed URL for the location
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.218258178909!2d38.76345157569646!3d9.022537089410693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85e8e0cfe50d%3A0x9b2695be43d2c2a3!2sMexico%20Square%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1698765432107!5m2!1sen!2set";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float delay-75"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float delay-150"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 animate-fade-in-up border border-blue-200 shadow-sm">
            <MessageCircle className="text-blue-600" size={24} />
            <span className="text-blue-700 font-semibold">Get In Touch</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            Contact{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Us
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            Let's map your journey to success together. We're here to help you
            grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Target className="text-blue-600" size={28} />
                Connect With Us
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className={`group bg-white rounded-2xl p-6 hover-lift transition-all duration-500 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl ${
                      visibleItems.includes(index)
                        ? "opacity-100 transform translate-x-0"
                        : "opacity-0 transform -translate-x-10"
                    }`}
                    style={{ transitionDelay: `${info.delay}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${info.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                          {info.title}
                        </h4>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-3 group-hover:w-full transition-all duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Card */}
            {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl hover-lift transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <Star className="text-yellow-300" size={24} />
                <h4 className="text-xl font-bold">Why Choose Us?</h4>
              </div>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Quick response within 24 hours
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Free initial consultation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Customized solutions for your business
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Ongoing support and maintenance
                </li>
              </ul>
            </div> */}
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl p-8 shadow-2xl hover-lift transition-all duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Send className="text-blue-600" size={28} />
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2 group-hover:text-blue-600 transition-colors duration-300"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white group-hover:border-blue-300"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2 group-hover:text-purple-600 transition-colors duration-300"
                    >
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white group-hover:border-purple-300"
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2 group-hover:text-cyan-600 transition-colors duration-300"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-white resize-none group-hover:border-cyan-300"
                    required
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl font-semibold hover-lift transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105"
                  }`}
                >
                  <span className="relative z-10 text-white flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send
                          size={20}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                        Send Message
                      </>
                    )}
                  </span>

                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  We'll get back to you within 24 hours. Your information is
                  secure with us.
                </p>
              </form>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center gap-4 mt-8">
              {[
                {
                  name: "Facebook",
                  color: "bg-blue-500 hover:bg-blue-600",
                  icon: <Facebook />,
                },
                {
                  name: "Twitter",
                  color: "bg-cyan-500 hover:bg-cyan-600",
                  icon: <Twitter />,
                },
                {
                  name: "Instagram",
                  color: "bg-pink-500 hover:bg-pink-600",
                  icon: <Instagram />,
                },
                {
                  name: "LinkedIn",
                  color: "bg-blue-700 hover:bg-blue-800",
                  icon: <Linkedin />,
                },
                {
                  name: "YouTube",
                  color: "bg-red-500 hover:bg-red-600",
                  icon: <Youtube />,
                },
              ].map((social, index) => (
                <a
                  key={social.name}
                  href="#"
                  className={`w-12 h-12 rounded-2xl ${social.color} text-white flex items-center justify-center hover-lift transform hover:scale-110 transition-all duration-300 shadow-lg animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100 + 500}ms` }}
                  title={social.name}
                >
                  <span className="font-semibold text-xs">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Navigation className="text-yellow-300" size={32} />
              <h3 className="text-2xl md:text-3xl font-bold">
                Visit Our Office
              </h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
              Located in the heart of Addis Ababa, easily accessible from major
              routes
            </p>

            {/* Interactive Google Map */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/30 hover-lift transition-all duration-300">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ProAddis Marketing Office Location"
                  className="rounded-2xl"
                ></iframe>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <h4 className="font-bold text-yellow-300 mb-2">📍 Location</h4>
                <p className="text-blue-100 text-sm">
                  Mexico to Kera road
                  <br />
                  Next to Total station
                  <br />
                  Metamen Building 2nd Floor
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <h4 className="font-bold text-yellow-300 mb-2">
                  🕒 Business Hours
                </h4>
                <p className="text-blue-100 text-sm">
                  Mon - Fri: 8:30 AM - 5:30 PM
                  <br />
                  Saturday: 9:00 AM - 1:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <h4 className="font-bold text-yellow-300 mb-2">Services</h4>
                <p className="text-blue-100 text-sm">
                  Branding &amp; Strategy
                  <br />
                  Digital Marketing &amp; SEO
                  <br />
                  Market Research &amp; Analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
