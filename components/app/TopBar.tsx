import { View, Text } from "react-native";
import { colors } from "@/lib/tokens";

interface TopBarProps {
  firstName: string;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function TopBar({ firstName }: TopBarProps) {
  const initials = firstName.startsWith("[")
    ? "FN"
    : firstName.slice(0, 2).toUpperCase();

  const date = new Date().toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View
      style={{
        backgroundColor: colors.bone,
        paddingTop: 56,
        paddingBottom: 32,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: colors.taupe,
              letterSpacing: 0.3,
              marginBottom: 10,
            }}
          >
            {date}
          </Text>
          <Text
            style={{
              fontFamily: "Fraunces_700Bold_Italic",
              fontSize: 32,
              color: colors.taupe,
              lineHeight: 36,
            }}
          >
            {getGreeting()},
          </Text>
          <Text
            style={{
              fontFamily: "Fraunces_700Bold",
              fontSize: 32,
              color: colors.espresso,
              lineHeight: 38,
            }}
          >
            {firstName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingTop: 32,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.cream,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 17 }}>🔔</Text>
          </View>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.tan,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 13,
                color: colors.espresso,
                letterSpacing: 0.5,
              }}
            >
              {initials}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
