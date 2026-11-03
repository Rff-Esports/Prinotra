/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0A',
          charcoal: '#141414',
          dark: '#1C1C1C',
          muted: '#2A2928',
          grey: '#787673',
          lightgrey: '#E8E6E1',
          beige: '#F7F4EE',
          warmbeige: '#EFEAE0',
          sand: '#DDD4C4',
          gold: '#C5A880',
          goldhover: '#B5966B'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        'premium-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
