import { ScrollView, View, Text } from "react-native";
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
import { colors } from "@/lib/tokens";

function SectionHeader({ title }: { title: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
          letterSpacing: 1.5,
          color: colors.taupe,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      <View
        style={{ flex: 1, height: 1, backgroundColor: colors.cream }}
      />
    </View>
  );
}

export default function AppHome() {
  const caloriesConsumed = mockMeals
    .filter((m) => m.checked)
    .reduce((s, m) => s + m.kcal, 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bone }}
      contentContainerStyle={{ paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      <TopBar firstName={mockUser.firstName} />

      <View style={{ paddingHorizontal: 20 }}>
        {/* Streak — hero card, no section header, stands alone */}
        <StreakCard
          days={mockStreak.count}
          nextMilestone={mockStreak.nextMilestone}
        />

        {/* Today's Plan */}
        <View style={{ marginTop: 24 }}>
          <TodayPlanCard
            meals={mockMeals}
            calorieGoal={CALORIE_GOAL}
            caloriesConsumed={caloriesConsumed}
          />
        </View>

        {/* Quick Actions */}
        <View style={{ marginTop: 28 }}>
          <SectionHeader title="Quick actions" />
          <QuickActionsRow />
        </View>

        {/* AI Assistant */}
        <View style={{ marginTop: 28 }}>
          <AIAssistantCard />
        </View>

        {/* Appointment */}
        <View style={{ marginTop: 16 }}>
          <AppointmentCard
            dietitian={mockAppointment.dietitianName}
            date={mockAppointment.date}
            time={mockAppointment.time}
            type={mockAppointment.type}
            isWithin15Min={mockAppointment.isWithin15Min}
          />
        </View>

        {/* Weekly progress */}
        <View style={{ marginTop: 28 }}>
          <ProgressSnapshot
            weeklyData={mockWeeklyProgress}
            calorieGoal={CALORIE_GOAL}
          />
        </View>

        {/* Recipe */}
        <View style={{ marginTop: 28 }}>
          <SectionHeader title="Try tonight" />
          <RecipeCard recipe={mockRecipe} />
        </View>
      </View>
    </ScrollView>
  );
}
