import { View } from "react-native";
import type { ReactNode } from "react";
import { shadows } from "@/lib/tokens";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "cream" | "dark";
}

const variantClasses = {
  default: "bg-bone border border-cream",
  cream:   "bg-cream",
  dark:    "bg-espresso",
};

const variantShadows = {
  default: shadows.md,
  cream:   shadows.sm,
  dark:    shadows.lg,
};

export function Card({ children, className = "", variant = "default" }: CardProps) {
  return (
    <View
      className={`rounded-2xl ${variantClasses[variant]} ${className}`}
      style={variantShadows[variant]}
    >
      {children}
    </View>
  );
}
