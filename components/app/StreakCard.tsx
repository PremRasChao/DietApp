import { View, Text } from "react-native";
import { MotiView } from "moti";
import { colors } from "@/lib/tokens";

interface StreakCardProps {
  days: number;
  nextMilestone: number;
}

export function StreakCard({ days, nextMilestone }: StreakCardProps) {
  const progress = Math.min(days / nextMilestone, 1);
  const remaining = nextMilestone - days;

  return (
    <View
      style={{
        backgroundColor: colors.cream,
        borderRadius: 24,
        padding: 22,
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
      }}
    >
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: 1.14 }}
        transition={{ type: "timing", duration: 900, loop: true, repeatReverse: true }}
      >
        <Text style={{ fontSize: 42 }}>🔥</Text>
      </MotiView>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
          <Text
            style={{
              fontFamily: "Fraunces_700Bold",
              fontSize: 38,
              color: colors.espresso,
              lineHeight: 42,
            }}
          >
            {days}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
              color: colors.espresso,
            }}
          >
            day streak
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: colors.taupe,
            marginTop: 3,
          }}
        >
          {remaining} more day{remaining !== 1 ? "s" : ""} to your {nextMilestone}-day milestone
        </Text>

        <View
          style={{
            marginTop: 12,
            height: 4,
            backgroundColor: "rgba(44,31,20,0.12)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: 4,
              backgroundColor: colors.tan,
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    </View>
  );
}
