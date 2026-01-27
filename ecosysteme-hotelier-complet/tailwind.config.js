/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gestion': '#10b981',
        'reservations': '#3b82f6',
        'distribution': '#f59e0b',
        'experience': '#06b6d4',
        'restauration': '#ef4444',
        'bien-etre': '#a855f7',
      },
      fontFamily: {
        'display': ['Urbanist', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
