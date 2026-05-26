import { Text, type TextStyle } from "react-native";
import type { ReactNode } from "react";

type Variant = "display" | "heading" | "subheading" | "body" | "caption" | "label";
type Color = "espresso" | "tan" | "cream" | "taupe" | "bone" | "blush" | "sage" | "inherit";

interface ThemedTextProps {
  children: ReactNode;
  variant?: Variant;
  color?: Color;
  className?: string;
  numberOfLines?: number;
  style?: TextStyle;
}

const variantClasses: Record<Variant, string> = {
  display:    "font-display text-4xl leading-tight",
  heading:    "font-display text-2xl leading-snug",
  subheading: "font-display text-xl leading-snug",   // Fraunces for all card headers
  body:       "font-body text-base leading-relaxed",
  caption:    "font-body text-sm leading-normal",
  label:      "font-body-semi text-xs uppercase tracking-widest",
};

const colorClasses: Record<Color, string> = {
  espresso: "text-espresso",
  tan:      "text-tan",
  cream:    "text-cream",
  taupe:    "text-taupe",
  bone:     "text-bone",
  blush:    "text-blush",
  sage:     "text-sage",
  inherit:  "",
};

export function ThemedText({
  children,
  variant = "body",
  color = "inherit",
  className = "",
  numberOfLines,
  style,
}: ThemedTextProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${variantClasses[variant]} ${colorClasses[color]} ${className}`}
      style={style}
    >
      {children}
    </Text>
  );
}
