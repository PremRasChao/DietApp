import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";

export default function LogScreen() {
  return (
    <View className="flex-1 bg-bone items-center justify-center">
      <ThemedText variant="heading" color="espresso">Food Log</ThemedText>
      <ThemedText variant="body" color="taupe" className="mt-2">Coming soon</ThemedText>
    </View>
  );
}
