/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        chatbot: {
          light: "#f7f7f8",
          dark: "#343541",
          border: "#e5e5e5"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
