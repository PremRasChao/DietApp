import { View, Text, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Glow } from "@/components/ui/Glow";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/lib/tokens";
import { nutritionwizeLinks } from "@/lib/marketingLinks";

const TRUST_ITEMS = [
  { icon: "shield-checkmark-outline" as const, label: "Direct billing available" },
  { icon: "people-outline"            as const, label: "20,000+ lives impacted" },
  { icon: "ribbon-outline"            as const, label: "Registered Dietitians" },
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
          Book a consultation with{"\n"}our experts now
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
          Request a free consultation and start building a practical, sustainable plan with Nutritionwize's dietitian team.
        </Text>

        {/* CTAs */}
        <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          <Pressable
            onPress={() => Linking.openURL(nutritionwizeLinks.consultation)}
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
            onPress={() => Linking.openURL(nutritionwizeLinks.phone)}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 8,
              paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16,
              borderWidth: 1.5, borderColor: `${colors.bone}30`,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="phone-portrait-outline" size={16} color={colors.bone} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: colors.bone }}>
              Call (905) 970-1414
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
