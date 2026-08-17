/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0A1628",
          900: "#0F2038",
          800: "#15304F",
          700: "#1D4066",
          600: "#28527F",
          500: "#3A6899",
        },
        signal: {
          400: "#FFC94A",
          500: "#F5A623",
          600: "#D98A0F",
        },
        transit: {
          go: "#1F9D6E",
          wait: "#F5A623",
          stop: "#D64545",
          idle: "#6B7A8F",
        },
        paper: "#F6F7F9",
        ink: "#0F2038",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,32,56,0.06), 0 1px 6px rgba(15,32,56,0.06)",
        raised: "0 4px 16px rgba(15,32,56,0.12)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
