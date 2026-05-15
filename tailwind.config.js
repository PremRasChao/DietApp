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
