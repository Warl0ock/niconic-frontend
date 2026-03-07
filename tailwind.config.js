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
          navy: '#012B54',
          mint: '#6CEBD2',
        }
      },
      fontFamily: {
        // Kita pakai font bawaan yang bersih dulu, nanti bisa diganti Google Fonts
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}
