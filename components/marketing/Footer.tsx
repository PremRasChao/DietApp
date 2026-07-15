import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const COLUMNS = [
  { heading: "Quick Links", links: ["About Us", "Media", "Services", "Insurance"] },
  { heading: "Services", links: ["RD Consultation Call - FREE", "Initial Nutrition Assessment", "Follow Up Assessment", "BCA Test + Report"] },
  { heading: "Programs", links: ["Nutritionwize Education Programs", "Workshops", "Blog", "Contact Us"] },
  { heading: "Locations", links: ["McVean", "Sandalwood", "Airport", "WMC Shoppers World"] },
];

export function Footer() {
  const { isMd } = useBreakpoint();

  return (
    <View className="bg-bone border-t border-cream pt-16 pb-8 px-6">
      <View className="max-w-screen-xl mx-auto w-full">
        {/* Top: logo + columns */}
        <View className={isMd ? "flex-row gap-12 mb-12" : "flex-col gap-8 mb-10"}>
          <View className={isMd ? "w-48" : "w-full"}>
            <ThemedText variant="heading" color="espresso">Nutritionwize</ThemedText>
            <ThemedText variant="caption" color="taupe" className="mt-2">
              Registered Dietitians and Certified Diabetes Educators helping individuals and families make informed, practical, and sustainable nutrition choices.
            </ThemedText>
            <ThemedText variant="caption" color="taupe" className="mt-3">
              dietclinic@nutritionwize.com · (905) 970-1414
            </ThemedText>
          </View>

          <View className={`flex-1 ${isMd ? "flex-row gap-8" : "flex-col gap-6"}`}>
            {COLUMNS.map((col) => (
              <View key={col.heading} className="flex-1">
                <ThemedText variant="label" color="espresso" className="mb-3">{col.heading}</ThemedText>
                {col.links.map((link) => (
                  <Pressable key={link} className="mb-2 active:opacity-60">
                    <ThemedText variant="caption" color="taupe">{link}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View className="h-px bg-tan opacity-30 mb-6" />

        <View className={isMd ? "flex-row items-center justify-between" : "flex-col gap-4"}>
          <ThemedText variant="caption" color="taupe">
            © 2024 Nutritionwize. All rights reserved.
          </ThemedText>
          <View className="flex-row gap-3">
            {["Tw", "In", "Fb", "Ig"].map((s) => (
              <View key={s} className="w-8 h-8 rounded-full bg-tan items-center justify-center opacity-70">
                <ThemedText variant="caption" color="espresso">{s}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
