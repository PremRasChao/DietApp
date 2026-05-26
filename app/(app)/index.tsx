import { ScrollView, View } from "react-native";
import { TopBar } from "@/components/app/TopBar";
import { StreakCard } from "@/components/app/StreakCard";
import { TodayPlanCard } from "@/components/app/TodayPlanCard";
import { QuickActionsRow } from "@/components/app/QuickActionsRow";
import { AIAssistantCard } from "@/components/app/AIAssistantCard";
import { AppointmentCard } from "@/components/app/AppointmentCard";
import { ProgressSnapshot } from "@/components/app/ProgressSnapshot";
import { RecipeCard } from "@/components/app/RecipeCard";
import { BadgesSection } from "@/components/app/BadgesSection";
import { WeeklySummaryCard } from "@/components/app/WeeklySummaryCard";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";
import {
  mockUser,
  mockMeals,
  mockAppointment,
  mockStreaks,
  mockBadges,
  mockWeeklySummary,
  mockRecipe,
  mockWeeklyProgress,
  CALORIE_GOAL,
  MACRO_GOALS,
} from "@/lib/mockData";

const caloriesConsumed = mockMeals
  .filter((m) => m.checked)
  .reduce((s, m) => s + m.kcal, 0);

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View className="flex-row items-baseline justify-between px-1">
      <ThemedText variant="label" color="taupe">
        {title}
      </ThemedText>
      {action && (
        <ThemedText variant="label" color="tan">
          {action}
        </ThemedText>
      )}
    </View>
  );
}

export default function AppHome() {
  return (
    <ScrollView
      className="flex-1 bg-bone"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <TopBar
        firstName={mockUser.firstName}
        streakDays={mockStreaks.logging.count}
        caloriesRemaining={CALORIE_GOAL - caloriesConsumed}
      />

      <View className="px-4 gap-5 mt-5">
        <StreakCard logging={mockStreaks.logging} adherence={mockStreaks.adherence} />

        <SectionHeader title="Today" action="View plan" />
        <TodayPlanCard
          meals={mockMeals}
          calorieGoal={CALORIE_GOAL}
          caloriesConsumed={caloriesConsumed}
          macroGoals={MACRO_GOALS}
        />

        <View className="gap-2">
          <SectionHeader title="Quick actions" />
          <QuickActionsRow />
        </View>

        <SectionHeader title="Coach" />
        <AIAssistantCard />

        <SectionHeader title="Care team" />
        <AppointmentCard
          dietitian={mockAppointment.dietitianName}
          dietitianPhoto={mockAppointment.dietitianPhoto}
          date={mockAppointment.date}
          time={mockAppointment.time}
          type={mockAppointment.type}
          isWithin15Min={mockAppointment.isWithin15Min}
        />

        <SectionHeader title="Progress" />
        <ProgressSnapshot weeklyData={mockWeeklyProgress} calorieGoal={CALORIE_GOAL} />

        <SectionHeader title="Weekly summary" />
        <WeeklySummaryCard
          weekLabel={mockWeeklySummary.weekLabel}
          daysLogged={mockWeeklySummary.daysLogged}
          totalDays={mockWeeklySummary.totalDays}
          calorieGoalDays={mockWeeklySummary.calorieGoalDays}
          calorieGoalTarget={mockWeeklySummary.calorieGoalTarget}
          macrosHit={mockWeeklySummary.macrosHit}
          streakMaintained={mockWeeklySummary.streakMaintained}
        />

        <SectionHeader title="Badges" />
        <BadgesSection badges={mockBadges} />

        <SectionHeader title="Recipe inspiration" />
        <RecipeCard recipe={mockRecipe} />

        <View
          style={{
            height: 1,
            backgroundColor: colors.cream,
            marginHorizontal: 8,
            marginTop: 2,
          }}
        />
      </View>
    </ScrollView>
  );
}
