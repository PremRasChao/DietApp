/**
 * DashboardPreview — a Nutrium-style "food database" + stats mockup
 * embedded in the marketing page to showcase the app's interface.
 * Purely visual; no interactivity.
 */
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/lib/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const FOOD_ROWS = [
  { name: "Chicken Breast, grilled",   source: "USDA, 2024", kcal: 165, fat: 3.6, carbs: 0,   protein: 31 },
  { name: "Brown Rice, cooked",        source: "USDA, 2024", kcal: 216, fat: 1.8, carbs: 45,  protein: 5 },
  { name: "Greek Yogurt, plain",       source: "USDA, 2024", kcal: 100, fat: 0.7, carbs: 6,   protein: 17 },
  { name: "Peanut Butter, smooth",     source: "USDA, 2024", kcal: 588, fat: 50,  carbs: 20,  protein: 25 },
  { name: "Roti / Chapati, whole wheat", source: "Common",   kcal: 120, fat: 2,   carbs: 22,  protein: 4 },
];

const STAT_CARDS: { icon: IoniconName; label: string; value: string; sub: string; color: string }[] = [
  { icon: "flame-outline",    label: "Calories today",   value: "1,850", sub: "/ 2,000 goal",  color: colors.tan },
  { icon: "barbell-outline",  label: "Protein",          value: "92g",   sub: "/ 150g goal",   color: colors.espresso },
  { icon: "trending-up-outline", label: "Day streak",   value: "12",    sub: "days logging",  color: "#9A8270" },
  { icon: "calendar-outline", label: "Next session",     value: "Fri",   sub: "May 16 · 2:30 PM", color: colors.tan },
];

function StatCard({ icon, label, value, sub, color }: typeof STAT_CARDS[0]) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.cream,
        borderRadius: 18,
        padding: 18,
        gap: 12,
        shadowColor: colors.espresso,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
        minWidth: 130,
      }}
    >
      <View
        style={{
          width: 38, height: 38, borderRadius: 12,
          backgroundColor: `${color}26`,
          alignItems: "center", justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 26, color: colors.espresso, lineHeight: 28 }}>
          {value}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.taupe, marginTop: 2 }}>
          {sub}
        </Text>
      </View>
      <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: colors.taupe, letterSpacing: 0.4, textTransform: "uppercase" }}>
        {label}
      </Text>
    </View>
  );
}

export function DashboardPreview() {
  const { isMd } = useBreakpoint();

  return (
    <View style={{ backgroundColor: colors.bone, paddingVertical: isMd ? 80 : 56, paddingHorizontal: isMd ? 64 : 24 }}>
      <View style={{ maxWidth: 1280, alignSelf: "center", width: "100%" }}>
        {/* Section header */}
        <View style={{ alignItems: "center", marginBottom: isMd ? 56 : 40 }}>
          <View
            style={{
              flexDirection: "row", alignItems: "center", gap: 8,
              paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
              backgroundColor: `${colors.tan}1A`, borderWidth: 1, borderColor: colors.cream,
              marginBottom: 16, alignSelf: "center",
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.tan }} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5, color: colors.taupe, textTransform: "uppercase" }}>
              The Platform
            </Text>
          </View>
          <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: isMd ? 42 : 32, color: colors.espresso, textAlign: "center" }}>
            Your plan, progress, and appointments in one place
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: isMd ? 17 : 15, color: colors.taupe, lineHeight: 26, textAlign: "center", maxWidth: 520, marginTop: 14 }}>
            Use your food log, body composition report, and session notes to stay connected with your Nutritionwize dietitian between visits.
          </Text>
        </View>

        {/* ── Stat cards row ── */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </View>

        {/* ── Food log table card ── */}
        <View
          style={{
            backgroundColor: colors.cream,
            borderRadius: 24,
            overflow: "hidden",
            shadowColor: colors.espresso,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 4,
          }}
        >
          {/* Table header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingVertical: 18,
              borderBottomWidth: 1,
              borderBottomColor: `${colors.espresso}0D`,
            }}
          >
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, color: colors.espresso }}>
              Food databases
            </Text>
            <View
              style={{
                flexDirection: "row", alignItems: "center", gap: 8,
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                backgroundColor: colors.tan,
              }}
            >
              <Ionicons name="add" size={14} color={colors.bone} />
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.bone }}>
                Log food
              </Text>
            </View>
          </View>

          {/* Search bar mock */}
          <View
            style={{
              flexDirection: "row", alignItems: "center", gap: 10,
              paddingHorizontal: 24, paddingVertical: 14,
              borderBottomWidth: 1, borderBottomColor: `${colors.espresso}0D`,
            }}
          >
            <Ionicons name="search-outline" size={16} color={colors.taupe} />
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: `${colors.taupe}80` }}>
              Search food…
            </Text>
          </View>

          {/* Column headers */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 24, paddingVertical: 10,
              backgroundColor: `${colors.espresso}06`,
              borderBottomWidth: 1, borderBottomColor: `${colors.espresso}0D`,
            }}
          >
            <Text style={{ flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.taupe, letterSpacing: 0.8, textTransform: "uppercase" }}>
              Food
            </Text>
            {["Energy", "Fat", "Carbs", "Protein"].map((h) => (
              <Text key={h} style={{ width: isMd ? 88 : 56, fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.taupe, textAlign: "right", letterSpacing: 0.5 }}>
                {h}
              </Text>
            ))}
          </View>

          {/* Food rows */}
          {FOOD_ROWS.map((row, i) => (
            <View
              key={row.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderBottomWidth: i < FOOD_ROWS.length - 1 ? 1 : 0,
                borderBottomColor: `${colors.espresso}0A`,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.espresso }} numberOfLines={1}>
                  {row.name}
                </Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.taupe, marginTop: 2 }}>
                  {row.source}
                </Text>
              </View>
              {[
                { v: row.kcal, u: "kcal" },
                { v: row.fat,  u: "g" },
                { v: row.carbs, u: "g" },
                { v: row.protein, u: "g" },
              ].map(({ v, u }) => (
                <View key={u + v} style={{ width: isMd ? 88 : 56, alignItems: "flex-end" }}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.espresso }}>
                    {v} <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.taupe }}>{u}</Text>
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
