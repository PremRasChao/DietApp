// Brand colour tokens — single source of truth
export const colors = {
  espresso:   "#2C1F14",  // primary text, dark card bg
  tan:        "#C4A07A",  // CTA, warm accent (refined from #C8A882)
  blush:      "#E2C3B8",  // soft dusty rose accent
  sage:       "#8AAE85",  // muted sage green accent
  cream:      "#EDE5D8",  // card bg (refined from #E8DDD0)
  taupe:      "#7A6557",  // secondary text — WCAG AA on bone & cream
  bone:       "#FDFAF6",  // page background (refined from #FAF8F5)
} as const;

export const shadows = {
  sm: {
    shadowColor: "#2C1F14",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#2C1F14",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: "#2C1F14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
} as const;

export const fonts = {
  body: "Inter_400Regular",
  bodySemi: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold",
  display: "Fraunces_700Bold",
} as const;

export const theme = {
  light: {
    bg: colors.bone,
    text: colors.espresso,
    cta: colors.tan,
  },
  dark: {
    bg: colors.espresso,
    text: colors.bone,
    cta: colors.tan,
  },
} as const;

export type ColorToken = keyof typeof colors;
export type ThemeKey = keyof typeof theme;
