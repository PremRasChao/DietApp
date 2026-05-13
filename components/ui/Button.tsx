import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { colors } from "@/lib/tokens";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-tan active:opacity-80",
    text: "text-espresso font-semibold",
  },
  secondary: {
    container: "border border-tan bg-transparent active:opacity-80",
    text: "text-tan font-semibold",
  },
  ghost: {
    container: "bg-transparent active:opacity-60",
    text: "text-espresso font-semibold",
  },
  dark: {
    container: "bg-espresso active:opacity-80",
    text: "text-bone font-semibold",
  },
};

const sizeClasses: Record<Size, { container: string; text: string }> = {
  sm: { container: "px-4 py-2 rounded-lg", text: "text-sm" },
  md: { container: "px-6 py-3 rounded-xl", text: "text-base" },
  lg: { container: "px-8 py-4 rounded-2xl", text: "text-lg" },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}: ButtonProps) {
  const v = variantClasses[variant];
  const s = sizeClasses[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        flex-row items-center justify-center
        ${v.container} ${s.container}
        ${fullWidth ? "w-full" : "self-start"}
        ${isDisabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "dark" ? colors.bone : colors.espresso}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={`${v.text} ${s.text}`}>{label}</Text>
    </Pressable>
  );
}
