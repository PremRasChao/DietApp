/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        espresso: "#2C1F14",
        tan:      "#C8A882",
        cream:    "#E8DDD0",
        taupe:    "#9A8270",
        bone:     "#F5EDDE",
        brand:             "hsl(var(--brand))",
        "brand-foreground":"hsl(var(--brand-foreground))",
      },
      keyframes: {
        "appear-zoom": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "appear-zoom": "appear-zoom 0.5s ease-out forwards",
      },
      fontFamily: {
        // Exact font names matching useFonts() registration
        body: ["Inter_400Regular"],
        "body-medium": ["Inter_500Medium"],
        "body-semibold": ["Inter_600SemiBold"],
        "body-bold": ["Inter_700Bold"],
        display: ["Fraunces_700Bold"],
        "display-italic": ["Fraunces_700Bold_Italic"],
        "display-light": ["Fraunces_300Light"],
      },
    },
  },
  plugins: [],
};
