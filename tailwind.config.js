import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // IL NUOVO TEMA "SLAVATO" E POLVEROSO
        slate: {
          50: '#f5f7fa',
          100: '#eaedf3',
          200: '#d1d8e5',
          300: '#b0bad0', // Testo principale: grigio perla/azzurro, leggibilissimo ma morbido
          400: '#8a98b5',
          500: '#667796',
          600: '#4d5c7a',
          700: '#3d4a63',
          800: '#2f394d', // Bordi e hover: staccano il giusto senza essere "pesanti"
          900: '#242b3b', // Card e Header: un grigio/blu antracite molto slavato
          950: '#1b202c', // Sfondo base: "lavagna opaca", decisamente più chiaro del buio
        },
        // Smorziamo anche gli accenti blu per farli sposare col nuovo sfondo
        blue: {
          50: '#f0f5fe',
          100: '#dee9fd',
          200: '#c4d8fa',
          300: '#9bbef6',
          400: '#75a6f2', // Le scritte azzurre (es. text-blue-400) diventano pastello
          500: '#5288eb', // I bottoni primari sono visibili ma non accecanti
          600: '#3b6dd6', // Hover dei bottoni
          700: '#3057b5',
          800: '#2a4894',
          900: '#1e3863', // Sfondi badge (es. bg-blue-900/50) molto eleganti
          950: '#152445', 
        }
      },
    },
  },
  plugins: [],
};
export default config;