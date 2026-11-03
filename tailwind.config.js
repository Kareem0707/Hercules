/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#05020a',
        ebony: '#080312',
        charcoal: {
          DEFAULT: '#0e071c',
          light: '#180d2e',
          border: '#2a164d',
        },
        // Mapped to Electric Neon Purple / Violet (Obsidian Glowing Cube Theme)
        gold: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC', // Electric Neon Violet
          500: '#A855F7', // Core Vivid Neon Purple
          600: '#9333EA', // Deep Neon Violet
          700: '#7E22CE',
          800: '#581C87',
          900: '#3B0764',
          light: '#E9D5FF',
          dark: '#6B21A8',
        },
        neon: {
          purple: '#A855F7',
          violet: '#C084FC',
          magenta: '#D946EF',
          glow: 'rgba(168, 85, 247, 0.5)',
        },
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Alexandria"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(168, 85, 247, 0.35)',
        'gold-md': '0 0 30px rgba(192, 132, 252, 0.45)',
        'gold-lg': '0 0 50px rgba(168, 85, 247, 0.55)',
        'gold-glow': '0 0 25px -2px rgba(217, 70, 239, 0.5)',
        'neon-purple': '0 0 35px rgba(168, 85, 247, 0.5)',
        'neon-glow': '0 0 45px rgba(217, 70, 239, 0.6)',
      },
      keyframes: {
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'spin-slow': 'spinSlow 60s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
