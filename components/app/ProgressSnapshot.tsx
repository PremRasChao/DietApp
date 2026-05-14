import { View } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useReducedMotion,
  Easing,
} from "react-native-reanimated";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";

type DayData = { day: string; kcal: number };

interface ProgressSnapshotProps {
  weeklyData: DayData[];
  calorieGoal: number;
}

function Bar({ day, kcal, goal }: { day: string; kcal: number; goal: number }) {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const ratio = Math.min(kcal / goal, 1);
  const isOnGoal = ratio >= 0.9;

  useEffect(() => {
    progress.value = withTiming(ratio, {
      duration: reducedMotion ? 0 : 700,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as `${number}%`,
    backgroundColor: isOnGoal ? colors.sage : colors.tan,
    height: 10,
    borderRadius: 6,
  }));

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <ThemedText variant="caption" color="taupe">{day}</ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <ThemedText variant="caption" color="espresso">
            {kcal.toLocaleString()} kcal
          </ThemedText>
          {isOnGoal && (
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.sage,
              }}
            />
          )}
        </View>
      </View>
      <View
        style={{
          height: 10,
          backgroundColor: colors.cream,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <Animated.View style={barStyle} />
      </View>
    </View>
  );
}

export function ProgressSnapshot({ weeklyData, calorieGoal }: ProgressSnapshotProps) {
  const onGoalCount = weeklyData.filter((d) => d.kcal / calorieGoal >= 0.9).length;

  return (
    <Card variant="default" className="p-5">
      <View className="flex-row items-baseline justify-between mb-4">
        <ThemedText variant="subheading" color="espresso">This week</ThemedText>
        <ThemedText variant="caption" color="sage">
          {onGoalCount}/{weeklyData.length} on goal
        </ThemedText>
      </View>
      {weeklyData.map((d) => (
        <Bar key={d.day} day={d.day} kcal={d.kcal} goal={calorieGoal} />
      ))}
    </Card>
  );
}
