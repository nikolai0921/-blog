/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0faf4',
          100: '#d9f2e3',
          200: '#b2e5c6',
          300: '#7dcfa3',
          400: '#4db57d',
          500: '#2d9960',
          600: '#1f7a4a',
          700: '#186139',
          800: '#154e2f',
          900: '#0f3520',
          950: '#071a10',
        },
        slate: {
          850: '#1a1f2e',
          900: '#0f1219',
          950: '#080b10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
