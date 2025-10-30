import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        mintGreen: '#CAF187',
        sageGreen: '#B2D675',
        softMint: '#CAF186',
        forestGreen: '#182D1F',
        filtersGray: '#4A4A4A',
        backgroundGray: '#F7F7F5',
        customGray: '#787E8A',
        customGreen: '#99EE9F',
        customYellow: '#FFED5F',
        customRed: '#CC3434',
        customWhite: '#F8F8F8',
        borderGray: '#E0E0E0',
        borderGray2: '#e5e7eb',
        customBlue: '#0518F5',
        mossGreen: '#55655B',
      },
      fontFamily: {
        aeonik: 'var(--font-aeonik)',
        neueMontreal: 'var(--font-neue-montreal)',
      },
    },
  },
  plugins: [],
} satisfies Config;
