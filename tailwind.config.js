/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        espresso:  "#2C1F14",
        tan:       "#C4A07A",
        blush:     "#E2C3B8",
        sage:      "#8AAE85",
        cream:     "#EDE5D8",
        taupe:     "#7A6557",
        bone:      "#FDFAF6",
      },
      fontFamily: {
        // Explicit variant names — required for React Native font loading
        body:           ["Inter_400Regular"],
        "body-medium":  ["Inter_500Medium"],
        "body-semi":    ["Inter_600SemiBold"],
        "body-bold":    ["Inter_700Bold"],
        display:        ["Fraunces_700Bold"],
        "display-light":["Fraunces_300Light"],
      },
    },
  },
  plugins: [],
};
