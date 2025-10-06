// Create src/components/Team.jsx
import { Linkedin, Mail, Award } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "Marketing Director",
      role: "Strategy & Leadership",
      experience: "10+ years in marketing",
      expertise: ["Brand Strategy", "Market Research", "Team Leadership"],
    },
    {
      name: "Digital Marketing Specialist",
      role: "Digital Campaigns",
      experience: "7+ years in digital marketing",
      expertise: ["SEO/SEM", "Social Media", "Analytics"],
    },
    {
      name: "Creative Director",
      role: "Design & Branding",
      experience: "8+ years in creative design",
      expertise: ["UI/UX Design", "Brand Identity", "Visual Design"],
    },
    {
      name: "Content Strategist",
      role: "Content & PR",
      experience: "6+ years in content marketing",
      expertise: ["Content Creation", "PR Strategy", "Copywriting"],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Expert Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the passionate professionals driving your marketing success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center hover-lift"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.experience}</p>
              <div className="space-y-2">
                {member.expertise.map((skill) => (
                  <span key={skill} className="block text-sm text-gray-500">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Team;
