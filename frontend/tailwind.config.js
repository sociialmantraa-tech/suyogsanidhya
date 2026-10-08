/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#FFFFFF", // Crisp white background like BetterLYF
        bgSecondary: "#F4F8F8", // Soft teal tint section fill
        bgWarm: "#EBF7F7", // Light cyan accent fill
        primaryTurquoise: "#00AAC1", // BetterLYF Primary Cyan
        brightTurquoise: "#00AAC1", // BetterLYF CTA Button Cyan
        darkCyan: "#00AAC1", // BetterLYF Main Brand Color
        hoverCyan: "#0092A8", // BetterLYF Hover Teal
        deepCyan: "#006B7D", // BetterLYF Deep Ocean Cyan
        accentGold: "#D4AF37", // Retained Subtle Gold
        mainText: "#1F2937", // Dark Slate Heading
        secondaryHeading: "#006B7D", // Deep Ocean Cyan Heading
        bodyText: "#4B5563", // Charcoal Body Text
        secondaryText: "#4B5563", // Body Text
        mutedText: "#6B7280", // Muted Slate Gray
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
