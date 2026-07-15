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

// ── App shell design system ("the kitchen scale") ───────────────────────────
// Scoped to (auth) + (app) screens only — marketing keeps the forest/sage/clay
// palette above. Dark ink chrome with paper-light cards, radial macro dial.
export const appColors = {
  ink:          "#35617E",  // shell background — calming sky blue chrome
  inkRaised:    "#1E425C",  // inner stat chips/cards — deeper, distinct blue so they read apart from the gradient
  inkText:      "#16232C",  // guaranteed-dark text/icons on bright accent elements (fat buttons, badges)
  paper:        "#F7F4EC",  // light cards
  paperDim:     "#EDE8DA",  // dial track / subtle paper variant
  text:         "#23211D",  // text on paper
  textSoft:     "#6B6A5F",  // secondary text on paper
  onInk:        "#F7F4EC",  // primary text on dark shell
  onInkSoft:    "#C4D8E4",  // secondary text on dark shell
  carb:         "#E8A33D",  // turmeric
  protein:      "#C23B5E",  // beet
  fat:          "#6B8F5C",  // kale — also primary/CTA accent
  border:       "#D8D3C2",
  divider:      "#ECE7D9",
  danger:       "#C23B5E",
} as const;

// Shell background gradient — "calming sky blue," not a flat fill.
export const appGradient = {
  shell: ["#4A85AB", "#254A63"] as const,
} as const;

export const appMacroColors = {
  protein: appColors.protein,
  carbs:   appColors.carb,
  fat:     appColors.fat,
} as const;

export const appFonts = {
  body:    "PublicSans",
  display: "Fraunces",
} as const;
