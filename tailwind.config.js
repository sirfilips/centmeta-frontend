import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1921px",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Newsreader"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        lg: "0.25rem",
        xl: "0.375rem",
        "2xl": "0.5rem",
      },
      colors: {
        // Scala grigio carbone neutro (zero tinta blu, stile Moxfield Dark-Neutral)
        slate: {
          50: "#fafafa",
          100: "#f3f4f6",
          200: "#e2e5ea",
          300: "#c2c7cf",
          400: "#989fa9",
          500: "#727883",
          600: "#525760",
          700: "#393d44",
          800: "#282b2f",
          900: "#1f2124",
          950: "#16171a",
        },
        // Accento Azzurro Sky coordinato al logo CentMeta
        blue: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
      },
    },
  },
  plugins: [],
};
export default config;
