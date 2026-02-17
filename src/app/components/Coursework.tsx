import { motion } from "motion/react";
import { BookOpen, CheckCircle, Clock, Star } from "lucide-react";

export function Coursework() {
  const courses = [
    {
      code: "APSC 160",
      name: "Introduction to Computation in Engineering Design",
      description: "Analysis and simulation, laboratory data acquisition and processing, measurement interfaces, engineering tools, computer systems organization, and programming languages. Foundation for interfacing software with measurement and hardware-adjacent workflows.",
      semester: "Fall 2024",
      grade: "A",
      status: "completed",
      skills: ["C Programming", "Data Acquisition", "System Organization"],
    },
    {
      code: "APSC 100",
      name: "Introduction to Engineering I",
      description: "Roles and responsibilities of engineers, sustainability, engineering design process, foundational scientific principles applied to design, prototyping, engineering graphics, technical communication, and engineering ethics.",
      semester: "Fall 2024",
      grade: "A-",
      status: "completed",
      skills: ["Design Process", "Prototyping", "Technical Communication"],
    },
    {
      code: "APSC 101",
      name: "Introduction to Engineering II",
      description: "Engineering design, sustainability, prototype testing, team functioning, graphics, and technical communication. Continuation of engineering design fundamentals with emphasis on collaborative work and iterative development.",
      semester: "Spring 2025",
      grade: "A",
      status: "completed",
      skills: ["Team Collaboration", "Testing", "Design Iteration"],
    },
    {
      code: "MATH 100",
      name: "Differential Calculus",
      description: "Differentiation and integration fundamentals with applications to engineering problems. Core mathematical foundation for modeling, optimization, and analysis in control systems and embedded applications.",
      semester: "Fall 2024",
      grade: "A-",
      status: "completed",
      skills: ["Calculus", "Optimization", "Mathematical Modeling"],
    },
    {
      code: "MATH 101",
      name: "Integral Calculus",
      description: "Techniques of integration, applications, sequences and series. Essential for understanding continuous systems, signal processing, and engineering analysis.",
      semester: "Spring 2025",
      grade: "A",
      status: "completed",
      skills: ["Integration", "Series", "Applied Mathematics"],
    },
    {
      code: "MATH 152",
      name: "Linear Algebra for Engineers",
      description: "Systems of equations, Gaussian elimination, matrix operations, determinants, orthogonality, eigenvalues/eigenvectors, and linear transformations. Direct applications in control systems, state estimation, and pose tracking.",
      semester: "Spring 2025",
      status: "in-progress",
      skills: ["Linear Algebra", "Matrix Operations", "Eigenvalues"],
    },
    {
      code: "MATH 215",
      name: "Elementary Differential Equations",
      description: "Ordinary differential equations with applications to engineering systems. Foundation for understanding dynamic systems, control theory, and signal behavior.",
      semester: "Fall 2025",
      status: "in-progress",
      skills: ["Differential Equations", "System Dynamics", "Control Theory"],
    },
  ];

  const categories = [
    {
      name: "Engineering Foundations",
      description: "Core engineering design, prototyping, and communication courses",
      color: "from-blue-500 to-cyan-500",
      courses: courses.filter(c => ["APSC 100", "APSC 101", "APSC 160"].includes(c.code)),
    },
    {
      name: "Mathematical Analysis",
      description: "Calculus, linear algebra, and differential equations for engineering",
      color: "from-purple-500 to-pink-500",
      courses: courses.filter(c => ["MATH 100", "MATH 101", "MATH 152", "MATH 215"].includes(c.code)),
    },
  ];

  const stats = {
    completed: courses.filter(c => c.status === "completed").length,
    inProgress: courses.filter(c => c.status === "in-progress").length,
    gpa: "Strong",
  };

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
            Relevant <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Coursework</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A comprehensive overview of my academic journey in Computer Engineering
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 text-center"
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <div className="text-4xl font-bold text-white mb-2">{stats.completed}</div>
            <div className="text-gray-400">Courses Completed</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 text-center"
          >
            <Clock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <div className="text-4xl font-bold text-white mb-2">{stats.inProgress}</div>
            <div className="text-gray-400">In Progress</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 text-center"
          >
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <div className="text-4xl font-bold text-white mb-2">{stats.gpa}</div>
            <div className="text-gray-400">Technical GPA</div>
          </motion.div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                  <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                </div>
                <p className="text-gray-400 ml-6">{category.description}</p>
              </div>

              {/* Courses */}
              <div className="grid md:grid-cols-2 gap-6">
                {category.courses.map((course, index) => (
                  <motion.div
                    key={course.code}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group relative"
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity`} />
                    
                    {/* Card */}
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${category.color} bg-opacity-10 rounded-lg mb-2`}>
                            <span className="text-white font-bold">{course.code}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                            {course.name}
                          </h3>
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                          course.status === "completed"
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-yellow-500/10 border border-yellow-500/20"
                        }`}>
                          {course.status === "completed" ? (
                            <>
                              <CheckCircle size={14} className="text-green-400" />
                              <span className="text-green-400 text-xs font-medium">
                                {course.grade}
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock size={14} className="text-yellow-400" />
                              <span className="text-yellow-400 text-xs font-medium">
                                Active
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {course.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Semester */}
                      <div className="flex items-center gap-2 text-gray-500 text-sm pt-4 border-t border-white/5">
                        <BookOpen size={14} />
                        {course.semester}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Academic Interests</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              My coursework reflects a strong foundation in both software and hardware engineering,
              with particular emphasis on systems-level programming, machine learning, and embedded systems.
              I'm especially interested in the intersection of AI and hardware acceleration, and how we can
              build more efficient computing systems for the future.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Beyond the classroom, I regularly participate in study groups, attend technical seminars,
              and contribute to open-source projects related to my coursework. I believe in learning by
              doing and always look for opportunities to apply theoretical knowledge to practical problems.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}