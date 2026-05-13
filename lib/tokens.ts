// Brand colour tokens — single source of truth
export const colors = {
  espresso: "#2C1F14",
  tan: "#C8A882",
  cream: "#E8DDD0",
  taupe: "#9A8270",
  bone: "#FAF8F5",
} as const;

export const fonts = {
  body: "Inter",
  display: "Fraunces",
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
