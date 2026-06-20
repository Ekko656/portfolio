export const projects = [
  {
    name: 'Arm Sim',
    tag: 'Simulation',
    videoFile: '/projects/arm-sim.webm',
    description:
      'A 7-DOF humanoid arm simulated in MuJoCo, with the forward kinematics, Jacobian, and damped least-squares IK written from scratch in NumPy. Cross-verified against MuJoCo to within 1e-6 m across 50+ random poses.',
    stack: ['Python', 'NumPy', 'MuJoCo', 'MJCF'],
    links: [{ label: 'GitHub', href: 'https://github.com/Ekko656/arm-sim' }],
  },
  {
    name: 'Barrage',
    tag: 'Backend',
    image: '/projects/barrage.png',
    description:
      'A concurrent API load tester that fires thousands of simultaneous requests and visualizes response times in a live dashboard. Useful for finding the exact point an API starts to break.',
    stack: ['Java', 'Spring Boot', 'JUnit 5', 'jQuery'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Ekko656/barrage' },
      { label: 'Live Demo', href: 'https://barrage-0ajs.onrender.com/' },
    ],
  },
  {
    name: 'HoneyKey',
    tag: 'Security',
    image: '/projects/honeykey.png',
    description:
      'A honeypot API that logs and classifies attacker behavior in real time, then generates SOC-style reports. Built in a weekend at nwHacks, finished as a Best Cybersecurity Hack finalist.',
    stack: ['Python', 'FastAPI', 'SQLite', 'MITRE ATT&CK'],
    video: '37EOq--P9oo',
    links: [
      { label: 'GitHub', href: 'https://github.com/Ekko656/HoneyKey' },
      { label: 'Devpost', href: 'https://devpost.com/software/honeykey' },
    ],
  },
  {
    name: 'UBC Bionics',
    tag: 'Embedded',
    image: '/projects/ubcbionics.png',
    videoFile: '/projects/ubc-bionics.mp4',
    description:
      'Embedded software for a trans-radial prosthetic arm. Working on the Rust codebase that handles the lower-level systems work.',
    stack: ['Rust', 'PyO3', 'STM32', 'I²C'],
    links: [
      { label: 'GitHub', href: 'https://github.com/BEARUBC' },
      { label: 'Website', href: 'https://www.ubcbionics.com/' },
    ],
  },
  {
    name: 'VEX Robotics',
    tag: 'Robotics',
    image: '/projects/vex.png',
    objectPosition: 'center 42%',
    description:
      "Built autonomous navigation for my high school's VEX team across two years. We finished as Alberta's top-ranked team and competed at the World Championship in Dallas.",
    stack: ['C++', 'PID', 'Pure Pursuit', 'Odometry'],
    awards: [
      {
        title: 'VEX Robotics Tournament Champion',
        note: 'Awarded VEX Robotics Tournament Champion for excellence in robot design, programming, and competition strategy. Contributed to both technical development and team collaboration to achieve first place.',
      },
      {
        title: 'VEX Robotics Judges Award',
        note: 'Effectively showcased perseverance, creativity, and collaboration as a team. Recognized for our well-rounded and complex robot by a team of qualified judges in the engineering field.',
      },
      {
        title: 'VEX Robotics Design Award',
        note: 'Recognized for engineering skills and innovations that led to having the best-designed robot at a local competition open to teams throughout Alberta & Saskatchewan.',
      },
      {
        title: 'Top 15 Mecha Mayhem Finalist',
        note: "Top 15 finalist at Mecha Mayhem, Canada's largest international competition involving over 260 teams from China, Australia, UK, Brazil and more. A Robotics World Championship qualifying tournament. Showcased exceptional team dynamics and personally applied complex autonomous functions to lead the team to a top 15 spot.",
      },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/dependra123/3300F2023-2024-code' }],
  },
  {
    name: 'Sonar Claw',
    tag: 'Hardware',
    image: '/projects/claw.jpg',
    objectFit: 'contain',
    objectPosition: 'center 22%',
    cardBackground: '#ffffff',
    videoFile: '/projects/claw.mp4',
    description:
      'A small Arduino-powered metal claw that uses a sonar sensor to detect nearby objects, clamps onto them for a few seconds, then releases. A class project built with a hand-modeled CAD design and a custom control loop on the Arduino.',
    stack: ['Arduino', 'C++', 'Sonar (HC-SR04)', 'Fusion 360'],
    links: [],
  },
];
