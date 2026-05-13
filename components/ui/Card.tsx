import { View } from "react-native";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "cream" | "dark";
}

const variantClasses = {
  default: "bg-bone border border-cream",
  cream: "bg-cream",
  dark: "bg-espresso",
};

export function Card({ children, className = "", variant = "default" }: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </View>
  );
}
