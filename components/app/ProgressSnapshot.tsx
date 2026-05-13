import { View } from "react-native";
import { useEffect } from "react";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";

type DayData = { day: string; kcal: number };

interface ProgressSnapshotProps {
  weeklyData: DayData[];
  calorieGoal: number;
}

function Bar({ day, kcal, goal }: { day: string; kcal: number; goal: number }) {
  const pct = useSharedValue(0);

  useEffect(() => {
    pct.value = withTiming(Math.min(kcal / goal, 1), { duration: 800 });
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    flex: pct.value,
    backgroundColor: colors.tan,
    borderRadius: 4,
  }));

  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <ThemedText variant="caption" color="taupe">{day}</ThemedText>
        <ThemedText variant="caption" color="espresso">{kcal} kcal</ThemedText>
      </View>
      <View className="h-2 bg-cream rounded-full overflow-hidden">
        <Animated.View style={[{ height: 8 }, barStyle]} />
      </View>
    </View>
  );
}

export function ProgressSnapshot({ weeklyData, calorieGoal }: ProgressSnapshotProps) {
  return (
    <Card variant="default" className="p-5">
      <ThemedText variant="subheading" color="espresso" className="mb-4">This week's progress</ThemedText>
      {weeklyData.map((d) => (
        <Bar key={d.day} day={d.day} kcal={d.kcal} goal={calorieGoal} />
      ))}
    </Card>
  );
}
