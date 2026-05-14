import { ScrollView, Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";
import { Utensils, RefreshCw, Sparkles, Scale } from "lucide-react-native";
import { colors } from "@/lib/tokens";

type ActionItem = {
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
};

const ACTIONS: ActionItem[] = [
  { label: "Log food",    Icon: Utensils },
  { label: "Find a swap", Icon: RefreshCw },
  { label: "Ask AI",      Icon: Sparkles },
  { label: "Log weight",  Icon: Scale },
];

function ActionPill({ label, Icon }: ActionItem) {
  const scale = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reducedMotion ? 1 : scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.94, { damping: 15, stiffness: 220 }); }}
      onPressOut={() => { scale.value = withSpring(1.0, { damping: 15, stiffness: 220 }); }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View
        style={[
          animStyle,
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 16,
            paddingVertical: 10,
            minHeight: 44,
            borderRadius: 24,
            backgroundColor: colors.cream,
            borderWidth: 1,
            borderColor: colors.bone,
            shadowColor: colors.espresso,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          },
        ]}
      >
        <Icon size={14} color={colors.taupe} strokeWidth={1.75} />
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 13,
            color: colors.espresso,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function QuickActionsRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2, paddingHorizontal: 1 }}
    >
      {ACTIONS.map((action) => (
        <ActionPill key={action.label} label={action.label} Icon={action.Icon} />
      ))}
    </ScrollView>
  );
}
