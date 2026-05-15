import { Text } from "react-native";
import type { ReactNode } from "react";

type Variant = "display" | "heading" | "subheading" | "body" | "caption" | "label";
type Color = "espresso" | "tan" | "cream" | "taupe" | "bone" | "inherit";

interface ThemedTextProps {
  children: ReactNode;
  variant?: Variant;
  color?: Color;
  className?: string;
  numberOfLines?: number;
}

// font-body / font-display etc. map to exact loaded font names via tailwind.config.js
const variantClasses: Record<Variant, string> = {
  display:    "font-display text-4xl leading-tight",
  heading:    "font-display text-2xl leading-snug",
  subheading: "font-body-semibold text-xl leading-snug",
  body:       "font-body text-base leading-relaxed",
  caption:    "font-body text-sm",
  label:      "font-body-semibold text-xs uppercase tracking-widest",
};

const colorClasses: Record<Color, string> = {
  espresso: "text-espresso",
  tan:      "text-tan",
  cream:    "text-cream",
  taupe:    "text-taupe",
  bone:     "text-bone",
  inherit:  "",
};

export function ThemedText({
  children,
  variant = "body",
  color = "inherit",
  className = "",
  numberOfLines,
}: ThemedTextProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={`${variantClasses[variant]} ${colorClasses[color]} ${className}`}
    >
      {children}
    </Text>
  );
}
