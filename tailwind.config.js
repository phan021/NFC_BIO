/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bio: {
          lightBg: '#e8f3fc',
          lightCard: '#ffffff',
          lightAccent: '#bae0fd',
          lightPrimary: '#0284c7',
          darkBg: '#1e293b',
          darkSurface: '#273549',
          darkCard: '#304159',
          darkAccent: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(2, 132, 199, 0.08)',
        'soft-dark': '0 8px 30px rgba(15, 23, 42, 0.35)',
      }
    },
  },
  plugins: [],
};
