import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";

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
  return (
    <View className="bg-bone px-4 pt-14 pb-4 flex-row items-center justify-between">
      <View>
        <ThemedText variant="heading" color="espresso">
          {getGreeting()}, {firstName}
        </ThemedText>
        <ThemedText variant="caption" color="taupe">
          {new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
        </ThemedText>
      </View>
      <View className="flex-row items-center gap-3">
        {/* Notification bell */}
        <View className="w-10 h-10 rounded-full bg-cream items-center justify-center">
          <ThemedText variant="caption" color="taupe">🔔</ThemedText>
        </View>
        {/* Avatar */}
        <View className="w-10 h-10 rounded-full bg-tan items-center justify-center">
          <ThemedText variant="label" color="espresso">
            {firstName.startsWith("[") ? "FN" : firstName.slice(0, 2).toUpperCase()}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
