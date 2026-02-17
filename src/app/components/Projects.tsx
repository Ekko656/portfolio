import { motion } from "motion/react";
import { Github, ExternalLink, Calendar, Tag } from "lucide-react";
import { useState } from "react";

export function Projects() {
  const [filter, setFilter] = useState("All");

  const projects = [
    {
      id: 1,
      title: "UBC Bionics - EMG Prosthetic Arm",
      description: "Engineering the integration layer for a trans-radial prosthetic arm targeting CYBATHLON 2028. Built complete Rust-to-Python interface using PyO3/maturin, restructured GPM codebase for team usability, and validated integration on Raspberry Pi Zero with custom PCBs.",
      image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800",
      tags: ["Rust", "Python", "PyO3", "Embedded Systems"],
      category: "Hardware",
      date: "2025 - Present",
      github: "https://github.com",
    },
    {
      id: 2,
      title: "HoneyKey - Canary Trap Security Platform",
      description: "Designed end-to-end security product using honeypot API endpoints to detect intrusions, capture attacker behavior, classify threats, and auto-generate SOC reports. Built with FastAPI, Pydantic, SQLite, and Gemini AI for threat analysis with rule-based fallback.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
      tags: ["Python", "FastAPI", "Cybersecurity", "SQLite"],
      category: "Software",
      date: "2025",
      github: "https://github.com/Ekko656",
      demo: "https://devpost.com/software/honeykey",
    },
    {
      id: 3,
      title: "VEX Robotics Autonomous System",
      description: "Executive Programmer for Alberta's #1 VEX team competing at World Championship. Developed autonomous routines using odometry + IMU for pose estimation, implemented PID controllers and holonomic drive, optimized paths with pure pursuit algorithms.",
      image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800",
      tags: ["C++", "PID Control", "Odometry", "Robotics"],
      category: "Robotics",
      date: "2023 - 2024",
      github: "https://github.com",
    },
    {
      id: 4,
      title: "Arduino Metal Arm",
      description: "Built a functional robotic arm using Arduino microcontrollers and servo motors. Designed control systems for precise multi-axis movement with sensor feedback and programmed gesture-based controls for intuitive operation.",
      image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800",
      tags: ["Arduino", "C++", "Servo Control", "Robotics"],
      category: "Hardware",
      date: "2025",
      github: "https://github.com/Ekko656",
    },
    {
      id: 5,
      title: "Arduino Remote Control Car",
      description: "Designed and built a remote-controlled car from scratch using Arduino. Implemented wireless communication protocols, motor control systems, and real-time response handling for smooth navigation and control.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      tags: ["Arduino", "C++", "Wireless", "Motor Control"],
      category: "Robotics",
      date: "2022",
      github: "https://github.com/Ekko656",
    },
    {
      id: 6,
      title: "Project Tech Careers Conference",
      description: "Finance Officer for AI-focused student conference at University of Calgary. Managed $14,000+ in sponsorships, grants, and revenue to fund keynote speakers, workshops, and student innovation sessions.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      tags: ["Event Management", "Finance", "Operations"],
      category: "Leadership",
      date: "2024",
    },
  ];

  const categories = ["All", "Hardware", "Software", "Robotics", "Leadership"];

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A showcase of my engineering projects, from embedded systems to machine learning applications
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
              
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  
                  {/* Links Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center gap-4"
                  >
                    {project.github && (
                      <motion.a
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <Github size={20} />
                      </motion.a>
                    )}
                    {project.demo && (
                      <motion.a
                        whileHover={{ scale: 1.2, rotate: -5 }}
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink size={20} />
                      </motion.a>
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 flex items-center gap-1"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm pt-2 border-t border-white/5">
                    <Calendar size={14} />
                    {project.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Want to collaborate?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              I'm always looking for exciting projects to work on. Whether it's a hackathon,
              research opportunity, or internship, let's build something amazing together!
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:ekooner656@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
            >
              Get in Touch
              <ExternalLink size={18} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}