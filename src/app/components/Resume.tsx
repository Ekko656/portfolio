import { motion } from "motion/react";
import { Download, Mail, MapPin, Briefcase, GraduationCap, Award, Code } from "lucide-react";

export function Resume() {
  const education = [
    {
      degree: "Bachelor of Applied Science in Engineering",
      school: "University of British Columbia (UBC)",
      location: "Vancouver, BC",
      period: "2024 - 2028",
      gpa: "Strong Academic Standing",
      highlights: [
        "Focus on embedded systems and hardware-software integration",
        "Active member of UBC Bionics design team",
        "Completed coursework in computation, design processes, and engineering analysis",
      ],
    },
  ];

  const experience = [
    {
      title: "Embedded Systems Developer",
      company: "UBC Bionics",
      location: "Vancouver, BC",
      period: "2025 - Present",
      description: [
        "Engineer Rust-to-Python interface using PyO3 and maturin for EMG-controlled prosthetic arm targeting CYBATHLON 2028",
        "Restructure GPM codebase improving team usability (reported by overwhelming majority of teammates)",
        "Design centralized task-dispatcher architecture for multi-module coordination",
        "Validate integration on Raspberry Pi Zero with custom PCB hardware",
      ],
    },
    {
      title: "Finance Officer",
      company: "Project Tech Careers",
      location: "Calgary, AB",
      period: "2024",
      description: [
        "Coordinated logistics, funding, and operations for AI-focused student conference at University of Calgary",
        "Managed $14,000+ in sponsorships, grants, and revenue",
        "Supported keynote speakers, workshops, and student innovation sessions",
      ],
    },
    {
      title: "Executive Programmer & Technical Lead",
      company: "VEX Robotics - Alberta #1 Team",
      location: "Alberta",
      period: "2023 - 2024",
      description: [
        "Led 10-member technical team competing at VEX World Championship in Dallas, Texas",
        "Developed autonomous routines in C++ using odometry + IMU for high-precision navigation and pose estimation",
        "Implemented and tuned PID controllers and holonomic drive algorithms for trajectory accuracy",
        "Optimized path-following using pure pursuit algorithms for smooth, predictable motion",
      ],
    },
    {
      title: "3D Designer",
      company: "Youth Digital Talent",
      location: "Calgary, AB",
      period: "2024",
      description: [
        "Designed architectural models for Truth & Reconciliation Garden using Fusion 360 and SolidWorks",
        "Collaborated with Calgary Board of Education officials and Indigenous elders to integrate cultural considerations",
        "Built and deployed project website to communicate design iterations with stakeholders",
      ],
    },
  ];

  const skills = [
    {
      category: "Programming Languages",
      items: ["Rust", "C", "C++", "Python", "SQL", "MATLAB"],
    },
    {
      category: "Frameworks & Tools",
      items: ["PyO3", "maturin", "FastAPI", "Pydantic", "Git/GitHub", "Vite", "Vercel"],
    },
    {
      category: "Hardware & Systems",
      items: ["Raspberry Pi", "Custom PCB Integration", "EMG Signal Processing", "Embedded Linux"],
    },
    {
      category: "Specialized Skills",
      items: ["PID Control", "Odometry", "Pure Pursuit", "System Architecture", "Cybersecurity"],
    },
  ];

  const achievements = [
    "UBC Bionics - CYBATHLON 2028 prosthetic arm development team",
    "VEX World Championship competitor - Dallas, Texas",
    "HoneyKey - Built production-ready security platform at hackathon",
    "Project Tech Careers - Managed $14k+ conference budget",
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Resume</span>
          </h1>
          <p className="text-xl text-gray-400">
            Computer Engineering Student | Software & Hardware Enthusiast
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
          >
            <Download size={20} />
            Download PDF
          </motion.button>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-wrap justify-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-blue-400" />
              <a href="mailto:ekooner656@gmail.com" className="hover:text-white transition-colors">
                ekooner656@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-400" />
              <span>Vancouver, BC</span>
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="text-blue-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Education</h2>
          </div>
          
          {education.map((edu, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 10 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-blue-400 font-medium">{edu.school}</p>
                </div>
                <div className="text-right text-gray-400">
                  <p>{edu.period}</p>
                  <p className="font-semibold text-white">GPA: {edu.gpa}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-3 flex items-center gap-2">
                <MapPin size={16} />
                {edu.location}
              </p>
              <ul className="space-y-2">
                {edu.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-purple-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Experience</h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 10 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-400" />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-purple-400 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-gray-400">
                    <p>{exp.period}</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  {exp.location}
                </p>
                <ul className="space-y-2">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code className="text-blue-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skillSet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-blue-400 mb-4">
                  {skillSet.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((item, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-gray-300"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-yellow-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Achievements & Awards</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <ul className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-300 flex items-start gap-3"
                >
                  <Award size={18} className="text-yellow-400 mt-1 flex-shrink-0" />
                  {achievement}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}