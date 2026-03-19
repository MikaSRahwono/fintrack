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
        bg: {
          DEFAULT: "#0f0f13",
          2: "#16161c",
          3: "#1e1e27",
          4: "#252530",
        },
        border: {
          DEFAULT: "#2a2a38",
          2: "#353545",
        },
        text: {
          DEFAULT: "#e8e8f0",
          2: "#9090a8",
          3: "#5a5a72",
        },
        accent: {
          DEFAULT: "#a8ff3e",
          dim: "rgba(168,255,62,0.12)",
        },
        danger: {
          DEFAULT: "#ff4d4d",
          dim: "rgba(255,77,77,0.12)",
        },
        blue: "#5b8dee",
        yellow: "#ffc857",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        sans: ["var(--font-syne)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
      },
      animation: {
        "fade-in": "fadeIn 150ms ease",
        "slide-up": "slideUp 180ms ease",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
