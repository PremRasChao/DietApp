import { ScrollView, Text, Pressable } from "react-native";
import { colors } from "@/lib/tokens";

const ACTIONS = [
  { label: "Log food", icon: "🍽", primary: true },
  { label: "Find a swap", icon: "🔄", primary: false },
  { label: "Ask AI", icon: "✨", primary: false },
  { label: "Log weight", icon: "⚖", primary: false },
];

export function QuickActionsRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingVertical: 2 }}
    >
      {ACTIONS.map(({ label, icon, primary }) => (
        <Pressable
          key={label}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 18,
            paddingVertical: 13,
            borderRadius: 50,
            backgroundColor: primary ? colors.espresso : colors.cream,
            borderWidth: primary ? 0 : 1,
            borderColor: "rgba(44,31,20,0.12)",
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={{ fontSize: 17 }}>{icon}</Text>
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 14,
              color: primary ? colors.bone : colors.espresso,
            }}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
