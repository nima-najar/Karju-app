/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Karava Brutalist Palette
        concrete: {
          DEFAULT: '#e0ded9',
          dark: '#cccdc6',
          light: '#dcdad5',
        },
        ink: '#1a1a1a',
        safety: '#ff5e00',
        moss: '#4a5d23',
      },
      fontFamily: {
        display: ['var(--font-lalezar)', 'system-ui'],
        body: ['var(--font-vazirmatn)', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        marquee: 'marquee 20s linear infinite',
        'marquee-reverse': 'marquee 25s linear infinite reverse',
        wiggle: 'wiggle 1s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderWidth: {
        3: '3px',
        4: '4px',
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px #0f172a',
        'brutal-sm': '2px 2px 0px 0px #0f172a',
        'brutal-lg': '8px 8px 0px 0px #0f172a',
        'brutal-hover': '1px 1px 0px 0px #0f172a',
      },
    },
  },
  plugins: [],
};
