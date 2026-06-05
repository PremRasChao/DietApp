import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockServices } from "@/lib/mockData";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/lib/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const SERVICE_ICONS: Record<string, IoniconName> = {
  weight:         "scale-outline",
  diabetes:       "medical-outline",
  pediatric:      "happy-outline",
  "eating-disorder": "heart-outline",
  cultural:       "globe-outline",
};

function ServiceCard({ service, index }: { service: typeof mockServices[0]; index: number }) {
  const icon = SERVICE_ICONS[service.id] ?? "star-outline";
  const accent = index % 2 === 0 ? colors.tan : colors.espresso;

  return (
    <View
      style={{
        backgroundColor: colors.cream,
        borderRadius: 22,
        padding: 28,
        shadowColor: colors.espresso,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 2,
        gap: 16,
      }}
    >
      {/* Icon container */}
      <View
        style={{
          width: 52, height: 52, borderRadius: 16,
          backgroundColor: `${accent}26`,
          alignItems: "center", justifyContent: "center",
          alignSelf: "flex-start",
        }}
      >
        <Ionicons name={icon} size={24} color={accent} />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, color: colors.espresso }}>
          {service.title}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.taupe, lineHeight: 22 }}>
          {service.description}
        </Text>
      </View>

      {/* Link */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: accent }}>
          Learn more
        </Text>
        <Ionicons name="arrow-forward" size={13} color={accent} />
      </View>
    </View>
  );
}

export function ServicesGrid() {
  const { isMd } = useBreakpoint();

  return (
    <View style={{ backgroundColor: colors.bone, paddingVertical: isMd ? 88 : 64, paddingHorizontal: isMd ? 64 : 24 }}>
      <View style={{ maxWidth: 1280, alignSelf: "center", width: "100%" }}>
        {/* Header */}
        <View style={{ marginBottom: isMd ? 56 : 40 }}>
          <View
            style={{
              flexDirection: "row", alignItems: "center", gap: 8,
              paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
              backgroundColor: `${colors.tan}1A`, borderWidth: 1, borderColor: colors.cream,
              marginBottom: 16, alignSelf: "flex-start",
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.tan }} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5, color: colors.taupe, textTransform: "uppercase" }}>
              Our Services
            </Text>
          </View>
          <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: isMd ? 42 : 32, color: colors.espresso }}>
            Specialised care for{"\n"}every nutrition goal
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16, color: colors.taupe, lineHeight: 26, marginTop: 12, maxWidth: 480 }}>
            Our Registered Dietitians cover the full spectrum of nutrition needs — from weight management to eating disorder support.
          </Text>
        </View>

        {/* Grid */}
        <View
          style={{
            flexDirection: isMd ? "row" : "column",
            flexWrap: isMd ? "wrap" : undefined,
            gap: 20,
          }}
        >
          {mockServices.map((service, i) => (
            <View key={service.id} style={isMd ? { width: "calc(33.33% - 14px)" as any, flexBasis: "30%", flexGrow: 1 } : {}}>
              <ServiceCard service={service} index={i} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
