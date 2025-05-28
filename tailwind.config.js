/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{
      light: {
        "primary": "#059669",         /* Emerald-600 pour les boutons primaires */
        "primary-focus": "#047857",  /* Emerald-700 pour le hover */
        "primary-content": "#ffffff", /* Texte blanc sur fond primary */
        "secondary": "#10b981",      /* Emerald-500 */
        "accent": "#34d399",         /* Emerald-400 */
        "base-100": "#ffffff",       /* Fond blanc */
        "base-200": "#f9fafb",       /* Gris très clair */
        "base-300": "#f3f4f6",       /* Gris clair */
        "base-content": "#1f2937",   /* Texte gris foncé */
      }
    }],
    base: true,
    styled: true,
    utils: true,
  },
};
