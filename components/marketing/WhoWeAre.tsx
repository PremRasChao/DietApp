import { View, Text } from "react-native";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function WhoWeAre() {
  const { isMd } = useBreakpoint();

  return (
    <View className="bg-cream px-6 py-16">
      <View
        className={`max-w-screen-lg mx-auto w-full ${
          isMd ? "flex-row gap-12 items-center" : "flex-col gap-8"
        }`}
      >
        {/* Photo placeholder */}
        <View
          className={`bg-taupe rounded-2xl items-center justify-center ${
            isMd ? "flex-1 h-80" : "w-full h-56"
          }`}
        >
          <Text className="text-bone text-sm">Team photo</Text>
        </View>

        {/* Text content */}
        <View className={isMd ? "flex-1" : "w-full"}>
          <Text
            className="text-espresso font-bold text-3xl mb-4"
            style={{ fontFamily: "Fraunces_700Bold" }}
          >
            Who We Are
          </Text>
          <Text className="text-espresso text-base leading-relaxed mb-4">
            Nutrition Wize is a team of registered dietitians committed to making
            evidence-based nutrition care accessible to every Canadian. Founded in
            Toronto, we now serve clients across 25+ Greater Toronto Area locations
            with in-person and virtual appointments.
          </Text>
          <Text className="text-espresso text-base leading-relaxed">
            Our practitioners come from diverse cultural backgrounds and speak 15+
            languages — because good nutrition advice should feel familiar, not
            foreign. We accept most major insurance plans and direct-bill on your behalf.
          </Text>
        </View>
      </View>
    </View>
  );
}
