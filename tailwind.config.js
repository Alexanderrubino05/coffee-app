/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#111111",
        accent: "#EF8849",
        secondary: "#141921",
      },
    },
  },
  plugins: [],
};
