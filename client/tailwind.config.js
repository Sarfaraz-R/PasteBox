/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        deep: "#78A4CB",
        mid: "#95BDD7",
        light: "#B4E1EB",
        warm: "#F9E8A2",
        ink: "#000000",
        danger: "#8B3A3A",
      },
      fontFamily: {
        sans: ["Fira Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.4s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      boxShadow: {
        soft: "0 24px 70px rgba(2, 6, 23, 0.45)",
      },
    },
  },
  plugins: [],
};
