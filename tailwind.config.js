export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        creepster: ["Creepster", "cursive"],
        cinzel: ["Cinzel", "serif"],
        spaceGrotesk: ["Space Grotesk", "sans-serif"],
        libreBaskerville: ["Libre Baskerville", "serif"],
        playfair: ["Playfair Display", "serif"],
        bebas: ["Bebas Neue", "sans-serif"],
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-medium': 'floatMedium 6s ease-in-out infinite',
        'float-fast': 'floatFast 5s ease-in-out infinite',
        'toast-pop': 'toastPop 1.2s ease forwards',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        toastPop: {
          '0%': { opacity: '0', transform: 'translate(-50%, -12px) scale(0.96)' },
          '20%': { opacity: '1', transform: 'translate(-50%, 0) scale(1)' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translate(-50%, -12px) scale(0.96)' },
        },
      },
    },
  },
  plugins: [],
};
