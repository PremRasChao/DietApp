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

const variantClasses: Record<Variant, string> = {
  display: "font-display text-4xl font-bold leading-tight",
  heading: "font-display text-2xl font-bold leading-snug",
  subheading: "font-body text-xl font-semibold",
  body: "font-body text-base leading-relaxed",
  caption: "font-body text-sm text-taupe",
  label: "font-body text-xs font-semibold uppercase tracking-widest",
};

const colorClasses: Record<Color, string> = {
  espresso: "text-espresso",
  tan: "text-tan",
  cream: "text-cream",
  taupe: "text-taupe",
  bone: "text-bone",
  inherit: "",
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
