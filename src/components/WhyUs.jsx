// src/components/WhyUs.jsx
import {
  Award,
  Brain,
  Database,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;
    let animationFrame;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime = null;

          const animateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < duration) {
              animationFrame = requestAnimationFrame(animateCount);
            } else {
              setCount(end);
            }
          };

          animationFrame = requestAnimationFrame(animateCount);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span ref={countRef}>
      {count}
      {suffix}
    </span>
  );
};

const WhyUs = () => {
  const features = [
    {
      icon: <Brain size={48} />,
      title: "Expertise & Innovation",
      description:
        "Years of experienced personnel with cutting-edge capabilities",
      gradient: "from-[#006AAB] to-[#0088CC]",
      delay: "0",
    },
    {
      icon: <Database size={48} />,
      title: "Data-Driven Strategies",
      description: "Strategic decisions powered by insights and analytics",
      gradient: "from-[#004A7C] to-[#006AAB]",
      delay: "100",
    },
    {
      icon: <Users size={48} />,
      title: "Customer-Centric",
      description: "Tailored services, committed to your satisfaction",
      gradient: "from-[#0088CC] to-[#00A8FF]",
      delay: "200",
    },
    {
      icon: <Award size={48} />,
      title: "Quality & Reliability",
      description: "High standards, integrity, and efficiency",
      gradient: "from-[#006AAB] to-[#72BBDA]",
      delay: "300",
    },
    {
      icon: <Shield size={48} />,
      title: "Competitive & Sustainable",
      description: "Affordable solutions with long-term support",
      gradient: "from-[#004A7C] to-[#0088CC]",
      delay: "400",
    },
    {
      icon: <TrendingUp size={48} />,
      title: "Complete Service",
      description: "End-to-end marketing solutions for your business",
      gradient: "from-[#0088CC] to-[#006AAB]",
      delay: "500",
    },
  ];

  const stats = [
    {
      number: 50,
      label: "Projects Completed",
      color: "text-[#72BBDA]",
      suffix: "+",
    },
    {
      number: 30,
      label: "Happy Clients",
      color: "text-[#72BBDA]",
      suffix: "+",
    },
    {
      number: 5,
      label: "Years Experience",
      color: "text-[#72BBDA]",
      suffix: "+",
    },
    {
      number: 98,
      label: "Client Satisfaction",
      color: "text-[#72BBDA]",
      suffix: "%",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#002A4D] via-[#004A7C] to-[#006AAB]">
      {/* Unique Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 106, 171, 0.4) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(114, 187, 218, 0.3) 0%, transparent 50%)`,
            backgroundSize: "50% 50%",
          }}
        ></div>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(30deg, transparent 49%, rgba(255, 255, 255, 0.1) 50%, transparent 51%),
                           linear-gradient(150deg, transparent 49%, rgba(255, 255, 255, 0.08) 50%, transparent 51%)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#0088CC] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
      <div className="absolute top-1/3 right-32 w-24 h-24 bg-[#72BBDA] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-slow delay-75"></div>
      <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-[#006AAB] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow delay-150"></div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 24px, rgba(255, 255, 255, 0.1) 25px, transparent 26px),
                           linear-gradient(0deg, transparent 24px, rgba(255, 255, 255, 0.1) 25px, transparent 26px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-full px-8 py-4 mb-6 animate-fade-in-up border border-white/20 shadow-2xl">
            <Sparkles className="text-[#72BBDA]" size={28} />
            <span className="text-white font-semibold text-lg tracking-wide">
              Why We Stand Out
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up">
            Why Choose{" "}
            <span className="text-white">
              Pr
              <img
                src="logos/mark.png"
                alt="o"
                style={{
                  width: "auto",
                  height: "50px",
                  display: "inline",
                  filter: "brightness(0) invert(1)",
                }}
              />
              Addis
            </span>
            ?
          </h2>
          <p className="text-xl text-[#E6F3FF] max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
            We don't just create campaigns; we build{" "}
            <span className="text-white font-semibold">
              lasting partnerships
            </span>{" "}
            that drive{" "}
            <span className="text-white font-semibold">measurable growth</span>{" "}
            and{" "}
            <span className="text-white font-semibold">
              sustainable success
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center text-white hover-lift transition-all duration-500 border border-white/20 hover:border-[#72BBDA] overflow-hidden"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              {/* Animated Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-[#72BBDA] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl relative`}
                >
                  {feature.icon}
                  <div className="absolute -inset-4 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#E6F3FF] transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#CCE6FF] leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                  {feature.description}
                </p>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-[#72BBDA] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#0088CC] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-150"></div>
            </div>
          ))}
        </div>

        {/* Stats Section with Animated Counters */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-6xl mx-auto hover-lift transition-all duration-500 group">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group-hover:scale-105 transition-transform duration-300"
                >
                  <div
                    className={`text-3xl md:text-4xl font-black ${stat.color} mb-2`}
                  >
                    <Counter
                      end={stat.number}
                      duration={2500}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-[#CCE6FF] font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Bottom Quote */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-xl text-[#E6F3FF] italic">
                "Walking your path to success with data-driven excellence"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
