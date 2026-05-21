// Small inline icon set. All use currentColor so they inherit the link color.

export function Icon({ name, size = 16 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true };

  switch (name) {
    case 'github':
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M4 7.5l8 5.5 8-5.5" />
        </svg>
      );
    case 'devpost':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M7 3.5h10l5 8.5-5 8.5H7l-5-8.5 5-8.5z" />
          <path d="M9.6 8v8m0-8h2.1c2.05 0 3.4 1.6 3.4 4s-1.35 4-3.4 4H9.6" strokeLinecap="round" />
        </svg>
      );
    case 'external':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 4h6v6" />
          <path d="M20 4l-8.5 8.5" />
          <path d="M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function iconForLink(label = '', href = '') {
  const l = label.toLowerCase();
  if (href.startsWith('mailto:') || l.includes('@') || l.includes('email')) return 'mail';
  if (l.includes('github')) return 'github';
  if (l.includes('devpost')) return 'devpost';
  if (l.includes('linkedin')) return 'linkedin';
  if (l.includes('demo') || l.includes('website') || l.includes('live') || l.includes('site'))
    return 'external';
  return 'external';
}

// Brand logo mark — a sparkle in a soft gradient tile.
export function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9b3e6" />
          <stop offset="1" stopColor="#7e60b0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
      <path
        d="M16 6.5c1.05 6.9 3.6 9.45 10.5 10.5-6.9 1.05-9.45 3.6-10.5 10.5-1.05-6.9-3.6-9.45-10.5-10.5 6.9-1.05 9.45-3.6 10.5-10.5z"
        fill="#fff"
        transform="translate(0 -1)"
      />
    </svg>
  );
}
