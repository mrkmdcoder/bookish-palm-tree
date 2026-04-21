/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        cinder: {
          black: '#050307',
          purple: '#2a1038',
          ember: '#f97316'
        }
      }
    }
  },
  plugins: []
};
