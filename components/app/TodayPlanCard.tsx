import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/lib/tokens";

type Meal = { id: string; label: string; name: string; kcal: number; checked: boolean };

interface TodayPlanCardProps {
  meals: Meal[];
  calorieGoal: number;
  caloriesConsumed: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
}

const RING = 148;
const STROKE = 12;
const R = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function MacroBar({ label, value, goal, color }: { label: string; value: number; goal: number; color: string }) {
  const pct = Math.min(value / goal, 1);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: colors.taupe }}>{label}</Text>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.espresso }}>{Math.round(value)}g</Text>
      </View>
      <View style={{ height: 5, backgroundColor: "rgba(44,31,20,0.08)", borderRadius: 3 }}>
        <View style={{ width: `${pct * 100}%`, height: 5, backgroundColor: color, borderRadius: 3 }} />
      </View>
    </View>
  );
}

export function TodayPlanCard({
  meals,
  calorieGoal,
  caloriesConsumed,
  protein = 0,
  carbs = 0,
  fat = 0,
  proteinGoal = 150,
  carbsGoal = 220,
  fatGoal = 65,
}: TodayPlanCardProps) {
  const pct = Math.min(caloriesConsumed / calorieGoal, 1);
  const offset = CIRC * (1 - pct);
  const remaining = Math.max(calorieGoal - caloriesConsumed, 0);

  return (
    <View
      style={{
        backgroundColor: colors.cream,
        borderRadius: 28,
        padding: 24,
        shadowColor: colors.espresso,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: colors.espresso }}>
          Today
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.taupe }}>
          {new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
        </Text>
      </View>

      {/* Ring + stats row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 24, marginBottom: 24 }}>
        {/* Ring */}
        <View style={{ width: RING, height: RING }}>
          <Svg width={RING} height={RING}>
            <Circle cx={RING / 2} cy={RING / 2} r={R} stroke="rgba(44,31,20,0.08)" strokeWidth={STROKE} fill="none" />
            <Circle
              cx={RING / 2} cy={RING / 2} r={R}
              stroke={colors.tan}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90, ${RING / 2}, ${RING / 2})`}
            />
          </Svg>
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 28, color: colors.espresso, lineHeight: 30 }}>
              {caloriesConsumed}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: colors.taupe, marginTop: 2 }}>
              kcal eaten
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flex: 1, gap: 12 }}>
          <View>
            <Text style={{ fontFamily: "Fraunces_300Light", fontSize: 36, color: colors.espresso, lineHeight: 38 }}>
              {remaining}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.taupe }}>
              kcal remaining
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: "rgba(44,31,20,0.08)" }} />
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.taupe }}>
            Goal: {calorieGoal} kcal
          </Text>
        </View>
      </View>

      {/* Macro bars */}
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          paddingTop: 18,
          borderTopWidth: 1,
          borderTopColor: "rgba(44,31,20,0.08)",
          marginBottom: 20,
        }}
      >
        <MacroBar label="Protein" value={protein} goal={proteinGoal} color={colors.espresso} />
        <MacroBar label="Carbs"   value={carbs}   goal={carbsGoal}   color={colors.tan} />
        <MacroBar label="Fat"     value={fat}      goal={fatGoal}     color={colors.taupe} />
      </View>

      {/* Meal rows */}
      {meals.length > 0 && (
        <View style={{ borderTopWidth: 1, borderTopColor: "rgba(44,31,20,0.06)" }}>
          {meals.map((meal, i) => (
            <View
              key={meal.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                paddingVertical: 12,
                borderBottomWidth: i < meals.length - 1 ? 1 : 0,
                borderBottomColor: "rgba(44,31,20,0.06)",
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: meal.checked ? colors.tan : "transparent",
                  borderWidth: meal.checked ? 0 : 1.5,
                  borderColor: colors.taupe,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {meal.checked && (
                  <Text style={{ fontFamily: "Inter_700Bold", fontSize: 10, color: colors.bone }}>✓</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 10, color: colors.taupe, letterSpacing: 0.8, textTransform: "uppercase" }}>
                  {meal.label}
                </Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.espresso, marginTop: 1 }} numberOfLines={1}>
                  {meal.name}
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.taupe }}>
                {meal.kcal}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
