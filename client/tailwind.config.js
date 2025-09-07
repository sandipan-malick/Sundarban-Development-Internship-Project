/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "forest-green": "#2C5F2D",
        "earthy-brown": "#8D6E63",
        cream: "#F6F1EB",
      },
    },
  },
  plugins: [],
}
