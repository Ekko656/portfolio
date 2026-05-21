export const projects = [
  {
    name: 'HoneyKey',
    tag: 'Security',
    description:
      'A honeypot API that logs and classifies attacker behavior in real time, then generates SOC-style reports. Built in a weekend at nwHacks, finished as a Best Cybersecurity Hack finalist.',
    stack: ['Python', 'FastAPI', 'SQLite', 'MITRE ATT&CK'],
    link: { label: 'GitHub', href: 'https://github.com/Ekko656' },
  },
  {
    name: 'Barrage',
    tag: 'Backend',
    description:
      'A concurrent API load tester that fires thousands of simultaneous requests and visualizes response times in a live dashboard. Useful for finding the exact point an API starts to break.',
    stack: ['Java', 'Spring Boot', 'JUnit 5', 'jQuery'],
    link: { label: 'GitHub', href: 'https://github.com/Ekko656' },
  },
  {
    name: 'UBC Bionics',
    tag: 'Embedded',
    description:
      'Embedded software for a trans-radial prosthetic arm. Working on the Rust codebase that handles the lower-level systems work.',
    stack: ['Rust', 'PyO3', 'STM32', 'I²C'],
    link: { label: 'GitHub', href: 'https://github.com/Ekko656' },
  },
  {
    name: 'VEX Robotics',
    tag: 'Robotics',
    description:
      "Built autonomous navigation for my high school's VEX team across two years. We finished as Alberta's top-ranked team and competed at the World Championship in Dallas.",
    stack: ['C++', 'PID', 'Pure Pursuit', 'Odometry'],
    link: { label: 'GitHub', href: 'https://github.com/Ekko656' },
  },
];
