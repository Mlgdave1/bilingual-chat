/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1a1b23',
          100: '#23242f',
          200: '#2a2b38',
          300: '#363745',
          400: '#494a5c',
          500: '#5c5e73',
          600: '#777992',
          700: '#9698ac',
          800: '#b5b7c5',
          900: '#d4d5de',
        },
        accent: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd7ff',
          300: '#8ebeff',
          400: '#5c9eff',
          500: '#3b82f6',
          600: '#2570eb',
          700: '#1d5dd4',
          800: '#1e4dad',
          900: '#1e4285',
        }
      }
    },
  },
  plugins: [],
}