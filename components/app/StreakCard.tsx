import { View } from "react-native";
import { MotiView } from "moti";
import { Flame } from "lucide-react-native";
import { useReducedMotion } from "react-native-reanimated";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";

interface StreakCardProps {
  days: number;
  nextMilestone: number;
}

export function StreakCard({ days, nextMilestone }: StreakCardProps) {
  const reducedMotion = useReducedMotion();
  const daysLeft = nextMilestone - days;

  return (
    <Card variant="cream" className="flex-row items-center gap-4 p-4">
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: reducedMotion ? 1 : 1.07 }}
        transition={
          reducedMotion
            ? { type: "timing", duration: 0 }
            : { type: "timing", duration: 750, loop: true, repeatReverse: true }
        }
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(138, 174, 133, 0.22)" }}
        >
          <Flame size={24} color={colors.tan} strokeWidth={1.75} />
        </View>
      </MotiView>

      <View className="flex-1">
        <ThemedText variant="subheading" color="espresso">
          {days} day streak
        </ThemedText>
        <ThemedText variant="caption" color="taupe" className="mt-0.5">
          {daysLeft} more day{daysLeft !== 1 ? "s" : ""} to your {nextMilestone}-day milestone
        </ThemedText>
      </View>

      {/* Milestone progress dots */}
      <View className="flex-row gap-1">
        {Array.from({ length: Math.min(nextMilestone, 7) }).map((_, i) => (
          <View
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: i < days % nextMilestone ? colors.tan : colors.cream }}
          />
        ))}
      </View>
    </Card>
  );
}
