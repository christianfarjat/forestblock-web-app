import type { Config } from 'tailwindcss';

/**
 * Tokens de diseño ForestBlock / IntegrityX.
 * Fuente: tailwind.config.ts del root (forestblock-web-app) — misma familia
 * visual que el resto de la suite: verde bosque profundo, limas, crema,
 * Aeonik, radios 18/28 y pills.
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#182D1F',
        forestInk: '#192C1F',
        moss: '#55655B',
        cream: '#FCFFF6',
        mintGreen: '#CAF187',
        sageGreen: '#B2D675',
        limeBright: '#BFF179',
        limeSoft: '#DAFAA1',
        brandGrey: '#76756E',
        backgroundGray: '#F7F7F5',
        filtersGray: '#4A4A4A',
        customGray: '#787E8A',
        borderGray: '#E0E0E0',
        customGreen: '#99EE9F',
        customYellow: '#FFED5F',
        customRed: '#CC3434',
        customWhite: '#F8F8F8',
        // Semánticos IntegrityX Barrio (estados del dato)
        declared: '#B98A17',
        verified: '#2F7D46',
        audited: '#1D62A8',
      },
      fontFamily: {
        aeonik: 'var(--font-aeonik)',
      },
      borderRadius: {
        card: '28px',
        cardSm: '18px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 10px 26px rgba(25, 44, 31, 0.10)',
        cardHover: '0 14px 34px rgba(25, 44, 31, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
