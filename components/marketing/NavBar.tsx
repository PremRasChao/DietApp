import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = ["About", "Services", "Dietitians", "Blog", "Shop"];

export function NavBar() {
  const { isMd } = useBreakpoint();

  return (
    <View className="bg-bone border-b border-cream z-50">
      <View className="flex-row items-center justify-between px-6 py-4 max-w-screen-xl mx-auto w-full">
        {/* Logo */}
        <View>
          <Text className="text-espresso text-xl font-bold" style={{ fontFamily: "Fraunces_700Bold" }}>
            Nutrition Wize
          </Text>
        </View>

        {/* Desktop nav links */}
        {isMd && (
          <View className="flex-row items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Pressable key={link} className="active:opacity-60">
                <Text className="text-espresso text-sm font-medium">{link}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* CTAs */}
        <View className="flex-row items-center gap-3">
          {isMd && (
            <Button label="Check Insurance" variant="ghost" size="sm" />
          )}
          <Button label="Book Appointment" variant="primary" size="sm" />
          {isMd && (
            <Button label="Download App" variant="secondary" size="sm" />
          )}
        </View>
      </View>
    </View>
  );
}
