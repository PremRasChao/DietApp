import { View, Text } from "react-native";
import { Button } from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/lib/tokens";

const STATS = [
  { num: "450+", label: "clients helped" },
  { num: "25+", label: "GTA locations" },
  { num: "100%", label: "registered RDs" },
];

export function HeroSection() {
  const { isMd } = useBreakpoint();

  return (
    <View
      style={{
        backgroundColor: colors.bone,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative background circles (law-of-proximity: frame the content) */}
      <View
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: isMd ? 420 : 280,
          height: isMd ? 420 : 280,
          borderRadius: isMd ? 210 : 140,
          backgroundColor: colors.cream,
          opacity: 0.65,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: -100,
          width: isMd ? 320 : 200,
          height: isMd ? 320 : 200,
          borderRadius: isMd ? 160 : 100,
          backgroundColor: colors.cream,
          opacity: 0.4,
        }}
      />

      <View
        style={{
          paddingHorizontal: isMd ? 56 : 24,
          paddingTop: isMd ? 100 : 72,
          paddingBottom: isMd ? 88 : 64,
          maxWidth: 920,
          alignSelf: isMd ? "center" : "stretch",
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <View
            style={{
              width: 28,
              height: 2,
              backgroundColor: colors.tan,
              marginRight: 12,
            }}
          />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 11,
              letterSpacing: 2,
              color: colors.taupe,
              textTransform: "uppercase",
            }}
          >
            Registered Dietitians · Greater Toronto Area
          </Text>
        </View>

        {/* Headline — Fraunces at large scale for display drama */}
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: isMd ? 72 : 50,
            color: colors.espresso,
            lineHeight: isMd ? 76 : 54,
          }}
        >
          Real nutrition
        </Text>
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: isMd ? 72 : 50,
            color: colors.espresso,
            lineHeight: isMd ? 76 : 54,
          }}
        >
          guidance,
        </Text>
        {/* Italic + tan for von Restorff contrast */}
        <Text
          style={{
            fontFamily: "Fraunces_700Bold_Italic",
            fontSize: isMd ? 72 : 50,
            color: colors.tan,
            lineHeight: isMd ? 82 : 60,
            marginBottom: 32,
          }}
        >
          rooted in you.
        </Text>

        {/* Subtext */}
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: isMd ? 18 : 16,
            color: colors.taupe,
            lineHeight: isMd ? 30 : 26,
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          Work with Registered Dietitians who understand your culture,
          schedule, and health goals — with insurance-covered sessions across
          the GTA.
        </Text>

        {/* CTAs — Fitts's Law: large tap targets, clear primary/secondary hierarchy */}
        <View
          style={{
            flexDirection: "row",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 60,
          }}
        >
          <Button label="Book an Appointment" variant="primary" size="lg" />
          <Button label="Check my insurance" variant="secondary" size="lg" />
        </View>

        {/* Stats — Fraunces numbers for display weight */}
        <View
          style={{
            flexDirection: "row",
            gap: isMd ? 56 : 32,
            flexWrap: "wrap",
            paddingTop: 24,
            borderTopWidth: 1,
            borderTopColor: colors.cream,
          }}
        >
          {STATS.map(({ num, label }) => (
            <View key={label}>
              <Text
                style={{
                  fontFamily: "Fraunces_700Bold",
                  fontSize: 34,
                  color: colors.espresso,
                  lineHeight: 38,
                }}
              >
                {num}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: colors.taupe,
                  marginTop: 2,
                }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
