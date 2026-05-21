export const colors = {
  espresso: "#2C1F14",
  tan:      "#C8A882",
  cream:    "#E8DDD0",
  taupe:    "#9A8270",
  bone:     "#F5EDDE", // warm parchment — replaces plain near-white
  // semantic aliases
  background:    "#F5EDDE",
  surface:       "#E8DDD0",
  primary:       "#2C1F14",
  secondary:     "#C8A882",
  muted:         "#9A8270",
  textPrimary:   "#2C1F14",
  textSecondary: "#9A8270",
  textInverse:   "#F5EDDE",
} as const;

export const fonts = {
  body: "Inter",
  display: "Fraunces",
} as const;

export const theme = {
  light: { bg: colors.bone, text: colors.espresso, cta: colors.tan },
  dark: { bg: colors.espresso, text: colors.bone, cta: colors.tan },
} as const;

export type ColorToken = keyof typeof colors;
export type ThemeKey = keyof typeof theme;
