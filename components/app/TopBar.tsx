import { View } from "react-native";
import { Bell } from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";

interface TopBarProps {
  firstName: string;
  caloriesRemaining?: number;
  streakDays?: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function TopBar({ firstName, caloriesRemaining, streakDays }: TopBarProps) {
  const initials = firstName.startsWith("[")
    ? "NW"
    : firstName.slice(0, 2).toUpperCase();

  return (
    <View
      style={{
        backgroundColor: "#F8EDE8",
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Decorative background circles */}
      <View
        style={{
          position: "absolute",
          top: -24,
          right: -36,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: "rgba(226, 195, 184, 0.38)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -40,
          right: 80,
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: "rgba(138, 174, 133, 0.18)",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 30,
          left: -20,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "rgba(196, 160, 122, 0.12)",
        }}
      />

      {/* Greeting + date */}
      <View style={{ flex: 1, marginRight: 12 }}>
        <ThemedText variant="heading" color="espresso">
          {getGreeting()},{"\n"}{firstName}
        </ThemedText>
        <ThemedText variant="caption" color="taupe" className="mt-0.5">
          {new Date().toLocaleDateString("en-CA", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </ThemedText>

        {/* Quick stats row */}
        {(caloriesRemaining !== undefined || streakDays !== undefined) && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
            {streakDays !== undefined && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "rgba(196, 160, 122, 0.18)",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                }}
              >
                <ThemedText variant="label" color="tan">Day {streakDays}</ThemedText>
              </View>
            )}
            {caloriesRemaining !== undefined && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "rgba(138, 174, 133, 0.18)",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                }}
              >
                <ThemedText variant="label" color="sage">{caloriesRemaining} kcal left</ThemedText>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Notification + Avatar */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(237, 229, 216, 0.8)",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.espresso,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.07,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Bell size={18} color={colors.taupe} strokeWidth={1.75} />
        </View>

        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: colors.tan,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.espresso,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <ThemedText variant="label" color="espresso">{initials}</ThemedText>
        </View>
      </View>
    </View>
  );
}
