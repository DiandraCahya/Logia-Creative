import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0EA5E9", // Primary Blue
          aqua: "#67C7D2",    // Gradient Aqua
          mint: "#A8E6D7",    // Mint
          navy: "#0B1F38",    // Deep Navy (Dark BG)
          slate: "#1E3A8A",   // Slate Blue
          light: "#EAF2F7",   // Light Gray (Light BG)
        },
      },
      boxShadow: {
        // Neumorphism Light
        "neumorph-flat-light": "8px 8px 18px #cad5e2, -8px -8px 18px #ffffff",
        "neumorph-sm-light": "4px 4px 10px #cad5e2, -4px -4px 10px #ffffff",
        "neumorph-inset-light": "inset 4px 4px 8px #cad5e2, inset -4px -4px 8px #ffffff",
        "neumorph-btn-light": "5px 5px 12px #cad5e2, -5px -5px 12px #ffffff",
        // Neumorphism Dark
        "neumorph-flat-dark": "8px 8px 20px #06111f, -8px -8px 20px #102d51",
        "neumorph-sm-dark": "4px 4px 10px #06111f, -4px -4px 10px #102d51",
        "neumorph-inset-dark": "inset 4px 4px 8px #06111f, inset -4px -4px 8px #102d51",
        "neumorph-btn-dark": "5px 5px 14px #06111f, -5px -5px 14px #102d51",
        // Liquid Glass Glow
        "glass-glow": "0 0 25px rgba(14, 165, 233, 0.25), 0 0 60px rgba(103, 199, 210, 0.15)",
        "glass-glow-lg": "0 0 40px rgba(14, 165, 233, 0.4), 0 0 90px rgba(168, 230, 215, 0.2)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-reverse": "floatReverse 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(2deg)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(16px) rotate(-2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.06)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
