export const colors = {
  // ── New core palette ────────────────────────────────────────────────────────
  forest: "#2D4A3E",   // dark forest green — primary actions, avatar bg
  sage:   "#5A8A78",   // medium sage — carbs, secondary green
  clay:   "#C44B3A",   // rust/terracotta — fat, italic headline, warning

  // ── Neutral ground ──────────────────────────────────────────────────────────
  linen:  "#EAE4D6",   // warm greige — main background
  white:  "#FFFFFF",   // pure white — card surfaces
  ink:    "#1C1917",   // near-black — primary text
  stone:  "#6B6560",   // warm gray — secondary text

  // ── Backward-compat aliases (same names, new values) ───────────────────────
  bone:     "#EAE4D6",  // → linen (background)
  cream:    "#FFFFFF",  // → white (card surface)
  espresso: "#2D4A3E",  // → forest (primary)
  tan:      "#5A8A78",  // → sage (accent)
  taupe:    "#6B6560",  // → stone (muted)

  // ── Semantic ────────────────────────────────────────────────────────────────
  background:    "#EAE4D6",
  surface:       "#FFFFFF",
  primary:       "#2D4A3E",
  secondary:     "#5A8A78",
  muted:         "#6B6560",
  textPrimary:   "#1C1917",
  textSecondary: "#6B6560",
  textInverse:   "#FFFFFF",
} as const;

// Macro-specific colours used in progress bars and table headers
export const macroColors = {
  protein: "#2D4A3E",  // forest green
  carbs:   "#5A8A78",  // sage green
  fat:     "#C44B3A",  // clay/rust
} as const;

export const fonts = {
  body: "Inter",
  display: "Fraunces",
} as const;

export const theme = {
  light: { bg: colors.linen, text: colors.ink, cta: colors.forest },
  dark:  { bg: colors.forest, text: colors.white, cta: colors.sage },
} as const;

export type ColorToken = keyof typeof colors;
export type ThemeKey = keyof typeof theme;
