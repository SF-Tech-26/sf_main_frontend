/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        meta: ["Space Grotesk", "sans-serif"],       // AFTERMOVIE
        edition: ["Cinzel", "serif"],                // 66TH EDITION
        title: ["Holtwood One SC", "serif"],          // SPRING FEST 2025
        body: ["Libre Baskerville", "serif"],        // paragraph
      },

      keyframes: {
        fadeRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        type: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
      },

      animation: {
        "fade-right": "fadeRight 0.9s ease-out forwards",
        type: "type 1s steps(12) forwards",
      },
    },
  },
  plugins: [],
};
