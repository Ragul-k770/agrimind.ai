/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      colors: {
        agrimind: {
          900: '#062c19', // Darkest green
          800: '#0b4a2c', // Dark Green
          700: '#116a40',
          600: '#178a54', // Main brand color
          500: '#22b06e', // Lighter green gradient
        }
      }
    },
  },
  plugins: [],
}
