/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0.5",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
      animation: {
        "bounce-in": "bounce-in 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
