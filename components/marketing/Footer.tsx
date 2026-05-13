import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const COLUMNS = [
  {
    heading: "Product",
    links: ["How it works", "Pricing", "The app", "For clinics"],
  },
  {
    heading: "Company",
    links: ["About us", "Our dietitians", "Careers", "Press"],
  },
  {
    heading: "Resources",
    links: ["Blog", "Insurance guide", "FAQ", "Contact"],
  },
  {
    heading: "Legal",
    links: ["Privacy (PIPEDA)", "Terms of use", "Accessibility"],
  },
];

export function Footer() {
  const { isMd } = useBreakpoint();

  return (
    <View className="bg-espresso pt-16 pb-8 px-6">
      <View className="max-w-screen-xl mx-auto w-full">
        {/* Top: logo + columns */}
        <View className={isMd ? "flex-row gap-12 mb-12" : "flex-col gap-8 mb-10"}>
          {/* Logo + tagline */}
          <View className={isMd ? "w-48" : "w-full"}>
            <ThemedText variant="heading" color="bone">Nutrition Wize</ThemedText>
            <ThemedText variant="caption" color="taupe" className="mt-2">
              Evidence-based nutrition care for the GTA and beyond.
            </ThemedText>
          </View>

          {/* Link columns */}
          <View className={`flex-1 ${isMd ? "flex-row gap-8" : "flex-col gap-6"}`}>
            {COLUMNS.map((col) => (
              <View key={col.heading} className="flex-1">
                <ThemedText variant="label" color="bone" className="mb-3">{col.heading}</ThemedText>
                {col.links.map((link) => (
                  <Pressable key={link} className="mb-2 active:opacity-60">
                    <ThemedText variant="caption" color="taupe">{link}</ThemedText>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-taupe opacity-30 mb-6" />

        {/* Bottom row */}
        <View className={`${isMd ? "flex-row items-center justify-between" : "flex-col gap-4"}`}>
          <ThemedText variant="caption" color="taupe">
            © 2025 Nutrition Wize. All rights reserved.
          </ThemedText>
          <View className="flex-row gap-3">
            {["Tw", "In", "Fb", "Ig"].map((s) => (
              <View key={s} className="w-8 h-8 rounded-full bg-taupe items-center justify-center opacity-60">
                <ThemedText variant="caption" color="bone">{s}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
