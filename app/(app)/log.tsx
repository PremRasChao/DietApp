import { ScrollView, View } from "react-native";
import { Camera, Search, Utensils } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";
import { CALORIE_GOAL, mockMeals } from "@/lib/mockData";

const loggedMeals = mockMeals.filter((meal) => meal.checked);
const consumedCalories = loggedMeals.reduce((sum, meal) => sum + meal.kcal, 0);

function ActionTile({
  label,
  detail,
  Icon,
}: {
  label: string;
  detail: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}) {
  return (
    <Card variant="default" className="flex-1 p-4">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: colors.cream }}
      >
        <Icon size={18} color={colors.tan} strokeWidth={1.9} />
      </View>
      <ThemedText variant="caption" color="espresso">{label}</ThemedText>
      <ThemedText variant="label" color="taupe" className="mt-1">{detail}</ThemedText>
    </Card>
  );
}

export default function LogScreen() {
  return (
    <ScrollView
      className="flex-1 bg-bone"
      contentContainerStyle={{ padding: 20, paddingTop: 64, paddingBottom: 112 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <ThemedText variant="heading" color="espresso">Food log</ThemedText>
        <ThemedText variant="body" color="taupe" className="mt-1">
          Capture meals quickly, then refine the details when you have time.
        </ThemedText>
      </View>

      <Card variant="dark" className="p-5 mb-5">
        <ThemedText variant="label" color="sage">Today logged</ThemedText>
        <View className="flex-row items-end justify-between mt-2">
          <View>
            <ThemedText variant="display" color="bone">
              {consumedCalories}
            </ThemedText>
            <ThemedText variant="caption" color="taupe">
              of {CALORIE_GOAL.toLocaleString()} kcal
            </ThemedText>
          </View>
          <View className="items-end">
            <ThemedText variant="heading" color="bone">{loggedMeals.length}</ThemedText>
            <ThemedText variant="label" color="taupe">meals</ThemedText>
          </View>
        </View>
        <View className="h-2 rounded-full overflow-hidden mt-4" style={{ backgroundColor: "rgba(253, 250, 246, 0.14)" }}>
          <View
            className="h-2 rounded-full"
            style={{
              width: `${Math.min((consumedCalories / CALORIE_GOAL) * 100, 100)}%`,
              backgroundColor: colors.tan,
            }}
          />
        </View>
      </Card>

      <View className="flex-row gap-3 mb-5">
        <ActionTile label="Scan plate" detail="Camera" Icon={Camera} />
        <ActionTile label="Search food" detail="Database" Icon={Search} />
      </View>

      <Card variant="cream" className="p-5">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <ThemedText variant="label" color="taupe">Recent entry</ThemedText>
            <ThemedText variant="subheading" color="espresso" className="mt-1">
              {loggedMeals[0]?.name ?? "No meals yet"}
            </ThemedText>
          </View>
          <View
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.bone }}
          >
            <Utensils size={18} color={colors.sage} strokeWidth={1.9} />
          </View>
        </View>
        <ThemedText variant="body" color="taupe" className="mb-4">
          {loggedMeals[0]
            ? `${loggedMeals[0].kcal} kcal with ${loggedMeals[0].protein}g protein logged.`
            : "Start with a quick add or scan your plate."}
        </ThemedText>
        <Button label="Add food" variant="primary" fullWidth />
      </Card>
    </ScrollView>
  );
}
