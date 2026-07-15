import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockTestimonials } from "@/lib/mockData";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/lib/tokens";

function TestimonialCard({ t, index }: { t: typeof mockTestimonials[0]; index: number }) {
  const initials = t.attribution.split(",")[0].trim().charAt(0);
  const accentBg = index % 3 === 0 ? colors.espresso : index % 3 === 1 ? colors.tan : colors.taupe;

  return (
    <View
      style={{
        width: 320,
        backgroundColor: colors.cream,
        borderRadius: 22,
        padding: 28,
        marginRight: 20,
        shadowColor: colors.espresso,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 2,
        gap: 20,
      }}
    >
      {/* Large opening quote mark */}
      <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 56, color: `${colors.tan}40`, lineHeight: 40, marginBottom: -8 }}>
        "
      </Text>

      {/* Quote text */}
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: colors.espresso, lineHeight: 24, fontStyle: "italic", flex: 1 }}>
        {t.quote}
      </Text>

      {/* Stars */}
      <View style={{ flexDirection: "row", gap: 3 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Ionicons key={i} name="star" size={14} color={colors.tan} />
        ))}
      </View>

      {/* Author */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: `${colors.espresso}0D` }}>
        <View
          style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: accentBg,
            alignItems: "center", justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.bone }}>
            {initials}
          </Text>
        </View>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.espresso }}>
          {t.attribution}
        </Text>
      </View>
    </View>
  );
}

export function TestimonialsRow() {
  const { isMd } = useBreakpoint();

  return (
    <View style={{ backgroundColor: colors.cream, paddingVertical: isMd ? 88 : 64 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: isMd ? 64 : 24, marginBottom: isMd ? 48 : 36 }}>
        <View
          style={{
            flexDirection: "row", alignItems: "center", gap: 8,
            paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
            backgroundColor: `${colors.tan}1A`, borderWidth: 1, borderColor: `${colors.tan}33`,
            marginBottom: 16, alignSelf: "flex-start",
          }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.tan }} />
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5, color: colors.taupe, textTransform: "uppercase" }}>
            Client stories
          </Text>
        </View>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: isMd ? 42 : 32, color: colors.espresso }}>
          What our clients say
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16, color: colors.taupe, lineHeight: 26, marginTop: 12, maxWidth: 440 }}>
          Thousands of people have benefited from Nutritionwize programs, counselling, and practical meal planning.
        </Text>
      </View>

      {/* Scrollable cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: isMd ? 64 : 24, paddingBottom: 8, paddingTop: 4 }}
      >
        {mockTestimonials.map((t, i) => (
          <TestimonialCard key={t.id} t={t} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}
