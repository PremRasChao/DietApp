import {
  View, Text, TextInput, ScrollView, Pressable,
  ActivityIndicator, Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { appColors, appMacroColors, appGradient } from "@/lib/tokens";
import { searchFood, FoodResult } from "@/lib/food/openFoodFacts";
import { searchLocal } from "@/lib/food/commonFoods";
import { logFood, getTodayLogs, deleteLog, FoodLogEntry } from "@/lib/food/foodLog";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const MEAL_TYPES = ["breakfast", "lunch", "snack", "dinner"] as const;
const MEAL_ORDER = ["breakfast", "lunch", "snack", "dinner"];

// ── 4-macro stat cards (top of log screen) ───────────────────────────────────
const MACRO_DEFS: { key: "kcal"|"protein"|"carbs"|"fat"; icon: IoniconName; label: string; unit: string; goal: number; barColor: string }[] = [
  { key: "kcal",    icon: "flash-outline",   label: "Energy",  unit: "kcal", goal: 2000, barColor: appColors.carb },
  { key: "protein", icon: "barbell-outline", label: "Protein", unit: "g",    goal: 120,  barColor: appMacroColors.protein },
  { key: "carbs",   icon: "layers-outline",  label: "Carbs",   unit: "g",    goal: 220,  barColor: appMacroColors.carbs },
  { key: "fat",     icon: "water-outline",   label: "Fat",     unit: "g",    goal: 65,   barColor: appMacroColors.fat },
];

function MacroCard({ def, value }: { def: typeof MACRO_DEFS[0]; value: number }) {
  const pct = Math.min(value / def.goal, 1);
  return (
    <View style={{ minWidth: 128, backgroundColor: appColors.inkRaised, borderRadius: 14, padding: 13 }}>
      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: appColors.onInkSoft, marginBottom: 6 }}>
        {def.label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3, marginBottom: 8 }}>
        <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 18, color: appColors.onInk }}>
          {Math.round(value).toLocaleString()}
        </Text>
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.onInkSoft }}>
          / {def.goal.toLocaleString()}{def.unit === "g" ? "g" : ""}
        </Text>
      </View>
      <View style={{ height: 4, backgroundColor: "#3A3D30", borderRadius: 2 }}>
        <View style={{ width: `${pct * 100}%`, height: 4, backgroundColor: def.barColor, borderRadius: 2 }} />
      </View>
    </View>
  );
}

// ── Food search result row ────────────────────────────────────────────────────
function FoodResultRow({ item, onPress }: { item: FoodResult; onPress: () => void }) {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 13,
        borderBottomWidth: 0.5, borderBottomColor: appColors.divider,
      }}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.text }} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.textSoft, marginTop: 2 }}>
          {item.brand ?? "USDA, 2024"} · per 100 g
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.text }}>
          {item.kcalPer100g} <Text style={{ fontFamily: "PublicSans_400Regular", color: appColors.textSoft, fontSize: 11 }}>kcal</Text>
        </Text>
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: appColors.textSoft, marginTop: 2 }}>
          P {item.proteinPer100g}g · C {item.carbsPer100g}g · F {item.fatPer100g}g
        </Text>
      </View>
    </AnimatedPressable>
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
  const totalMeals   = new Set(todayLogs.map((e) => e.meal_type ?? "other")).size;

  // Group logs by meal type
  const grouped = todayLogs.reduce<Record<string, FoodLogEntry[]>>((acc, e) => {
    const m = e.meal_type ?? "other";
    if (!acc[m]) acc[m] = [];
    acc[m].push(e);
    return acc;
  }, {});
  const orderedMeals = [...MEAL_ORDER, "other"].filter((m) => grouped[m]?.length);

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>

      {/* ── Header ── */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 18 }}>
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.onInkSoft }}>
          {new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
        </Text>
        <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 28, color: appColors.onInk, marginTop: 2 }}>
          Food log
        </Text>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── 4 macro cards (horizontal scroll) ── */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 4 }}
          style={{ marginBottom: 18 }}
        >
          <MacroCard def={MACRO_DEFS[0]} value={totalKcal} />
          <MacroCard def={MACRO_DEFS[1]} value={todayLogs.reduce((s, e) => s + e.protein_g, 0)} />
          <MacroCard def={MACRO_DEFS[2]} value={todayLogs.reduce((s, e) => s + e.carbs_g, 0)} />
          <MacroCard def={MACRO_DEFS[3]} value={todayLogs.reduce((s, e) => s + e.fat_g, 0)} />
        </ScrollView>

        {/* ── Search bar ── */}
        <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 10,
            backgroundColor: appColors.inkRaised, borderRadius: 14,
            paddingHorizontal: 14, height: 48,
          }}>
            <Ionicons name="search-outline" size={16} color={appColors.onInkSoft} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search food to log…"
              placeholderTextColor={appColors.onInkSoft}
              style={{ flex: 1, fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.onInk }}
            />
            {searching && <ActivityIndicator size="small" color={appColors.fat} />}
            {query.length > 0 && !searching && (
              <AnimatedPressable onPress={() => { setQuery(""); setResults([]); }}>
                <Ionicons name="close-circle" size={18} color={appColors.onInkSoft} />
              </AnimatedPressable>
            )}
          </View>
        </View>

        {/* ── Search results ── */}
        {results.length > 0 && (
          <View style={{
            marginHorizontal: 20, marginBottom: 22,
            backgroundColor: appColors.paper, borderRadius: 16, overflow: "hidden",
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
          <View style={{ backgroundColor: appColors.paper, borderRadius: 16, overflow: "hidden" }}>
            {/* Table header */}
            <View style={{
              flexDirection: "row", alignItems: "center", justifyContent: "space-between",
              paddingHorizontal: 16, paddingTop: 15, paddingBottom: 9,
              borderBottomWidth: 1, borderStyle: "dashed", borderBottomColor: appColors.border,
            }}>
              <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.text }}>
                Today's intake
              </Text>
            </View>

            {todayLogs.length === 0 ? (
              <View style={{ paddingVertical: 44, alignItems: "center", gap: 10 }}>
                <Ionicons name="restaurant-outline" size={36} color={`${appColors.textSoft}80`} />
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.textSoft }}>Nothing logged yet</Text>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: `${appColors.textSoft}A0` }}>Search above to add your first meal</Text>
              </View>
            ) : (
              orderedMeals.map((meal) => (
                grouped[meal].map((entry) => (
                  <View key={entry.id} style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                    paddingHorizontal: 16, paddingVertical: 11,
                    borderBottomWidth: 0.5, borderBottomColor: appColors.divider,
                  }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.text }} numberOfLines={1}>
                        {entry.food_name}
                      </Text>
                      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: "#8A8874", marginTop: 1, textTransform: "capitalize" }}>
                        {meal} · {entry.serving_g}g
                      </Text>
                    </View>
                    <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text, marginRight: 10 }}>
                      {entry.kcal} kcal
                    </Text>
                    <AnimatedPressable onPress={async () => { await deleteLog(entry.id); loadTodayLogs(); }} style={{ padding: 4 }}>
                      <Ionicons name="trash-outline" size={14} color={`${appColors.textSoft}A0`} />
                    </AnimatedPressable>
                  </View>
                ))
              ))
            )}

            {todayLogs.length > 0 && (
              <View style={{
                padding: 14, backgroundColor: appColors.paperDim,
                flexDirection: "row", justifyContent: "space-between",
                borderTopWidth: 1, borderStyle: "dashed", borderTopColor: appColors.border,
              }}>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.textSoft }}>
                  {todayLogs.length} item{todayLogs.length !== 1 ? "s" : ""} logged · {totalMeals} meal{totalMeals !== 1 ? "s" : ""}
                </Text>
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text }}>
                  {totalKcal} kcal
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── Log modal ── */}
      <Modal visible={!!selected} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setSelected(null)} />
        {selected && (
          <LinearGradient colors={appGradient.shell} style={{
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: 28, paddingBottom: 52,
            position: "absolute", bottom: 0, left: 0, right: 0,
          }}>
            <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 20, color: appColors.onInk, marginBottom: 4 }} numberOfLines={2}>
              {selected.name}
            </Text>
            {selected.brand && (
              <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.onInkSoft, marginBottom: 20 }}>
                {selected.brand}
              </Text>
            )}

            {/* Scaled macros */}
            <View style={{
              flexDirection: "row", backgroundColor: appColors.paper,
              borderRadius: 16, padding: 16, marginBottom: 24, justifyContent: "space-around",
            }}>
              {[
                { v: scaledKcal,    u: "kcal", label: "Energy",  color: appColors.carb },
                { v: scaledProtein, u: "g",    label: "Protein", color: appMacroColors.protein },
                { v: scaledCarbs,   u: "g",    label: "Carbs",   color: appMacroColors.carbs },
                { v: scaledFat,     u: "g",    label: "Fat",     color: appMacroColors.fat },
              ].map(({ v, u, label, color }) => (
                <View key={label} style={{ alignItems: "center", gap: 3 }}>
                  <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 20, color: appColors.text }}>{v}</Text>
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.textSoft }}>{u}</Text>
                  <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 10, color }}>{label}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.onInkSoft, marginBottom: 8 }}>Serving size (g)</Text>
            <TextInput
              value={servingG} onChangeText={setServingG} keyboardType="numeric"
              style={{
                backgroundColor: appColors.paper, borderRadius: 14,
                paddingHorizontal: 16, paddingVertical: 14,
                fontFamily: "PublicSans_400Regular", fontSize: 15, color: appColors.text, marginBottom: 20,
              }}
            />

            <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.onInkSoft, marginBottom: 10 }}>Meal</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 28 }}>
              {MEAL_TYPES.map((m) => (
                <AnimatedPressable
                  key={m} onPress={() => setMealType(m)}
                  style={{
                    flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center",
                    backgroundColor: mealType === m ? appColors.fat : appColors.inkRaised,
                  }}
                >
                  <Text style={{
                    fontFamily: "PublicSans_600SemiBold", fontSize: 11, textTransform: "capitalize",
                    color: mealType === m ? appColors.inkText : appColors.onInkSoft,
                  }}>
                    {m}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>

            <AnimatedPressable
              onPress={handleLog} disabled={logging}
              style={{
                backgroundColor: appColors.fat, borderRadius: 16, paddingVertical: 16,
                alignItems: "center", opacity: logging ? 0.75 : 1,
                flexDirection: "row", justifyContent: "center", gap: 8,
              }}
            >
              {logging ? (
                <ActivityIndicator color={appColors.inkText} />
              ) : (
                <>
                  <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 15, color: appColors.inkText }}>Log {scaledKcal} kcal</Text>
                  <Ionicons name="checkmark" size={17} color={appColors.inkText} />
                </>
              )}
            </AnimatedPressable>
          </LinearGradient>
        )}
      </Modal>
    </LinearGradient>
  );
}
