import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";

type Meal = { id: string; label: string; name: string; kcal: number; checked: boolean };

interface TodayPlanCardProps {
  meals: Meal[];
  calorieGoal: number;
  caloriesConsumed: number;
}

const RING = 128;
const STROKE = 11;
const R = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export function TodayPlanCard({ meals, calorieGoal, caloriesConsumed }: TodayPlanCardProps) {
  const pct = Math.min(caloriesConsumed / calorieGoal, 1);
  const offset = CIRC * (1 - pct);
  const remaining = calorieGoal - caloriesConsumed;

  return (
    <View
      style={{
        backgroundColor: colors.cream,
        borderRadius: 24,
        padding: 22,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 20,
            color: colors.espresso,
          }}
        >
          Today's Plan
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: colors.taupe,
          }}
        >
          {new Date().toLocaleDateString("en-CA", {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>

      {/* Ring + stats */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
          marginBottom: 22,
        }}
      >
        {/* Ring with centered text */}
        <View style={{ width: RING, height: RING }}>
          <Svg width={RING} height={RING}>
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              stroke="rgba(44,31,20,0.1)"
              strokeWidth={STROKE}
              fill="none"
            />
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={R}
              stroke={colors.tan}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              strokeLinecap="round"
              rotation={-90}
              originX={RING / 2}
              originY={RING / 2}
            />
          </Svg>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Fraunces_700Bold",
                fontSize: 24,
                color: colors.espresso,
                lineHeight: 26,
              }}
            >
              {caloriesConsumed}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 10,
                color: colors.taupe,
              }}
            >
              kcal
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flex: 1, gap: 10 }}>
          <View>
            <Text
              style={{
                fontFamily: "Fraunces_300Light",
                fontSize: 32,
                color: colors.espresso,
                lineHeight: 34,
              }}
            >
              {remaining}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.taupe,
              }}
            >
              kcal remaining
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(44,31,20,0.1)",
            }}
          />
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: colors.taupe,
            }}
          >
            Daily goal: {calorieGoal} kcal
          </Text>
        </View>
      </View>

      {/* Meal rows */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "rgba(44,31,20,0.08)",
        }}
      >
        {meals.map((meal, i) => (
          <View
            key={meal.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              paddingVertical: 13,
              borderBottomWidth: i < meals.length - 1 ? 1 : 0,
              borderBottomColor: "rgba(44,31,20,0.08)",
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: meal.checked ? colors.tan : colors.taupe,
                backgroundColor: meal.checked ? colors.tan : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {meal.checked && (
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 11,
                    color: colors.bone,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 10,
                  color: colors.taupe,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {meal.label}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: colors.espresso,
                  marginTop: 1,
                }}
              >
                {meal.name}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 13,
                color: colors.taupe,
              }}
            >
              {meal.kcal}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 18 }}>
        <Button label="Log a meal" variant="secondary" size="sm" fullWidth />
      </View>
    </View>
  );
}
