// tailwind.config.js
export default {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
        orange: "#EF7F21",
        orangeDark: "#CC502A",
        orangeLight: "#FDC495",
      },
    },
  },
  plugins: [],
};