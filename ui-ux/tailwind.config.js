/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#EFF6FF',
          DEFAULT: '#1D4ED8', // blue-700
          dark: '#1E40AF',    // blue-800
        },
      },
      fontSize: {
        'xxs': '0.65rem',
        '3xs': '0.55rem',
        '4xs': '0.45rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
