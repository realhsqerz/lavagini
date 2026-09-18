import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0F172A",
        primary: "#0F172A",
        accent: "#2563EB",
        muted: "#F1F5F9",
        success: "#22C55E",
        border: "#CBD5E1",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 40px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(37, 99, 235, 0.16), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
