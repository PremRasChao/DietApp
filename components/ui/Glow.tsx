/**
 * Glow — ambient radial-gradient background element.
 * Web: true CSS radial-gradient via backgroundImage.
 * Native: expo-linear-gradient approximation.
 */
import { View, Platform, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type GlowVariant = "top" | "above" | "bottom" | "below" | "center";

interface GlowProps {
  variant?: GlowVariant;
  style?: ViewStyle;
}

// Tan brand colour as rgba — avoids CSS-variable dependency in JS
const GLOW_A = "rgba(200,168,130,0.5)";
const GLOW_B = "rgba(200,168,130,0.3)";
const CLEAR  = "rgba(200,168,130,0)";

const OFFSET: Record<GlowVariant, ViewStyle> = {
  top:    { top: 0 },
  above:  { top: -128 },
  bottom: { bottom: 0 },
  below:  { bottom: -128 },
  center: { top: 0 },          // caller centres via transform if needed
};

export function Glow({ variant = "top", style }: GlowProps) {
  const base: ViewStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    overflow: "hidden",
    pointerEvents: "none" as any,
  };

  if (Platform.OS !== "web") {
    // Native — linear gradient stretched into an oval approximates the glow
    return (
      <View style={[base, OFFSET[variant], style]}>
        <LinearGradient
          colors={[GLOW_A, CLEAR]}
          style={{
            alignSelf: "center",
            width: "110%",
            height: 280,
            borderRadius: 999,
            opacity: 0.8,
          }}
        />
      </View>
    );
  }

  // Web — true radial gradients painted on two layered ellipses
  return (
    <View style={[base, OFFSET[variant], style]}>
      {/* Outer diffuse glow */}
      <View
        style={{
          alignSelf: "center",
          width: "60%",
          height: 512,
          borderRadius: 9999,
          transform: [{ scale: 2.5 }],
          // @ts-ignore — backgroundImage is web-only
          backgroundImage: `radial-gradient(ellipse at center,${GLOW_A} 10%,${CLEAR} 60%)`,
        }}
      />
      {/* Inner bright core */}
      <View
        style={{
          position: "absolute",
          alignSelf: "center",
          width: "40%",
          height: 256,
          borderRadius: 9999,
          transform: [{ scale: 2 }],
          // @ts-ignore — backgroundImage is web-only
          backgroundImage: `radial-gradient(ellipse at center,${GLOW_B} 10%,${CLEAR} 60%)`,
        }}
      />
    </View>
  );
}
