import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef5f1",
          100: "#d6e6dc",
          200: "#a9cdb7",
          500: "#2f6e54",
          600: "#285c46",
          700: "#1f4a38",
          800: "#153628",
          900: "#0c2218",
          950: "#091b13",
        },
        sun: {
          200: "#fde5bb",
          400: "#f9c87d",
          500: "#f1b35a",
          600: "#d79236",
        },
        krem: "#f7f3ea",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
