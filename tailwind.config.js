/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        espresso: "#2C1F14",
        tan: "#C8A882",
        cream: "#E8DDD0",
        taupe: "#9A8270",
        bone: "#FAF8F5",
      },
      fontFamily: {
        body: ["Inter"],
        display: ["Fraunces"],
      },
    },
  },
  plugins: [],
};
