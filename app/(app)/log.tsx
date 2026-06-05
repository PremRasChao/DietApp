import {
  View, Text, TextInput, ScrollView, Pressable,
  ActivityIndicator, Modal,
} from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, macroColors } from "@/lib/tokens";
import { searchFood, FoodResult } from "@/lib/food/openFoodFacts";
import { searchLocal } from "@/lib/food/commonFoods";
import { logFood, getTodayLogs, deleteLog, FoodLogEntry } from "@/lib/food/foodLog";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const MEAL_TYPES = ["breakfast", "lunch", "snack", "dinner"] as const;
const MEAL_ORDER = ["breakfast", "lunch", "snack", "dinner"];

// ── 4-macro stat cards (top of log screen) ───────────────────────────────────
const MACRO_DEFS: { key: "kcal"|"protein"|"carbs"|"fat"; icon: IoniconName; label: string; unit: string; goal: number; barColor: string; iconBg: string; iconColor: string }[] = [
  { key: "kcal",    icon: "flash-outline",   label: "Energy",  unit: "kcal", goal: 2000, barColor: colors.clay,    iconBg: `${colors.clay}1A`,   iconColor: colors.clay },
  { key: "protein", icon: "barbell-outline", label: "Protein", unit: "g",    goal: 120,  barColor: macroColors.protein, iconBg: `${colors.sage}1A`, iconColor: colors.sage },
  { key: "carbs",   icon: "layers-outline",  label: "Carbs",   unit: "g",    goal: 220,  barColor: macroColors.carbs,   iconBg: `${colors.sage}1A`, iconColor: colors.sage },
  { key: "fat",     icon: "water-outline",   label: "Fat",     unit: "g",    goal: 65,   barColor: macroColors.fat,     iconBg: `${colors.clay}1A`, iconColor: colors.clay },
];

function MacroCard({ def, value }: { def: typeof MACRO_DEFS[0]; value: number }) {
  const pct = Math.min(value / def.goal, 1);
  return (
    <View style={{
      flex: 1, minWidth: 140,
      backgroundColor: colors.white,
      borderRadius: 18, padding: 16,
      shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <View style={{
          width: 36, height: 36, borderRadius: 10,
          backgroundColor: def.iconBg,
          alignItems: "center", justifyContent: "center",
        }}>
          <Ionicons name={def.icon} size={18} color={def.iconColor} />
        </View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.stone }}>{def.label}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3, marginBottom: 3 }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 26, color: colors.ink, lineHeight: 28 }}>
          {Math.round(value).toLocaleString()}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone }}>{def.unit}</Text>
      </View>
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, marginBottom: 10 }}>
        of {def.goal.toLocaleString()} {def.unit === "kcal" ? "goal" : `${def.unit} goal`}
      </Text>
      <View style={{ height: 4, backgroundColor: "#E8E4DC", borderRadius: 2 }}>
        <View style={{ width: `${pct * 100}%`, height: 4, backgroundColor: def.barColor, borderRadius: 2 }} />
      </View>
    </View>
  );
}

// ── Food search result row ────────────────────────────────────────────────────
function FoodResultRow({ item, onPress }: { item: FoodResult; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 20, paddingVertical: 14,
        backgroundColor: pressed ? `${colors.forest}06` : "transparent",
        borderBottomWidth: 1, borderBottomColor: "#F0EDE6",
      })}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.ink }} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, marginTop: 2 }}>
          {item.brand ?? "USDA, 2024"} · per 100 g
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.ink }}>
          {item.kcalPer100g} <Text style={{ fontFamily: "Inter_400Regular", color: colors.stone, fontSize: 12 }}>kcal</Text>
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginTop: 2 }}>
          P {item.proteinPer100g}g · C {item.carbsPer100g}g · F {item.fatPer100g}g
        </Text>
      </View>
    </Pressable>
  );
}

// ────────────────────────────────────────────────────────────────────────────
export default function LogScreen() {
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [todayLogs, setTodayLogs] = useState<FoodLogEntry[]>([]);
  const [selected, setSelected]   = useState<FoodResult | null>(null);
  const [servingG, setServingG]   = useState("100");
  const [mealType, setMealType]   = useState<string>("snack");
  const [logging, setLogging]     = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTodayLogs = useCallback(async () => {
    try { setTodayLogs(await getTodayLogs()); } catch {}
  }, []);

  useEffect(() => { loadTodayLogs(); }, [loadTodayLogs]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    setResults(searchLocal(query));
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const api = await searchFood(query);
        const ids = new Set(api.map((r) => r.id));
        setResults([...api, ...searchLocal(query).filter((r) => !ids.has(r.id))]);
      } catch {} finally { setSearching(false); }
    }, 350);
  }, [query]);

  const serving = Math.max(1, Number(servingG) || 100);
  const ratio = serving / 100;
  const scaledKcal    = selected ? Math.round(selected.kcalPer100g    * ratio) : 0;
  const scaledProtein = selected ? Math.round(selected.proteinPer100g * ratio * 10) / 10 : 0;
  const scaledCarbs   = selected ? Math.round(selected.carbsPer100g   * ratio * 10) / 10 : 0;
  const scaledFat     = selected ? Math.round(selected.fatPer100g     * ratio * 10) / 10 : 0;

  async function handleLog() {
    if (!selected) return;
    setLogging(true);
    try {
      await logFood({
        food_name: selected.name, brand: selected.brand,
        kcal: scaledKcal, protein_g: scaledProtein,
        carbs_g: scaledCarbs, fat_g: scaledFat,
        serving_g: serving, meal_type: mealType,
      });
      setSelected(null); setQuery(""); setResults([]);
      await loadTodayLogs();
    } catch (e) { console.error(e); } finally { setLogging(false); }
  }

  const totalKcal    = todayLogs.reduce((s, e) => s + e.kcal, 0);
  const totalProtein = Math.round(todayLogs.reduce((s, e) => s + e.protein_g, 0) * 10) / 10;
  const totalCarbs   = Math.round(todayLogs.reduce((s, e) => s + e.carbs_g, 0) * 10) / 10;
  const totalFat     = Math.round(todayLogs.reduce((s, e) => s + e.fat_g, 0) * 10) / 10;

  // Group logs by meal type
  const grouped = todayLogs.reduce<Record<string, FoodLogEntry[]>>((acc, e) => {
    const m = e.meal_type ?? "other";
    if (!acc[m]) acc[m] = [];
    acc[m].push(e);
    return acc;
  }, {});
  const orderedMeals = [...MEAL_ORDER, "other"].filter((m) => grouped[m]?.length);
  const totalMeals   = orderedMeals.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.linen }}>

      {/* ── Header ── */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 36, color: colors.ink }}>Food log</Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone, marginTop: 4 }}>
          {new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
        </Text>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── 4 macro cards (horizontal scroll on narrow screens) ── */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 4 }}
          style={{ marginBottom: 20 }}
        >
          <MacroCard def={MACRO_DEFS[0]} value={totalKcal} />
          <MacroCard def={MACRO_DEFS[1]} value={totalProtein} />
          <MacroCard def={MACRO_DEFS[2]} value={totalCarbs} />
          <MacroCard def={MACRO_DEFS[3]} value={totalFat} />
        </ScrollView>

        {/* ── Search bar ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 10,
            backgroundColor: colors.white, borderRadius: 16,
            paddingHorizontal: 16, height: 54,
            shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
          }}>
            <Ionicons name="search-outline" size={18} color={colors.stone} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search food to log…"
              placeholderTextColor={`${colors.stone}80`}
              style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: colors.ink }}
            />
            {searching && <ActivityIndicator size="small" color={colors.sage} />}
            {query.length > 0 && !searching && (
              <Pressable onPress={() => { setQuery(""); setResults([]); }}>
                <Ionicons name="close-circle" size={20} color={colors.stone} />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Search results ── */}
        {results.length > 0 && (
          <View style={{
            marginHorizontal: 20, marginBottom: 24,
            backgroundColor: colors.white, borderRadius: 18, overflow: "hidden",
            shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
          }}>
            {results.slice(0, 10).map((item) => (
              <FoodResultRow
                key={item.id} item={item}
                onPress={() => { setSelected(item); setServingG(String(item.servingG)); }}
              />
            ))}
          </View>
        )}

        {/* ── Today's intake — meal-grouped table ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <View style={{
            backgroundColor: colors.white, borderRadius: 20, overflow: "hidden",
            shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
          }}>
            {/* Table header */}
            <View style={{
              flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14,
            }}>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 17, color: colors.ink }}>Today's intake</Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone }}>
                {todayLogs.length} item{todayLogs.length !== 1 ? "s" : ""} · {totalMeals} meal{totalMeals !== 1 ? "s" : ""}
              </Text>
            </View>

            {/* Column headers */}
            <View style={{
              flexDirection: "row", paddingHorizontal: 20, paddingBottom: 10,
              borderBottomWidth: 1, borderBottomColor: "#F0EDE6",
            }}>
              <Text style={{ flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.stone, letterSpacing: 0.8, textTransform: "uppercase" }}>
                FOOD
              </Text>
              <Text style={{ width: 46, fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.stone, textAlign: "right", textTransform: "uppercase" }}>KCAL</Text>
              <Text style={{ width: 28, fontFamily: "Inter_700Bold", fontSize: 11, color: macroColors.protein, textAlign: "right" }}>P</Text>
              <Text style={{ width: 28, fontFamily: "Inter_700Bold", fontSize: 11, color: macroColors.carbs, textAlign: "right" }}>C</Text>
              <Text style={{ width: 28, fontFamily: "Inter_700Bold", fontSize: 11, color: macroColors.fat, textAlign: "right" }}>F</Text>
              <View style={{ width: 28 }} />
            </View>

            {todayLogs.length === 0 ? (
              <View style={{ paddingVertical: 48, alignItems: "center", gap: 10 }}>
                <Ionicons name="restaurant-outline" size={40} color={`${colors.stone}40`} />
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone }}>Nothing logged yet</Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: `${colors.stone}80` }}>Search above to add your first meal</Text>
              </View>
            ) : (
              orderedMeals.map((meal) => (
                <View key={meal}>
                  {/* Meal group header */}
                  <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                    paddingHorizontal: 20, paddingVertical: 12,
                    backgroundColor: "#F8F5F0",
                    borderBottomWidth: 1, borderBottomColor: "#F0EDE6",
                  }}>
                    <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.ink, textTransform: "capitalize" }}>
                      {meal}
                    </Text>
                    <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone }}>
                      {grouped[meal].reduce((s, e) => s + e.kcal, 0)} kcal
                    </Text>
                  </View>

                  {/* Food rows in this meal */}
                  {grouped[meal].map((entry) => (
                    <View key={entry.id} style={{
                      flexDirection: "row", alignItems: "center",
                      paddingHorizontal: 20, paddingVertical: 14,
                      borderBottomWidth: 1, borderBottomColor: "#F0EDE6",
                    }}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.ink }} numberOfLines={1}>
                          {entry.food_name}
                        </Text>
                        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, marginTop: 2 }}>
                          {entry.serving_g}g
                        </Text>
                      </View>
                      <Text style={{ width: 46, fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.ink, textAlign: "right" }}>
                        {entry.kcal}
                      </Text>
                      <Text style={{ width: 28, fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone, textAlign: "right" }}>
                        {Math.round(entry.protein_g)}
                      </Text>
                      <Text style={{ width: 28, fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone, textAlign: "right" }}>
                        {Math.round(entry.carbs_g)}
                      </Text>
                      <Text style={{ width: 28, fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone, textAlign: "right" }}>
                        {Math.round(entry.fat_g)}
                      </Text>
                      <Pressable onPress={async () => { await deleteLog(entry.id); loadTodayLogs(); }} style={{ width: 28, alignItems: "center" }}>
                        <Ionicons name="trash-outline" size={14} color={`${colors.stone}80`} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ))
            )}

            {/* Log another food */}
            {todayLogs.length > 0 && (
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => ({
                  flexDirection: "row", alignItems: "center", gap: 8,
                  paddingHorizontal: 20, paddingVertical: 16,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons name="add-circle-outline" size={18} color={colors.clay} />
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.clay }}>
                  Log another food
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── Log modal ── */}
      <Modal visible={!!selected} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(28,25,23,0.5)" }} onPress={() => setSelected(null)} />
        {selected && (
          <View style={{
            backgroundColor: colors.linen, borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: 28, paddingBottom: 52,
            position: "absolute", bottom: 0, left: 0, right: 0,
          }}>
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 22, color: colors.ink, marginBottom: 4 }} numberOfLines={2}>
              {selected.name}
            </Text>
            {selected.brand && (
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone, marginBottom: 20 }}>
                {selected.brand}
              </Text>
            )}

            {/* Scaled macros */}
            <View style={{
              flexDirection: "row", backgroundColor: colors.white,
              borderRadius: 16, padding: 16, marginBottom: 24, justifyContent: "space-around",
            }}>
              {[
                { v: scaledKcal,    u: "kcal", label: "Energy",  color: colors.clay },
                { v: scaledProtein, u: "g",    label: "Protein", color: macroColors.protein },
                { v: scaledCarbs,   u: "g",    label: "Carbs",   color: macroColors.carbs },
                { v: scaledFat,     u: "g",    label: "Fat",     color: macroColors.fat },
              ].map(({ v, u, label, color }) => (
                <View key={label} style={{ alignItems: "center", gap: 3 }}>
                  <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 22, color: colors.ink }}>{v}</Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone }}>{u}</Text>
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color }}>  {label}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.stone, marginBottom: 8 }}>Serving size (g)</Text>
            <TextInput
              value={servingG} onChangeText={setServingG} keyboardType="numeric"
              style={{
                backgroundColor: colors.white, borderRadius: 14,
                paddingHorizontal: 16, paddingVertical: 14,
                fontFamily: "Inter_400Regular", fontSize: 16, color: colors.ink, marginBottom: 20,
              }}
            />

            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.stone, marginBottom: 10 }}>Meal</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 28 }}>
              {MEAL_TYPES.map((m) => (
                <Pressable
                  key={m} onPress={() => setMealType(m)}
                  style={{
                    flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: "center",
                    backgroundColor: mealType === m ? colors.forest : colors.white,
                    borderWidth: mealType === m ? 0 : 1, borderColor: "#E0DBD2",
                  }}
                >
                  <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: mealType === m ? colors.white : colors.stone, textTransform: "capitalize" }}>
                    {m}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleLog} disabled={logging}
              style={({ pressed }) => ({
                backgroundColor: colors.forest, borderRadius: 16, paddingVertical: 17,
                alignItems: "center", opacity: pressed || logging ? 0.75 : 1,
                flexDirection: "row", justifyContent: "center", gap: 8,
              })}
            >
              {logging ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.white }}>Log {scaledKcal} kcal</Text>
                  <Ionicons name="checkmark" size={18} color={colors.white} />
                </>
              )}
            </Pressable>
          </View>
        )}
      </Modal>
    </View>
  );
}
