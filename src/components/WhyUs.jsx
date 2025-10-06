// src/components/WhyUs.jsx
import {
  Brain,
  Database,
  Users,
  Award,
  Shield,
  TrendingUp,
  Target,
  Heart,
  Sparkles,
} from "lucide-react";

const WhyUs = () => {
  const features = [
    {
      icon: <Brain size={48} />,
      title: "Expertise & Innovation",
      description:
        "Years of experienced personnel with cutting-edge capabilities",
      gradient: "from-blue-500 to-cyan-500",
      delay: "0",
    },
    {
      icon: <Database size={48} />,
      title: "Data-Driven Strategies",
      description: "Strategic decisions powered by insights and analytics",
      gradient: "from-purple-500 to-pink-500",
      delay: "100",
    },
    {
      icon: <Users size={48} />,
      title: "Customer-Centric",
      description: "Tailored services, committed to your satisfaction",
      gradient: "from-green-500 to-teal-500",
      delay: "200",
    },
    {
      icon: <Award size={48} />,
      title: "Quality & Reliability",
      description: "High standards, integrity, and efficiency",
      gradient: "from-orange-500 to-red-500",
      delay: "300",
    },
    {
      icon: <Shield size={48} />,
      title: "Competitive & Sustainable",
      description: "Affordable solutions with long-term support",
      gradient: "from-indigo-500 to-purple-500",
      delay: "400",
    },
    {
      icon: <TrendingUp size={48} />,
      title: "Complete Service",
      description: "End-to-end marketing solutions for your business",
      gradient: "from-teal-500 to-blue-500",
      delay: "500",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-900 to-slate-800">
      {/* Unique Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)`,
            backgroundSize: "50% 50%",
          }}
        ></div>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(30deg, transparent 49%, rgba(59, 130, 246, 0.1) 50%, transparent 51%),
                           linear-gradient(150deg, transparent 49%, rgba(139, 92, 246, 0.1) 50%, transparent 51%)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Floating Elements - Different from Hero */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
      <div className="absolute top-1/3 right-32 w-24 h-24 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-slow delay-75"></div>
      <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow delay-150"></div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 24px, rgba(59, 130, 246, 0.1) 25px, transparent 26px),
                           linear-gradient(0deg, transparent 24px, rgba(139, 92, 246, 0.1) 25px, transparent 26px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-full px-8 py-4 mb-6 animate-fade-in-up border border-white/10 shadow-2xl">
            <Sparkles className="text-yellow-400" size={28} />
            <span className="text-white font-semibold text-lg tracking-wide">
              Why We Stand Out
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ProAddis
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
            We don't just create campaigns—we build{" "}
            <span className="text-blue-300 font-semibold">
              lasting partnerships
            </span>{" "}
            that drive{" "}
            <span className="text-purple-300 font-semibold">
              measurable growth
            </span>{" "}
            and{" "}
            <span className="text-cyan-300 font-semibold">
              sustainable success
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 text-center text-white hover-lift transition-all duration-500 border border-white/10 hover:border-white/20 overflow-hidden"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              {/* Animated Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl relative`}
                >
                  {feature.icon}
                  <div className="absolute -inset-4 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Title with Gradient Text */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                  {feature.description}
                </p>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-150"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up delay-700">
          <div className="bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 backdrop-blur-xl rounded-3xl p-12 max-w-6xl mx-auto border border-white/20 hover-lift transition-all duration-500 group">
            <div className="flex items-center justify-center gap-6 mb-6">
              <Heart
                className="text-pink-400 group-hover:scale-110 transition-transform duration-300"
                size={40}
              />
              <span className="text-3xl text-white font-light italic bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                "Walking your path to success"
              </span>
              <Heart
                className="text-pink-400 group-hover:scale-110 transition-transform duration-300"
                size={40}
              />
            </div>
            <p className="text-xl text-blue-100 group-hover:text-white transition-colors duration-300 max-w-4xl mx-auto leading-relaxed">
              Let us be your strategic partner in navigating Ethiopia's
              competitive business landscape. Together, we'll transform
              challenges into opportunities and goals into achievements.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { number: "50+", label: "Successful Projects" },
                { number: "30+", label: "Happy Clients" },
                { number: "5+", label: "Years Experience" },
                { number: "98%", label: "Client Satisfaction" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center group-hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {stat.number}
                  </div>
                  <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
