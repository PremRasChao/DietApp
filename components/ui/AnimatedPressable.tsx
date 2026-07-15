import { Pressable, PressableProps, ViewStyle, StyleProp } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const Base = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, "style"> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  // Scale to grow to on pointer hover (web/mouse only — no-op on touch). Omit for no hover effect.
  hoverScale?: number;
}

// Shared press feedback (spring scale) for every tappable element in the app.
export function AnimatedPressable({
  style, scaleTo = 0.96, hoverScale, onPressIn, onPressOut, onHoverIn, onHoverOut, ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Base
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, { damping: 16, stiffness: 380 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(hoverScale ?? 1, { damping: 14, stiffness: 260 });
        onPressOut?.(e);
      }}
      onHoverIn={(e) => {
        if (hoverScale) scale.value = withSpring(hoverScale, { damping: 13, stiffness: 220 });
        onHoverIn?.(e);
      }}
      onHoverOut={(e) => {
        scale.value = withSpring(1, { damping: 13, stiffness: 220 });
        onHoverOut?.(e);
      }}
      {...rest}
    />
  );
}
