/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    backgroundImage: {
      'bg': "url('../src/img/bghex.avif')"},
    extend: {
      colors:{
        'bgglass': "rgba(255, 255, 255, .1)",
      }
    },
  },
  plugins: [],
}
