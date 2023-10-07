/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react")

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        purple: {
          extend: "light",
          colors: {
            primary: {
              50: "#D1DBFB",
              100: "#A396F4",
              200: "#A07AEF",
              300: "#A65FE9",
              400: "#B344E2",
              500: "#C72ADB",
              600: "#C222B2",
              700: "#A91B7D",
              800: "#8F144F",
              900: "#740F29",
              DEFAULT: "#C72ADB",
            },
          },
        },
      },
    }),
  ],
}
