// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f8fc",
          100: "#dceef7",
          200: "#b8dcee",
          300: "#72BBDA",
          400: "#3d9fcc",
          500: "#1583bd",
          600: "#006AAB",
          700: "#00568c",
          800: "#00436f",
          900: "#06304d",
          950: "#04182a",
        },
        ink: "#0b1722",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(4, 24, 42, 0.04), 0 8px 24px -8px rgba(4, 24, 42, 0.10)",
        lift: "0 2px 4px rgba(4, 24, 42, 0.04), 0 24px 48px -16px rgba(4, 24, 42, 0.18)",
      },
      animation: {
        "fade-in-up": "fadeInUp 1s ease-out",
        "slide-in-left": "slideInLeft 1s ease-out",
        "slide-in-right": "slideInRight 1s ease-out",
        bounce: "bounce 2s infinite",
        pulse: "pulse 2s infinite",
        "gradient-shift": "gradientShift 15s ease infinite",
        marquee: "marquee 45s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(50px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          from: {
            opacity: "0",
            transform: "translateX(-100px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideInRight: {
          from: {
            opacity: "0",
            transform: "translateX(100px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        bounce: {
          "0%, 20%, 50%, 80%, 100%": {
            transform: "translateY(0)",
          },
          "40%": {
            transform: "translateY(-10px)",
          },
          "60%": {
            transform: "translateY(-5px)",
          },
        },
        pulse: {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        gradientShift: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      },
    },
  },
  plugins: [],
};
