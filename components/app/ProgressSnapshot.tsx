import { View, Text } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { colors } from "@/lib/tokens";

type DayData = { day: string; kcal: number };

interface ProgressSnapshotProps {
  weeklyData: DayData[];
  calorieGoal: number;
}

function Bar({ day, kcal, goal }: { day: string; kcal: number; goal: number }) {
  const filled = useSharedValue(0);
  const empty = useSharedValue(1);
  const pct = Math.min(kcal / goal, 1);
  const atGoal = pct >= 0.9;

  useEffect(() => {
    filled.value = withTiming(pct, { duration: 700 });
    empty.value = withTiming(1 - pct, { duration: 700 });
  }, []);

  const filledStyle = useAnimatedStyle(() => ({
    flex: filled.value,
    height: "100%",
    backgroundColor: atGoal ? colors.tan : colors.taupe,
    borderRadius: 6,
    opacity: atGoal ? 1 : 0.55 + filled.value * 0.45,
  }));

  const emptyStyle = useAnimatedStyle(() => ({
    flex: empty.value,
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_500Medium",
          fontSize: 12,
          color: colors.taupe,
          width: 32,
        }}
      >
        {day.slice(0, 3)}
      </Text>
      <View
        style={{
          flex: 1,
          height: 8,
          backgroundColor: colors.cream,
          borderRadius: 6,
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <Animated.View style={filledStyle} />
        <Animated.View style={emptyStyle} />
      </View>
      <Text
        style={{
          fontFamily: "Inter_500Medium",
          fontSize: 12,
          color: atGoal ? colors.espresso : colors.taupe,
          width: 56,
          textAlign: "right",
        }}
      >
        {kcal}
      </Text>
    </View>
  );
}

export function ProgressSnapshot({
  weeklyData,
  calorieGoal,
}: ProgressSnapshotProps) {
  return (
    <View
      style={{
        backgroundColor: colors.bone,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.cream,
        padding: 22,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 18,
            color: colors.espresso,
          }}
        >
          This week
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 11,
            color: colors.taupe,
          }}
        >
          goal: {calorieGoal} kcal
        </Text>
      </View>
      {weeklyData.map((d) => (
        <Bar key={d.day} day={d.day} kcal={d.kcal} goal={calorieGoal} />
      ))}
    </View>
  );
}
