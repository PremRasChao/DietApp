import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";

type Meal = { id: string; label: string; name: string; kcal: number; checked: boolean };

interface TodayPlanCardProps {
  meals: Meal[];
  calorieGoal: number;
  caloriesConsumed: number;
}

const RING_SIZE = 96;
const STROKE = 8;
const R = (RING_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export function TodayPlanCard({ meals, calorieGoal, caloriesConsumed }: TodayPlanCardProps) {
  const pct = Math.min(caloriesConsumed / calorieGoal, 1);
  const offset = CIRC * (1 - pct);

  return (
    <Card variant="cream" className="p-5">
      <ThemedText variant="subheading" color="espresso" className="mb-4">Today's Plan</ThemedText>

      {/* Progress ring + summary */}
      <View className="flex-row items-center gap-6 mb-5">
        <Svg width={RING_SIZE} height={RING_SIZE}>
          {/* Track */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={R}
            stroke={colors.cream}
            strokeWidth={STROKE}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={R}
            stroke={colors.tan}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <View>
          <ThemedText variant="heading" color="espresso">{caloriesConsumed}</ThemedText>
          <ThemedText variant="caption" color="taupe">of {calorieGoal} kcal</ThemedText>
          <ThemedText variant="caption" color="taupe" className="mt-1">
            {calorieGoal - caloriesConsumed} remaining
          </ThemedText>
        </View>
      </View>

      {/* Meal list */}
      {meals.map((meal, i) => (
        <View
          key={meal.id}
          className={`flex-row items-center gap-3 py-3 ${i < meals.length - 1 ? "border-b border-bone" : ""}`}
        >
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              meal.checked ? "bg-tan border-tan" : "border-taupe"
            }`}
          >
            {meal.checked && <ThemedText variant="caption" color="bone">✓</ThemedText>}
          </View>
          <View className="flex-1">
            <ThemedText variant="label" color="espresso">{meal.label}</ThemedText>
            <ThemedText variant="caption" color="taupe">{meal.name}</ThemedText>
          </View>
          <ThemedText variant="caption" color="taupe">{meal.kcal} kcal</ThemedText>
        </View>
      ))}

      <View className="mt-4">
        <Button label="Log a meal" variant="secondary" size="sm" fullWidth />
      </View>
    </Card>
  );
}
