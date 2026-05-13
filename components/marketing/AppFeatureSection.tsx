import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const FEATURES = [
  { title: "AI dietitian chat", desc: "Get real-time meal advice between sessions." },
  { title: "Personalised meal plans", desc: "Generated daily based on your goals and preferences." },
  { title: "Food swap explorer", desc: "Find culturally relevant swaps for any ingredient." },
  { title: "Progress tracking", desc: "Sync logs with your dietitian before every session." },
];

export function AppFeatureSection() {
  const { isMd } = useBreakpoint();

  return (
    <View className="py-16 bg-cream">
      <View
        className={`px-6 max-w-screen-xl mx-auto w-full ${isMd ? "flex-row items-center gap-12" : "flex-col"}`}
      >
        {/* Text side */}
        <View className={isMd ? "flex-1" : "mb-10"}>
          <ThemedText variant="heading" color="espresso">
            Your nutrition coach, in your pocket
          </ThemedText>
          <ThemedText variant="body" color="taupe" className="mt-3 mb-6">
            The Nutrition Wize app keeps you connected between sessions with tools that actually fit your life.
          </ThemedText>
          {FEATURES.map((f) => (
            <View key={f.title} className="flex-row items-start gap-3 mb-4">
              <View className="w-2 h-2 rounded-full bg-tan mt-2" />
              <View className="flex-1">
                <ThemedText variant="label" color="espresso">{f.title}</ThemedText>
                <ThemedText variant="caption" color="taupe" className="mt-0.5">{f.desc}</ThemedText>
              </View>
            </View>
          ))}
          <View className="flex-row gap-3 mt-6">
            <Button label="App Store" variant="dark" size="sm" />
            <Button label="Google Play" variant="secondary" size="sm" />
          </View>
        </View>

        {/* Phone mockup */}
        <View className={`items-center ${isMd ? "w-72" : "w-full"}`}>
          <View className="w-56 h-96 rounded-[2.5rem] bg-espresso border-4 border-taupe items-center justify-center">
            <View className="w-48 h-80 bg-bone rounded-[2rem] items-center justify-center">
              <ThemedText variant="caption" color="taupe">App preview</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
