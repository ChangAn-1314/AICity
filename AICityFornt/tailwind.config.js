/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#06B6D4', // Cyber Blue
        accent: '#A855F7',  // Neon Purple
        alert: '#EF4444',   // Alert Red
        success: '#10B981', // Success Green
      },
      fontFamily: {
        sans: ['Alibaba PuHuiTi 2.0', 'Inter', 'sans-serif'],
        mono: ['Orbitron', 'monospace'], // Fallback to monospace if Orbitron not loaded
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.3))',
      }
    },
  },
  plugins: [],
}
