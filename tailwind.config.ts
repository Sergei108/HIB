import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          deep: "var(--background-deep)",
          mid: "var(--background-mid)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "var(--primary)",
          500: "var(--primary)",
          600: "var(--primary)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          400: "var(--secondary)",
          500: "var(--secondary)",
        },
        mint: {
          DEFAULT: "var(--mint)",
          light: "var(--text-mint)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          mint: "var(--text-mint)",
        },
        border: {
          glow: "var(--border-glow)",
          strong: "var(--border-glow)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(var(--border-glow) 1px, transparent 1px), linear-gradient(90deg, var(--border-glow) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, var(--body-gradient-1), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 30px var(--body-gradient-1)",
        "glow-sm": "0 0 15px var(--body-gradient-1)",
        "glow-mint": "0 0 30px rgba(45, 212, 191, 0.3)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px var(--body-gradient-1)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 40px var(--body-gradient-1)",
            transform: "scale(1.02)",
          },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-slow": "fade-in-slow 0.8s ease-out forwards",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
