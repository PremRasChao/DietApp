import { View, Text, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors, macroColors } from "@/lib/tokens";
import { mockMeals, CALORIE_GOAL } from "@/lib/mockData";
import { nutritionwizeLinks } from "@/lib/marketingLinks";

// ── Inline app preview card (right column on desktop) ───────────────────────
function AppPreviewCard() {
  const entries = [
    { name: "Greek Yogurt Parfait", meal: "Breakfast", kcal: 320, p: 18, c: 42, f: 8 },
    { name: "Grilled Chicken & Quinoa", meal: "Lunch",  kcal: 520, p: 45, c: 38, f: 12 },
    { name: "Apple & Almond Butter",   meal: "Snack",  kcal: 180, p: 5,  c: 22, f: 9 },
  ];
  const totalKcal = entries.reduce((s, e) => s + e.kcal, 0);
  const pct = Math.min(totalKcal / CALORIE_GOAL, 1);

  return (
    <View style={{
      backgroundColor: colors.white, borderRadius: 24, padding: 24,
      shadowColor: "#000", shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.14, shadowRadius: 48, elevation: 10,
    }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <View>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.ink }}>Today's log</Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, marginTop: 2 }}>
            {totalKcal.toLocaleString()} / {CALORIE_GOAL.toLocaleString()} kcal
          </Text>
        </View>
        <View style={{
          paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
          backgroundColor: `${colors.sage}1A`,
        }}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.sage }}>
            {Math.round((1 - pct) * 100)}% remaining
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ height: 6, backgroundColor: "#E8E4DC", borderRadius: 3, marginBottom: 18 }}>
        <View style={{ width: `${pct * 100}%`, height: 6, backgroundColor: colors.forest, borderRadius: 3 }} />
      </View>

      {/* Column headers */}
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <Text style={{ flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 10, color: colors.stone, letterSpacing: 0.8, textTransform: "uppercase" }}>FOOD</Text>
        <Text style={{ width: 40, fontFamily: "Inter_600SemiBold", fontSize: 10, color: colors.stone, textAlign: "right", textTransform: "uppercase" }}>KCAL</Text>
        <Text style={{ width: 24, fontFamily: "Inter_700Bold", fontSize: 10, color: macroColors.protein, textAlign: "right" }}>P</Text>
        <Text style={{ width: 24, fontFamily: "Inter_700Bold", fontSize: 10, color: macroColors.carbs, textAlign: "right" }}>C</Text>
        <Text style={{ width: 24, fontFamily: "Inter_700Bold", fontSize: 10, color: macroColors.fat, textAlign: "right" }}>F</Text>
      </View>

      {/* Rows */}
      {entries.map((e, i) => (
        <View key={e.name} style={{
          flexDirection: "row", alignItems: "center",
          paddingVertical: 11,
          borderTopWidth: i > 0 ? 1 : 0,
          borderTopColor: "#F0EDE6",
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.ink }} numberOfLines={1}>
              {e.name}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginTop: 1 }}>{e.meal}</Text>
          </View>
          <Text style={{ width: 40, fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.ink, textAlign: "right" }}>{e.kcal}</Text>
          <Text style={{ width: 24, fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, textAlign: "right" }}>{e.p}</Text>
          <Text style={{ width: 24, fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, textAlign: "right" }}>{e.c}</Text>
          <Text style={{ width: 24, fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, textAlign: "right" }}>{e.f}</Text>
        </View>
      ))}

      {/* Log another */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#F0EDE6" }}>
        <Ionicons name="add-circle-outline" size={16} color={colors.clay} />
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.clay }}>Log another food</Text>
      </View>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
export function HeroSection() {
  const { isMd } = useBreakpoint();

  // Trust avatars (like the screenshots: SC, MR, JL, +)
  const TRUST_AVATARS = [
    { initials: "SC", bg: colors.forest },
    { initials: "MR", bg: colors.clay },
    { initials: "JL", bg: colors.sage },
    { initials: "+", bg: "#C8C2B8" },
  ];

  return (
    <View style={{ backgroundColor: colors.linen, overflow: "hidden" }}>
      <View style={{
        paddingHorizontal: isMd ? 64 : 24,
        paddingTop: isMd ? 88 : 56,
        paddingBottom: isMd ? 80 : 48,
        maxWidth: 1280, alignSelf: "center", width: "100%",
      }}>

        <View style={{ flexDirection: isMd ? "row" : "column", gap: isMd ? 80 : 48, alignItems: isMd ? "center" : "stretch" }}>

          {/* ── Left: copy ── */}
          <View style={{ flex: isMd ? 1 : undefined }}>
            {/* Eyebrow pill */}
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 8,
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              backgroundColor: `${colors.sage}1A`,
              borderWidth: 1, borderColor: `${colors.sage}30`,
              alignSelf: "flex-start", marginBottom: 32,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.clay }} />
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5, color: colors.stone, textTransform: "uppercase" }}>
                Registered Dietitians · 25+ Ontario Locations
              </Text>
            </View>

            {/* Headline */}
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: isMd ? 64 : 46, color: colors.ink, lineHeight: isMd ? 68 : 50, marginBottom: 0 }}>
              Expert diet
            </Text>
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: isMd ? 64 : 46, color: colors.ink, lineHeight: isMd ? 68 : 50 }}>
              therapy for
            </Text>
            <Text style={{ fontFamily: "Fraunces_700Bold_Italic", fontSize: isMd ? 64 : 46, color: colors.clay, lineHeight: isMd ? 78 : 60, marginBottom: 28 }}>
              everyday health.
            </Text>

            {/* Sub */}
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: isMd ? 17 : 15, color: colors.stone, lineHeight: 26, maxWidth: 520, marginBottom: 40 }}>
              Nutritionwize Registered Dietitians and Certified Diabetes Educators help individuals and families make informed, practical, and sustainable nutrition choices.
            </Text>

            {/* CTAs */}
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <Pressable
                onPress={() => Linking.openURL(nutritionwizeLinks.consultation)}
                style={({ pressed }) => ({
                  flexDirection: "row", alignItems: "center", gap: 8,
                  paddingHorizontal: 24, paddingVertical: 15, borderRadius: 14,
                  backgroundColor: colors.forest, opacity: pressed ? 0.85 : 1,
                  shadowColor: colors.forest,
                  shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 16,
                  elevation: 5,
                })}
              >
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 15, color: colors.white }}>Request a free consultation</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.white} />
              </Pressable>
              <Pressable
                onPress={() => Linking.openURL(nutritionwizeLinks.insurance)}
                style={({ pressed }) => ({
                  paddingHorizontal: 24, paddingVertical: 15, borderRadius: 14,
                  borderWidth: 1.5, borderColor: "#D8D3C8", opacity: pressed ? 0.7 : 1,
                  backgroundColor: colors.white,
                })}
              >
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: colors.ink }}>Check insurance coverage</Text>
              </Pressable>
            </View>

            {/* Trust row */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <View style={{ flexDirection: "row" }}>
                {TRUST_AVATARS.map(({ initials, bg }, i) => (
                  <View key={initials} style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: bg,
                    borderWidth: 2, borderColor: colors.linen,
                    marginLeft: i > 0 ? -8 : 0,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Text style={{ fontFamily: "Inter_700Bold", fontSize: 12, color: colors.white }}>{initials}</Text>
                  </View>
                ))}
              </View>
              <View>
                <View style={{ flexDirection: "row", gap: 2, marginBottom: 3 }}>
                  {[1,2,3,4,5].map((i) => (
                    <Text key={i} style={{ fontSize: 12, color: colors.clay }}>★</Text>
                  ))}
                </View>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone }}>
                  <Text style={{ fontFamily: "Inter_700Bold", color: colors.ink }}>20,000+ lives impacted</Text> · 15+ languages spoken · direct billing available
                </Text>
              </View>
            </View>
          </View>

          {/* ── Right: app preview ── */}
          {isMd && (
            <View style={{ flex: 1, maxWidth: 440 }}>
              <AppPreviewCard />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
