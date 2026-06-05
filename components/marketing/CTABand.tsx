import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Glow } from "@/components/ui/Glow";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/lib/tokens";

const TRUST_ITEMS = [
  { icon: "shield-checkmark-outline" as const, label: "Insurance-covered sessions" },
  { icon: "people-outline"            as const, label: "450+ clients helped" },
  { icon: "ribbon-outline"            as const, label: "100% registered RDs" },
];

export function CTABand() {
  const { isMd } = useBreakpoint();

  return (
    <View style={{ backgroundColor: colors.espresso, overflow: "hidden", position: "relative" }}>
      <Glow variant="center" style={{ opacity: 0.25 }} />

      <View
        style={{
          paddingHorizontal: isMd ? 64 : 28,
          paddingVertical: isMd ? 96 : 64,
          maxWidth: 1280,
          alignSelf: "center",
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* Eyebrow */}
        <View
          style={{
            flexDirection: "row", alignItems: "center", gap: 8,
            paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
            borderWidth: 1, borderColor: `${colors.tan}40`,
            backgroundColor: `${colors.tan}15`, marginBottom: 24,
          }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.tan }} />
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5, color: colors.tan, textTransform: "uppercase" }}>
            Get started today
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: isMd ? 52 : 36,
            color: colors.bone,
            textAlign: "center",
            lineHeight: isMd ? 58 : 42,
            maxWidth: 680,
            marginBottom: 20,
          }}
        >
          Ready to transform your{"\n"}relationship with food?
        </Text>

        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: isMd ? 18 : 15,
            color: colors.taupe,
            lineHeight: 28,
            textAlign: "center",
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          Join thousands of Canadians who've hit their health goals with personalised dietitian support — covered by most insurance plans.
        </Text>

        {/* CTAs */}
        <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          <Pressable
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 8,
              paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16,
              backgroundColor: colors.tan, opacity: pressed ? 0.85 : 1,
              shadowColor: colors.tan,
              shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20,
              elevation: 6,
            })}
          >
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.espresso }}>
              Book a consultation
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.espresso} />
          </Pressable>
          <Pressable
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 8,
              paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16,
              borderWidth: 1.5, borderColor: `${colors.bone}30`,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="phone-portrait-outline" size={16} color={colors.bone} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: colors.bone }}>
              Download the app
            </Text>
          </Pressable>
        </View>

        {/* Trust row */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: isMd ? 40 : 20 }}>
          {TRUST_ITEMS.map(({ icon, label }) => (
            <View key={label} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name={icon} size={16} color={colors.tan} />
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: `${colors.bone}B3` }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
