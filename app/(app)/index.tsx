import { ScrollView, View } from "react-native";
import { TopBar } from "@/components/app/TopBar";
import { StreakCard } from "@/components/app/StreakCard";
import { TodayPlanCard } from "@/components/app/TodayPlanCard";
import { QuickActionsRow } from "@/components/app/QuickActionsRow";
import { AIAssistantCard } from "@/components/app/AIAssistantCard";
import { AppointmentCard } from "@/components/app/AppointmentCard";
import { ProgressSnapshot } from "@/components/app/ProgressSnapshot";
import { RecipeCard } from "@/components/app/RecipeCard";
import {
  mockUser,
  mockMeals,
  mockAppointment,
  mockStreak,
  mockRecipe,
  mockWeeklyProgress,
  CALORIE_GOAL,
} from "@/lib/mockData";

export default function AppHome() {
  return (
    <ScrollView
      className="flex-1 bg-bone"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <TopBar firstName={mockUser.firstName} />
      <View className="px-4 gap-4 mt-4">
        <StreakCard days={mockStreak.count} nextMilestone={mockStreak.nextMilestone} />
        <TodayPlanCard
          meals={mockMeals}
          calorieGoal={CALORIE_GOAL}
          caloriesConsumed={mockMeals.filter((m) => m.checked).reduce((s, m) => s + m.kcal, 0)}
        />
        <QuickActionsRow />
        <AIAssistantCard />
        <AppointmentCard
          dietitian={mockAppointment.dietitianName}
          date={mockAppointment.date}
          time={mockAppointment.time}
          type={mockAppointment.type}
          isWithin15Min={mockAppointment.isWithin15Min}
        />
        <ProgressSnapshot weeklyData={mockWeeklyProgress} calorieGoal={CALORIE_GOAL} />
        <RecipeCard recipe={mockRecipe} />
      </View>
    </ScrollView>
  );
}
