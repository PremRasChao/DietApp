/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // New palette
        forest:  "#2D4A3E",
        sage:    "#5A8A78",
        clay:    "#C44B3A",
        linen:   "#EAE4D6",
        ink:     "#1C1917",
        stone:   "#6B6560",
        // Backward-compat aliases
        espresso: "#2D4A3E",
        tan:      "#5A8A78",
        cream:    "#FFFFFF",
        taupe:    "#6B6560",
        bone:     "#EAE4D6",
        // Brand CSS-var tokens
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
