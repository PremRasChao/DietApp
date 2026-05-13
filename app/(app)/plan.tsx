import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";

export default function PlanScreen() {
  return (
    <View className="flex-1 bg-bone items-center justify-center">
      <ThemedText variant="heading" color="espresso">Meal Plan</ThemedText>
      <ThemedText variant="body" color="taupe" className="mt-2">Coming soon</ThemedText>
    </View>
  );
}
