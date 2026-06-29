/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm machined-metal ramp — depth comes from the steps between these.
        deep: '#0a0810',
        base: '#0e0b14',
        surface: '#16121d',
        'surface-2': '#1e1928',
        // Molten amber / bronze — the signature.
        accent: {
          DEFAULT: '#f2a65a',
          deep: '#c97b3c',
          dim: 'rgba(242, 166, 90, 0.5)',
        },
        // Dusty violet — secondary, sparing; bridges the old brand.
        violet: {
          DEFAULT: '#9a7fd6',
          deep: '#6c54a8',
        },
        ink: '#ece7e0',
        muted: '#938b96',
        hair: 'rgba(236, 231, 224, 0.08)',
        'hair-strong': 'rgba(236, 231, 224, 0.14)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        shell: '1200px',
      },
      boxShadow: {
        // Panel catches a faint top light edge + sits on a soft drop.
        panel:
          'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.4), 0 12px 30px -18px rgba(0,0,0,0.7)',
        'panel-hover':
          'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.4), 0 20px 50px -20px rgba(0,0,0,0.85)',
        glow: '0 0 40px -6px rgba(242, 166, 90, 0.35)',
      },
      backgroundImage: {
        'amber-sheen':
          'linear-gradient(135deg, #f2a65a 0%, #e8894a 50%, #c97b3c 100%)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(4%, -3%, 0) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%, 4%, 0) scale(0.96)' },
        },
        'drift-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(-5%, 5%, 0) scale(1.1)' },
        },
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
        drift: 'drift 26s ease-in-out infinite',
        'drift-slow': 'drift-slow 34s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
