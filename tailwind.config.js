/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkBg: "#09090b", // obsidian black
        darkCard: "#121214", // deep charcoal card bg
        darkBorder: "rgba(255, 255, 255, 0.06)", // super-thin border
        accentPrimary: "var(--accent-color, #8b5cf6)", // fallback to violet
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
