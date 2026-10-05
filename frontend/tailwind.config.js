/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#FFFFF4", // Solid premium background (Ivory)
        bgSecondary: "#F7FCFC", // Very light accent sections (Turquoise tint)
        bgWarm: "#FAF3E0", // Gold accent tint
        primaryTurquoise: "#40C0C0", // Primary Accent
        brightTurquoise: "#008B8B", // Primary Button
        darkCyan: "#008B8B", // Primary Button
        accentGold: "#D4AF37", // Luxury Accent
        mainText: "#0F5D66", // Primary Heading
        secondaryHeading: "#176F78", // Secondary Heading
        bodyText: "#4D666B", // Body Text
        secondaryText: "#4D666B", // Secondary Body Text
        mutedText: "#71858A", // Muted Text
        white: "#FFFFFF",
      },
      fontFamily: {
        serif: ["DM Serif Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        '18': '4.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
