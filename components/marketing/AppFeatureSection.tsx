import { View } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const FEATURES = [
  { title: "Personalized assessments", desc: "Start with your health history, goals, food preferences, and routine." },
  { title: "Body composition insight", desc: "Use BCA testing and reports to build a plan around your baseline." },
  { title: "Education programs", desc: "Learn practical strategies through Nutritionwize Education Programs." },
  { title: "Multilingual support", desc: "Care is available in English, Punjabi, Hindi, Urdu, French, Spanish, and more." },
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
            Practical nutrition support that fits your life
          </ThemedText>
          <ThemedText variant="body" color="taupe" className="mt-3 mb-6">
            Nutritionwize combines one-on-one counselling, education, workshops, and progress tools to help you build sustainable habits.
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
          <View className="flex-row flex-wrap gap-3 mt-6">
            <Button label="App Store" variant="dark" size="sm" />
            <Button label="Google Play" variant="secondary" size="sm" />
            <Button
              label="Client login"
              variant="dark"
              size="sm"
              onPress={() => router.push("/(auth)/patient" as any)}
            />
            <Button
              label="Dietitian login"
              variant="secondary"
              size="sm"
              onPress={() => router.push("/(auth)/dietitian-login" as any)}
            />
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
