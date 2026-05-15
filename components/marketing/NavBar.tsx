import { View, Text, Pressable } from "react-native";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = ["About", "Services", "Dietitians", "Blog", "Shop"];

export function NavBar() {
  const { isMd } = useBreakpoint();

  return (
    <View className="bg-bone border-b border-cream z-50">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 16,
          maxWidth: 1280,
          alignSelf: "center",
          width: "100%",
        }}
      >
        {/* Logo — flex:1 pushes nav links to true center */}
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: "#2C1F14" }}
          >
            Nutrition Wize
          </Text>
        </View>

        {/* Desktop nav links — centered */}
        {isMd && (
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
            }}
          >
            {NAV_LINKS.map((link) => (
              <Pressable key={link} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 14,
                    color: "#2C1F14",
                  }}
                >
                  {link}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* CTAs — right-aligned */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 10,
          }}
        >
          {isMd && <Button label="Check Insurance" variant="ghost" size="sm" />}
          <Button label="Book" variant="primary" size="sm" />
        </View>
      </View>
    </View>
  );
}
