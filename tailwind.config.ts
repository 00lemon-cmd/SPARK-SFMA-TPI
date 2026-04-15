import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        spark: {
          primary: "#2c3e50",
          breakout: "#c0392b",
          fn: "#10b981",
          dn: "#f59e0b",
          dp: "#ea580c",
          fp: "#ef4444",
          bg: "#cbd5e1",
          card: "#f8fafc",
          audit: "#2d3436",
          program: "#16a085",
        },
      },
    },
  },
  plugins: [],
};

export default config;
