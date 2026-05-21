/**
 * GlassButton — React Native equivalent of the liquid-glass aesthetic.
 * - iOS/Android: BlurView from expo-blur gives real backdrop blur
 * - Web: CSS backdrop-filter fallback
 * Uses the app's brand palette (espresso, tan, cream, bone, taupe).
 */
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/lib/tokens";
import type { ReactNode } from "react";

type GlassVariant = "light" | "dark" | "tan" | "ghost";
type GlassSize   = "sm" | "md" | "lg" | "xl";

interface GlassButtonProps {
  label?: string;
  children?: ReactNode;
  onPress?: () => void;
  variant?: GlassVariant;
  size?: GlassSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

const SIZES: Record<GlassSize, { paddingH: number; paddingV: number; fontSize: number; borderRadius: number }> = {
  sm: { paddingH: 18, paddingV: 10, fontSize: 13, borderRadius: 20 },
  md: { paddingH: 24, paddingV: 14, fontSize: 15, borderRadius: 26 },
  lg: { paddingH: 32, paddingV: 18, fontSize: 17, borderRadius: 32 },
  xl: { paddingH: 44, paddingV: 22, fontSize: 19, borderRadius: 40 },
};

const VARIANTS: Record<GlassVariant, {
  gradientColors: readonly [string, string, string];
  borderColor: string;
  textColor: string;
  blurTint: "light" | "dark" | "default";
}> = {
  light: {
    gradientColors: ["rgba(250,248,245,0.85)", "rgba(232,221,208,0.6)", "rgba(250,248,245,0.75)"],
    borderColor: "rgba(200,168,130,0.35)",
    textColor: colors.espresso,
    blurTint: "light",
  },
  dark: {
    gradientColors: ["rgba(44,31,20,0.85)", "rgba(44,31,20,0.7)", "rgba(44,31,20,0.8)"],
    borderColor: "rgba(200,168,130,0.25)",
    textColor: colors.bone,
    blurTint: "dark",
  },
  tan: {
    gradientColors: ["rgba(200,168,130,0.8)", "rgba(154,130,112,0.6)", "rgba(200,168,130,0.75)"],
    borderColor: "rgba(255,255,255,0.3)",
    textColor: colors.bone,
    blurTint: "light",
  },
  ghost: {
    gradientColors: ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)", "rgba(255,255,255,0.1)"],
    borderColor: "rgba(200,168,130,0.2)",
    textColor: colors.espresso,
    blurTint: "light",
  },
};

export function GlassButton({
  label,
  children,
  onPress,
  variant = "light",
  size = "md",
  fullWidth = false,
  disabled = false,
}: GlassButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];

  const containerStyle: ViewStyle = {
    borderRadius: s.borderRadius,
    overflow: "hidden",
    alignSelf: fullWidth ? "stretch" : "flex-start",
    opacity: disabled ? 0.45 : 1,
    // Outer glow / shadow
    shadowColor: variant === "dark" ? colors.espresso : colors.tan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  };

  const textStyle: TextStyle = {
    fontFamily: "Inter_600SemiBold",
    fontSize: s.fontSize,
    color: v.textColor,
    letterSpacing: 0.2,
  };

  const innerContent = (
    <>
      <LinearGradient
        colors={v.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFillObject]}
      />
      {/* Top highlight line — gives the "glass edge" feel */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: s.borderRadius,
          right: s.borderRadius,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.55)",
        }}
      />
      {/* Border */}
      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: s.borderRadius,
          borderWidth: 1,
          borderColor: v.borderColor,
        }}
      />
      {/* Content */}
      <View
        style={{
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children ?? <Text style={textStyle}>{label}</Text>}
      </View>
    </>
  );

  if (Platform.OS === "web") {
    // Web: use CSS backdrop-filter directly
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
          containerStyle,
          { transform: [{ scale: pressed ? 0.97 : 1 }] },
        ]}
      >
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              // @ts-ignore — web-only styles
              backdropFilter: "blur(12px) saturate(1.4)",
              // @ts-ignore
              WebkitBackdropFilter: "blur(12px) saturate(1.4)",
            },
          ]}
        />
        {innerContent}
      </Pressable>
    );
  }

  // Native: real blur via BlurView
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        containerStyle,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <BlurView intensity={60} tint={v.blurTint} style={StyleSheet.absoluteFillObject} />
      {innerContent}
    </Pressable>
  );
}
