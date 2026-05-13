import { View, Text } from "react-native";
import { Button } from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function HeroSection() {
  const { isMd } = useBreakpoint();

  return (
    <View className="bg-bone px-6 py-16 items-center">
      <View className={`w-full max-w-screen-lg ${isMd ? "items-start" : "items-center"}`}>
        <Text
          className={`text-espresso font-bold mb-4 leading-tight ${isMd ? "text-5xl text-left" : "text-4xl text-center"}`}
          style={{ fontFamily: "Fraunces_700Bold" }}
        >
          Real nutrition guidance,{"\n"}rooted in your life
        </Text>

        <Text
          className={`text-taupe text-lg mb-8 max-w-xl leading-relaxed ${isMd ? "text-left" : "text-center"}`}
        >
          Registered Dietitians who understand your culture, schedule, and health goals.
          Insurance-covered sessions across the Greater Toronto Area.
        </Text>

        <View className={`flex-row gap-4 mb-8 ${isMd ? "" : "justify-center"}`}>
          <Button label="Book an Appointment" variant="primary" size="lg" />
          <Button label="Learn More" variant="secondary" size="lg" />
        </View>

        {/* Trust microcopy */}
        <View className={`flex-row items-center gap-2 flex-wrap ${isMd ? "" : "justify-center"}`}>
          {["25+ GTA locations", "Direct insurance billing", "Registered Dietitians"].map(
            (item, i) => (
              <View key={item} className="flex-row items-center gap-2">
                {i > 0 && <View className="w-1 h-1 rounded-full bg-taupe" />}
                <Text className="text-taupe text-sm">{item}</Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );
}
