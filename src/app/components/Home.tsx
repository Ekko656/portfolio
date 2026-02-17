import { motion } from "motion/react";
import { Github, Linkedin, Mail, ArrowRight, Code2, Zap, Rocket } from "lucide-react";
import { Link } from "react-router";
import headshot from "figma:asset/9d37641e8fa5e93c1c982b6f47dd3003ff07e507.png";

export function Home() {
  const skills = [
    "Rust", "C/C++", "Python", "FastAPI", "PyO3", "Git",
    "Embedded Systems", "PID Control", "Odometry", "EMG Processing"
  ];

  const stats = [
    { icon: Code2, label: "Projects Completed", value: "10+" },
    { icon: Zap, label: "Technologies", value: "15+" },
    { icon: Rocket, label: "Team Leadership", value: "3" },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-6"
                >
                  <span className="text-blue-400 text-sm font-medium">
                    Available for Internships
                  </span>
                </motion.div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4">
                  Hi, I'm{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ekam Kooner
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-gray-300 mb-2">
                  Engineering Student at UBC
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Embedded systems developer building production-ready integration layers for hardware teams. 
                  Engineering Rust systems for EMG prosthetics at UBC Bionics, with experience in robotics 
                  autonomy and cybersecurity tooling.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                  >
                    View My Work
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>

                <Link to="/resume">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Download Resume
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-4"
              >
                <motion.a
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  href="https://github.com/Ekko656"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <Github size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  href="https://www.linkedin.com/in/ekam-kooner/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <Linkedin size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  href="mailto:ekooner656@gmail.com"
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  <Mail size={20} />
                </motion.a>
              </motion.div>
            </div>

            {/* Right Column - Animated Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{
                  rotateY: [0, 10, 0],
                  rotateX: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl" />
                
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-400/30">
                      <img 
                        src={headshot} 
                        alt="Ekam Kooner" 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Ekam Kooner</h3>
                      <p className="text-gray-400">UBC Applied Science</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Available for Opportunities</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 6).map((skill, index) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 text-gray-300 leading-relaxed"
          >
            <p>
              I'm an engineering student at the University of British Columbia with a focus on embedded 
              systems and hardware-software integration. My work centers on building the scaffolding that 
              lets multidisciplinary teams move faster without sacrificing reliability—whether that's 
              engineering a complete Rust-to-Python interface for prosthetics control or designing autonomous 
              routines that remain stable under imperfect sensors and real mechanical variability.
            </p>
            <p>
              At UBC Bionics, I work on an EMG-controlled trans-radial prosthetic arm being developed toward 
              CYBATHLON 2028 readiness. My positioning isn't just "I wrote code," but "I engineered the 
              integration layer that makes the codebase usable across the team." I implemented a complete 
              Rust-to-Python interface using PyO3 and maturin, restructured the GPM (Grasp Primary Module) 
              codebase for maintainability, and supported a redesign into a centralized task-dispatcher 
              architecture—all validated on real hardware using Raspberry Pi Zero and custom PCBs.
            </p>
            <p>
              Beyond Bionics, I've led VEX Robotics teams to international competition, built cybersecurity 
              tooling that bridges technical detection with executive-ready reporting, and coordinated 
              operations for student-run tech conferences. I thrive on challenges that require both analytical 
              thinking and systems design, and I'm always eager to tackle problems where software boundaries, 
              coupling, and predictable control flow matter.
            </p>
          </motion.div>

          {/* Skills Cloud */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-gray-300 font-medium hover:border-blue-400/40 transition-colors cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}