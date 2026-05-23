import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        trail: {
          ink: "#14213d",
          blue: "#2563eb",
          indigo: "#4f46e5",
          violet: "#7c3aed",
          mint: "#10b981",
          amber: "#f59e0b",
          coral: "#fb7185"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(79, 70, 229, 0.18)",
        soft: "0 18px 45px rgba(20, 33, 61, 0.1)"
      },
      backgroundImage: {
        "trail-grid":
          "linear-gradient(rgba(37,99,235,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
