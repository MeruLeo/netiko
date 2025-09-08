import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sfLight: ["var(--font-sflight)"],
        sfMed: ["var(--font-sfmed)"],
        sfBold: ["var(--font-sfbold)"],
        sfProBold: ["var(--font-sfProBold)"],
      },
      colors: {
        blue: "var(--color-blue)",
        green: "var(--color-green)",
        indigo: "var(--color-indigo)",
        orange: "var(--color-orange)",
        pink: "var(--color-pink)",
        red: "var(--color-red)",
        teal: "var(--color-teal)",
        yellow: "var(--color-yellow)",
        gray: "var(--color-gray)",
        gray2: "var(--color-gray2)",
        gray3: "var(--color-gray3)",
        gray4: "var(--color-gray4)",
        link: "var(--color-link)",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
