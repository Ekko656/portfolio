export const projects = [
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
    name: 'UBC Bionics',
    tag: 'Embedded',
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
    image: '/projects/vex.jpg',
    description:
      "Built autonomous navigation for my high school's VEX team across two years. We finished as Alberta's top-ranked team and competed at the World Championship in Dallas.",
    stack: ['C++', 'PID', 'Pure Pursuit', 'Odometry'],
    // TODO: confirm full list from LinkedIn honors (all VEX except HSEC)
    awards: ['Judges Award, 2023-2024'],
    links: [{ label: 'GitHub', href: 'https://github.com/dependra123/3300F2023-2024-code' }],
  },
];
