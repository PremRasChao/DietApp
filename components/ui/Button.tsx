import { Pressable, Text, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";
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
    container: "bg-tan",
    text: "font-body-semi text-espresso",
  },
  secondary: {
    container: "border border-tan bg-transparent",
    text: "font-body-semi text-tan",
  },
  ghost: {
    container: "bg-transparent",
    text: "font-body-semi text-espresso",
  },
  dark: {
    container: "bg-espresso",
    text: "font-body-semi text-bone",
  },
};

const sizeClasses: Record<Size, { container: string; text: string }> = {
  sm: { container: "px-4 py-2.5 rounded-xl",   text: "text-sm" },
  md: { container: "px-6 py-3.5 rounded-2xl",   text: "text-base" },
  lg: { container: "px-8 py-4 rounded-2xl",     text: "text-lg" },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const scale = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reducedMotion ? 1 : scale.value }],
  }));

  const isDisabled = disabled || loading;
  const v = variantClasses[variant];
  const s = sizeClasses[size];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 220 }); }}
      onPressOut={() => { scale.value = withSpring(1.0, { damping: 15, stiffness: 220 }); }}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[animStyle, { minHeight: size === "sm" ? 44 : 48 }]}
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
    </AnimatedPressable>
  );
}
