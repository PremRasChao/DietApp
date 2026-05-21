import { ScrollView, Text, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const ACTIONS: { label: string; icon: IoniconName; primary: boolean }[] = [
  { label: "Log food",    icon: "add-circle-outline", primary: true },
  { label: "Find a swap", icon: "swap-horizontal-outline", primary: false },
  { label: "Ask AI",      icon: "sparkles-outline" as IoniconName, primary: false },
  { label: "Log weight",  icon: "scale-outline" as IoniconName,    primary: false },
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
            borderColor: "rgba(44,31,20,0.1)",
            opacity: pressed ? 0.75 : 1,
            shadowColor: colors.espresso,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: primary ? 0.18 : 0.05,
            shadowRadius: 6,
            elevation: primary ? 3 : 1,
          })}
        >
          <Ionicons
            name={icon}
            size={16}
            color={primary ? colors.bone : colors.espresso}
          />
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
