/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          dark: '#0f172a',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          neon: '#0ea5e9'
        }
      }
    },
  },
  plugins: [],
}
