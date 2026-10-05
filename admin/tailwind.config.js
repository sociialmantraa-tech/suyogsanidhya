/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#FFFFF0",
        bgSecondary: "#F2EDDC",
        bgWarm: "#F7E2DA",
        primaryTurquoise: "#40E0D0",
        brightTurquoise: "#00CED1",
        darkCyan: "#008B8B",
        mainText: "#1F2929",
        secondaryText: "#5F6B69",
        white: "#FFFFFF",
      },
      fontFamily: {
        serif: ["DM Serif Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
