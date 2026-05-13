import { View } from "react-native";
import { MotiView } from "moti";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";

interface StreakCardProps {
  days: number;
  nextMilestone: number;
}

export function StreakCard({ days, nextMilestone }: StreakCardProps) {
  return (
    <Card variant="cream" className="flex-row items-center gap-4 p-4">
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ type: "timing", duration: 700, loop: true, repeatReverse: true }}
      >
        <View className="w-12 h-12 rounded-full bg-tan items-center justify-center">
          <ThemedText variant="subheading">🔥</ThemedText>
        </View>
      </MotiView>
      <View className="flex-1">
        <ThemedText variant="subheading" color="espresso">{days} day streak</ThemedText>
        <ThemedText variant="caption" color="taupe">
          {nextMilestone - days} more day{nextMilestone - days !== 1 ? "s" : ""} to your {nextMilestone}-day milestone
        </ThemedText>
      </View>
    </Card>
  );
}
