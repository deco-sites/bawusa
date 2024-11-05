import daisyui from "daisyui";

export default {
  content: ["./**/*.tsx"],
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  theme: {
    // https://tailwindcss.com/docs/container#centering-by-default
    container: {
      center: true,
    },
    extend: {
      screens: {
        "tb": "1148px",
      },
      transitionProperty: {
        "height": "height",
        "spacing": "margin, padding",
      },
      colors: {
        "white": "#fff",
        "primary-dark": "#000",
        "primary-default": "#2d2d2d",
        "primary-light": "#f4f4f4",
        "secondary-dark": "#4a3c7d",
        "secondary-default": "#1ba14e",
        "secondary-light": "#21c05e",
        "system-alert-default": "#e32000",
        "system-alert-light": "#fee7e5",
        "system-warning-default": "#ffe01a",
        "system-warning-light": "#fefbc1",
        "system-success-default": "#00a95b",
        "system-success-light": "#e6f6ec",
      },
      animation: {
        "slide-left": "slide-left-frame 0.4s ease normal",
        "slide-right": "slide-right-frame 0.4s ease normal",
        "slide-bottom": "slide-bottom-frame 0.4s ease normal",
        "progress": "progress-frame ease normal",
      },
      keyframes: {
        "slide-left-frame": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-right-frame": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-bottom-frame": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "progress-frame": {
          from: {
            "--dot-progress": "0%",
          },
          to: {
            "--dot-progress": "100%",
          },
        },
      },
    },
  },
};
