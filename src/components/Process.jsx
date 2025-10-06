// Create src/components/Process.jsx
import { Search, Target, Palette, Rocket, BarChart } from "lucide-react";

const Process = () => {
  const steps = [
    {
      icon: <Search size={32} />,
      title: "Discovery & Research",
      description: "Deep dive into your business, market, and competition",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Target size={32} />,
      title: "Strategy Development",
      description: "Data-driven marketing strategy tailored to your goals",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Palette size={32} />,
      title: "Creative Execution",
      description: "Bringing the strategy to life with compelling creative",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: <Rocket size={32} />,
      title: "Implementation",
      description: "Multi-channel campaign execution and optimization",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <BarChart size={32} />,
      title: "Analysis & Reporting",
      description: "Continuous monitoring and performance optimization",
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Process</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            A structured approach to delivering measurable results
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mx-auto mb-4`}
              >
                {step.icon}
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-blue-200 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Process;
