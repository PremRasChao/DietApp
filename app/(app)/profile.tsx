import { ScrollView, View } from "react-native";
import { Bell, ChevronRight, CreditCard, ShieldCheck, User } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";
import { mockAppointment, mockStreak, mockUser } from "@/lib/mockData";

const settings = [
  { label: "Personal details", detail: "Goals, preferences, allergies", Icon: User },
  { label: "Insurance", detail: "Coverage and direct billing", Icon: CreditCard },
  { label: "Notifications", detail: "Meal and appointment reminders", Icon: Bell },
  { label: "Privacy", detail: "Data and consent settings", Icon: ShieldCheck },
];

export default function ProfileScreen() {
  const initials = mockUser.firstName.startsWith("[")
    ? "NW"
    : mockUser.firstName.slice(0, 2).toUpperCase();

  return (
    <ScrollView
      className="flex-1 bg-bone"
      contentContainerStyle={{ padding: 20, paddingTop: 64, paddingBottom: 112 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <ThemedText variant="heading" color="espresso">Profile</ThemedText>
        <ThemedText variant="body" color="taupe" className="mt-1">
          Manage your nutrition preferences and care details.
        </ThemedText>
      </View>

      <Card variant="cream" className="p-5 mb-5">
        <View className="flex-row items-center gap-4">
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.tan }}
          >
            <ThemedText variant="subheading" color="espresso">{initials}</ThemedText>
          </View>
          <View className="flex-1">
            <ThemedText variant="subheading" color="espresso">{mockUser.firstName}</ThemedText>
            <ThemedText variant="caption" color="taupe" className="mt-1">
              Paired with {mockAppointment.dietitianName}
            </ThemedText>
          </View>
        </View>
        <View className="flex-row gap-3 mt-5">
          <View className="flex-1 rounded-2xl p-3 bg-bone">
            <ThemedText variant="label" color="taupe">Streak</ThemedText>
            <ThemedText variant="heading" color="espresso" className="mt-1">
              {mockStreak.count} days
            </ThemedText>
          </View>
          <View className="flex-1 rounded-2xl p-3 bg-bone">
            <ThemedText variant="label" color="taupe">Next visit</ThemedText>
            <ThemedText variant="heading" color="espresso" className="mt-1">
              2:30
            </ThemedText>
          </View>
        </View>
      </Card>

      <View className="gap-3">
        {settings.map(({ label, detail, Icon }) => (
          <Card key={label} variant="default" className="p-4">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.cream }}
              >
                <Icon size={18} color={colors.taupe} strokeWidth={1.8} />
              </View>
              <View className="flex-1">
                <ThemedText variant="caption" color="espresso">{label}</ThemedText>
                <ThemedText variant="label" color="taupe" className="mt-1">{detail}</ThemedText>
              </View>
              <ChevronRight size={18} color={colors.taupe} strokeWidth={1.8} />
            </View>
          </Card>
        ))}
      </View>

      <View className="mt-5">
        <Button label="Edit profile" variant="secondary" fullWidth />
      </View>
    </ScrollView>
  );
}
