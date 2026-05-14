import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Check } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";

type Meal = {
  id: string;
  label: string;
  name: string;
  kcal: number;
  checked: boolean;
  protein?: number;
  carbs?: number;
  fat?: number;
};

interface MacroGoals {
  protein: number;
  carbs: number;
  fat: number;
}

interface TodayPlanCardProps {
  meals: Meal[];
  calorieGoal: number;
  caloriesConsumed: number;
  macroGoals?: MacroGoals;
}

const RING_SIZE = 110;
const STROKE = 11;
const R = (RING_SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function MacroChip({
  label,
  consumed,
  goal,
  color,
}: {
  label: string;
  consumed: number;
  goal: number;
  color: string;
}) {
  const pct = Math.min(consumed / goal, 1);
  return (
    <View
      className="flex-1 rounded-2xl p-3"
      style={{
        backgroundColor: colors.bone,
        shadowColor: colors.espresso,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <ThemedText variant="label" color="taupe">{label}</ThemedText>
      <ThemedText variant="subheading" color="espresso" className="mt-0.5">
        {consumed}g
      </ThemedText>
      {/* Mini progress bar */}
      <View
        style={{
          height: 4,
          backgroundColor: colors.cream,
          borderRadius: 2,
          marginTop: 6,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${pct * 100}%`,
            height: 4,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      </View>
      <ThemedText variant="label" color="taupe" className="mt-1">
        of {goal}g
      </ThemedText>
    </View>
  );
}

export function TodayPlanCard({
  meals,
  calorieGoal,
  caloriesConsumed,
  macroGoals,
}: TodayPlanCardProps) {
  const pct = Math.min(caloriesConsumed / calorieGoal, 1);
  const offset = CIRC * (1 - pct);
  const pctLabel = `${Math.round(pct * 100)}%`;

  const checkedMeals = meals.filter((m) => m.checked);
  const totalProtein = checkedMeals.reduce((s, m) => s + (m.protein ?? 0), 0);
  const totalCarbs   = checkedMeals.reduce((s, m) => s + (m.carbs ?? 0), 0);
  const totalFat     = checkedMeals.reduce((s, m) => s + (m.fat ?? 0), 0);

  return (
    <Card variant="cream" className="p-5">
      <ThemedText variant="subheading" color="espresso" className="mb-4">
        Today's Plan
      </ThemedText>

      {/* Progress ring + calorie summary */}
      <View className="flex-row items-center gap-6 mb-4">
        <View style={{ width: RING_SIZE, height: RING_SIZE }}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              stroke={colors.bone}
              strokeWidth={STROKE}
              fill="none"
            />
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
          <View
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText variant="label" color="tan">{pctLabel}</ThemedText>
          </View>
        </View>

        <View className="flex-1">
          <ThemedText variant="heading" color="espresso">{caloriesConsumed}</ThemedText>
          <ThemedText variant="caption" color="taupe">of {calorieGoal} kcal</ThemedText>
          <ThemedText variant="caption" color="taupe" className="mt-1">
            {calorieGoal - caloriesConsumed} remaining
          </ThemedText>
        </View>
      </View>

      {/* Macro breakdown */}
      {macroGoals && (
        <View className="flex-row gap-2 mb-5">
          <MacroChip
            label="Protein"
            consumed={totalProtein}
            goal={macroGoals.protein}
            color={colors.sage}
          />
          <MacroChip
            label="Carbs"
            consumed={totalCarbs}
            goal={macroGoals.carbs}
            color={colors.blush}
          />
          <MacroChip
            label="Fat"
            consumed={totalFat}
            goal={macroGoals.fat}
            color={colors.tan}
          />
        </View>
      )}

      {/* Meal list */}
      {meals.map((meal, i) => (
        <View
          key={meal.id}
          className={`flex-row items-center gap-3 py-3 ${
            i < meals.length - 1 ? "border-b border-bone" : ""
          }`}
        >
          <View
            className="w-5 h-5 rounded-full border-2 items-center justify-center"
            style={{
              backgroundColor: meal.checked ? colors.tan : "transparent",
              borderColor: meal.checked ? colors.tan : colors.taupe,
            }}
          >
            {meal.checked && (
              <Check size={11} color={colors.bone} strokeWidth={3} />
            )}
          </View>

          <View className="flex-1">
            <ThemedText variant="label" color="espresso">{meal.label}</ThemedText>
            <ThemedText variant="caption" color="taupe">{meal.name}</ThemedText>
          </View>

          <View className="items-end">
            <ThemedText variant="caption" color="taupe">{meal.kcal} kcal</ThemedText>
            {meal.protein !== undefined && (
              <ThemedText variant="label" color="taupe" className="mt-0.5">
                P {meal.protein}g
              </ThemedText>
            )}
          </View>
        </View>
      ))}

      <View className="mt-4">
        <Button label="Log a meal" variant="secondary" size="sm" fullWidth />
      </View>
    </Card>
  );
}
