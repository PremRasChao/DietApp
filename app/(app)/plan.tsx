import { ScrollView, View } from "react-native";
import { CalendarDays, CheckCircle2, Circle } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";
import { CALORIE_GOAL, mockMeals } from "@/lib/mockData";

const dayTabs = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function PlanScreen() {
  const plannedCalories = mockMeals.reduce((sum, meal) => sum + meal.kcal, 0);

  return (
    <ScrollView
      className="flex-1 bg-bone"
      contentContainerStyle={{ padding: 20, paddingTop: 64, paddingBottom: 112 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <ThemedText variant="heading" color="espresso">Meal plan</ThemedText>
        <ThemedText variant="body" color="taupe" className="mt-1">
          Your dietitian-built outline for the next few meals.
        </ThemedText>
      </View>

      <View className="flex-row gap-2 mb-5">
        {dayTabs.map((day, index) => (
          <View
            key={day}
            className="flex-1 items-center rounded-xl py-3"
            style={{
              backgroundColor: index === 3 ? colors.espresso : colors.cream,
              borderWidth: 1,
              borderColor: index === 3 ? colors.espresso : colors.cream,
            }}
          >
            <ThemedText variant="label" color={index === 3 ? "bone" : "taupe"}>
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      <Card variant="cream" className="p-5 mb-5">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <ThemedText variant="label" color="taupe">Thursday target</ThemedText>
            <ThemedText variant="heading" color="espresso" className="mt-1">
              {plannedCalories.toLocaleString()} kcal
            </ThemedText>
          </View>
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(138, 174, 133, 0.18)" }}
          >
            <CalendarDays size={22} color={colors.sage} strokeWidth={1.8} />
          </View>
        </View>
        <View className="h-2 rounded-full overflow-hidden bg-bone">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${Math.min((plannedCalories / CALORIE_GOAL) * 100, 100)}%`,
              backgroundColor: colors.sage,
            }}
          />
        </View>
        <ThemedText variant="caption" color="taupe" className="mt-3">
          Balanced against your {CALORIE_GOAL.toLocaleString()} kcal goal.
        </ThemedText>
      </Card>

      <View className="gap-3">
        {mockMeals.map((meal) => {
          const Icon = meal.checked ? CheckCircle2 : Circle;

          return (
            <Card key={meal.id} variant="default" className="p-4">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-11 h-11 rounded-full items-center justify-center"
                  style={{ backgroundColor: meal.checked ? colors.cream : colors.bone }}
                >
                  <Icon
                    size={20}
                    color={meal.checked ? colors.sage : colors.taupe}
                    strokeWidth={1.9}
                  />
                </View>
                <View className="flex-1">
                  <ThemedText variant="label" color="taupe">{meal.label}</ThemedText>
                  <ThemedText variant="subheading" color="espresso" numberOfLines={1}>
                    {meal.name}
                  </ThemedText>
                </View>
                <View className="items-end">
                  <ThemedText variant="caption" color="espresso">{meal.kcal} kcal</ThemedText>
                  <ThemedText variant="label" color="taupe">P {meal.protein}g</ThemedText>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      <View className="mt-5">
        <Button label="Swap a meal" variant="secondary" fullWidth />
      </View>
    </ScrollView>
  );
}
