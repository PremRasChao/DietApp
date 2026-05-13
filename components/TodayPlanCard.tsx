import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/lib/tokens";

interface TodayPlanCardProps {
  /** Display name token — must be a template token, e.g. "[First name]" */
  greeting?: string;
  caloriesConsumed: number;
  caloriesGoal: number;
}

const RING_RADIUS = 54;
const RING_STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function TodayPlanCard({
  greeting = "[First name]",
  caloriesConsumed,
  caloriesGoal,
}: TodayPlanCardProps) {
  const progress = caloriesGoal > 0 ? Math.min(caloriesConsumed / caloriesGoal, 1) : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const remaining = Math.max(caloriesGoal - caloriesConsumed, 0);
  const size = (RING_RADIUS + RING_STROKE) * 2;

  return (
    <View className="bg-bone rounded-2xl p-5 gap-4">
      <Text className="font-display text-xl text-espresso">
        Good day, {greeting}
      </Text>

      <View className="items-center">
        <Svg width={size} height={size}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={RING_RADIUS}
            stroke={colors.cream}
            strokeWidth={RING_STROKE}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={RING_RADIUS}
            stroke={colors.tan}
            strokeWidth={RING_STROKE}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        <View className="absolute items-center justify-center" style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <Text className="text-3xl font-bold text-espresso">{caloriesConsumed}</Text>
          <Text className="text-xs text-taupe">of {caloriesGoal} kcal</Text>
        </View>
      </View>

      <Text className="text-center text-taupe">
        {remaining > 0 ? `${remaining} kcal remaining` : "Daily goal reached!"}
      </Text>
    </View>
  );
}
