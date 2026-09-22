import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        civic: {
          950: "#020617",
          900: "#0b1222",
          850: "#0f172a",
          800: "#1e293b",
          700: "#334155",
        },
        power: {
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          purple: "#a855f7",
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-line": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { filter: "drop-shadow(0 0 2px rgba(6, 182, 212, 0.4))" },
          "100%": { filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.9))" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
