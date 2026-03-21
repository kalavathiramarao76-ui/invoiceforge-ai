import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#09090b",
        surface: "#111113",
        surfaceHover: "#18181b",
        border: "#27272a",
        borderLight: "#3f3f46",
        text: "#fafafa",
        textMuted: "#a1a1aa",
        textDim: "#71717a",
        accent: "#22c55e",
        accentDark: "#16a34a",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: ["SF Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
