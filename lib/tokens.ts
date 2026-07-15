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
// Aligned with the marketing palette above (forest / sage / clay on warm linen)
// so the app and landing page read as one product. Light shell, white cards,
// forest-green primary accent, radial macro dial.
export const appColors = {
  ink:          "#EAE4D6",  // shell background — warm linen (matches marketing bg)
  inkRaised:    "#FFFFFF",  // chips / pills / dial track — white surfaces that pop on linen
  inkText:      "#FFFFFF",  // text & icons ON the forest accent (buttons, badges, avatar)
  paper:        "#FFFFFF",  // cards — pure white, matching marketing surfaces
  paperDim:     "#F1ECDF",  // subtle paper variant
  text:         "#1C1917",  // primary text on cards (ink)
  textSoft:     "#6B6560",  // secondary text on cards (stone)
  onInk:        "#1C1917",  // primary text on the light shell (ink)
  onInkSoft:    "#6B6560",  // secondary text on the light shell (stone)
  carb:         "#5A8A78",  // sage
  protein:      "#C44B3A",  // clay
  fat:          "#2D4A3E",  // forest — the primary / CTA accent (also fat-macro swatch)
  border:       "#D8D3C8",
  divider:      "#ECE7D9",
  danger:       "#C44B3A",  // clay
} as const;

// Shell background — subtle warm linen wash, not a flat fill.
export const appGradient = {
  shell:  ["#F0EBDF", "#E4DDCC"] as const,
  // Saturated forest accent — used where an element must pop off the light
  // shell (e.g. the tab-bar "+" FAB) with white content on top.
  accent: ["#3A5D4E", "#2D4A3E"] as const,
} as const;

export const appMacroColors = {
  protein: appColors.protein,
  carbs:   appColors.carb,
  fat:     appColors.fat,
} as const;

// Per-nutrient display tokens for the practitioner meal-plan builder.
// Keeps the reference's three-step (pale tint bg / saturated fg / bar fill)
// pattern, but recoloured into our forest / sage / clay earthy palette.
// Fat/Carb/Protein reuse the macro-donut hues; Energy + Fiber are supporting
// earth tones (they're not part of the donut).
export const appNutrient = {
  energy:  { fg: "#2D4A3E", bg: "#E7ECE9", bar: "#AFC4B9" }, // forest headline / soft bar
  fat:     { fg: "#2D4A3E", bg: "#E4EAE7", bar: "#2D4A3E" }, // forest
  carbs:   { fg: "#4C7A6A", bg: "#E8F0EC", bar: "#5A8A78" }, // sage
  protein: { fg: "#C44B3A", bg: "#F7E6E2", bar: "#C44B3A" }, // clay
  fiber:   { fg: "#6F8C46", bg: "#EEF2E3", bar: "#7A9B4E" }, // olive/leaf
} as const;

export const appFonts = {
  body:    "PublicSans",
  display: "Fraunces",
} as const;
