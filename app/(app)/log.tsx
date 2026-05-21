import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/tokens";
import { searchFood, FoodResult } from "@/lib/food/openFoodFacts";
import { searchLocal } from "@/lib/food/commonFoods";
import { logFood, getTodayLogs, deleteLog, FoodLogEntry } from "@/lib/food/foodLog";

const CALORIE_GOAL = 2000;
const MEAL_TYPES = ["breakfast", "lunch", "snack", "dinner"] as const;
type MealType = (typeof MEAL_TYPES)[number];
const MEAL_META: Record<string, { icon: string; label: string }> = {
  breakfast: { icon: "☀️", label: "Breakfast" }, lunch: { icon: "🌤️", label: "Lunch" },
  snack: { icon: "🍎", label: "Snack" }, dinner: { icon: "🌙", label: "Dinner" },
  meal: { icon: "🍽️", label: "Meal" },
};

function Chip({ label, value, bg, fg }: { label: string; value: number; bg: string; fg: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: bg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }}>
      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 10, color: fg }}>{label}</Text>
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: fg }}>{Math.round(value)}g</Text>
    </View>
  );
}

function FoodCard({ item, onPress }: { item: FoodResult; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.bone : colors.cream, borderRadius: 18, padding: 16,
        marginBottom: 10, flexDirection: "row", alignItems: "center",
        shadowColor: colors.espresso, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
      })}
    >
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: `${colors.tan}25`, alignItems: "center", justifyContent: "center", marginRight: 14 }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: colors.tan }}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.espresso }}>{item.name}</Text>
        {item.brand ? <Text numberOfLines={1} style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.taupe, marginTop: 2 }}>{item.brand}</Text> : null}
        <View style={{ flexDirection: "row", gap: 5, marginTop: 7 }}>
          <Chip label="P" value={item.proteinPer100g} bg={`${colors.espresso}15`} fg={colors.espresso} />
          <Chip label="C" value={item.carbsPer100g}   bg={`${colors.tan}25`}      fg={colors.espresso} />
          <Chip label="F" value={item.fatPer100g}     bg={`${colors.taupe}20`}    fg={colors.espresso} />
        </View>
      </View>
      <View style={{ backgroundColor: colors.espresso, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 8, marginLeft: 10, alignItems: "center", minWidth: 54 }}>
        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.bone }}>{item.kcalPer100g}</Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 9, color: `${colors.bone}70` }}>kcal</Text>
      </View>
    </Pressable>
  );
}

function LogEntry({ entry, onDelete }: { entry: FoodLogEntry; onDelete: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 13, gap: 10 }}>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.espresso }}>{entry.food_name}</Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.taupe, marginTop: 3 }}>
          {entry.serving_g}g · P {Math.round(entry.protein_g)}g · C {Math.round(entry.carbs_g)}g · F {Math.round(entry.fat_g)}g
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 15, color: colors.espresso }}>{entry.kcal}</Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: colors.taupe }}>kcal</Text>
      </View>
      <Pressable onPress={onDelete} style={({ pressed }) => ({ opacity: pressed ? 0.4 : 1, padding: 6 })}>
        <Ionicons name="trash-outline" size={15} color={colors.taupe} />
      </Pressable>
    </View>
  );
}

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [todayLogs, setTodayLogs] = useState<FoodLogEntry[]>([]);
  const [selected, setSelected]   = useState<FoodResult | null>(null);
  const [servingG, setServingG]   = useState("100");
  const [mealType, setMealType]   = useState<MealType>("snack");
  const [logging, setLogging]     = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTodayLogs = useCallback(async () => {
    try { setTodayLogs(await getTodayLogs()); } catch {}
  }, []);

  useFocusEffect(useCallback(() => { loadTodayLogs(); }, [loadTodayLogs]));

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
      } catch { /* keep local */ } finally { setSearching(false); }
    }, 350);
  }, [query]);

  const serving       = Math.max(1, Number(servingG) || 100);
  const ratio         = serving / 100;
  const scaledKcal    = selected ? Math.round(selected.kcalPer100g    * ratio) : 0;
  const scaledProtein = selected ? Math.round(selected.proteinPer100g * ratio * 10) / 10 : 0;
  const scaledCarbs   = selected ? Math.round(selected.carbsPer100g   * ratio * 10) / 10 : 0;
  const scaledFat     = selected ? Math.round(selected.fatPer100g     * ratio * 10) / 10 : 0;

  async function handleLog() {
    if (!selected) return;
    setLogging(true);
    try {
      await logFood({ food_name: selected.name, brand: selected.brand, kcal: scaledKcal, protein_g: scaledProtein, carbs_g: scaledCarbs, fat_g: scaledFat, serving_g: serving, meal_type: mealType });
      setSelected(null); setQuery(""); setResults([]);
      await loadTodayLogs();
    } catch (e) { console.error(e); } finally { setLogging(false); }
  }

  const todayKcal  = todayLogs.reduce((s, e) => s + e.kcal, 0);
  const showSearch = results.length > 0 || searching;

  const grouped: Record<string, FoodLogEntry[]> = {};
  MEAL_TYPES.forEach((mt) => {
    const items = todayLogs.filter((e) => e.meal_type === mt);
    if (items.length) grouped[mt] = items;
  });
  const other = todayLogs.filter((e) => !e.meal_type || !(MEAL_TYPES as readonly string[]).includes(e.meal_type ?? ""));
  if (other.length) grouped["meal"] = other;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bone }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 14, backgroundColor: colors.bone }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 28, color: colors.espresso }}>Log food</Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.taupe }}>
            {new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
          </Text>
        </View>

        {/* Calorie bar */}
        <View style={{ backgroundColor: colors.cream, borderRadius: 16, padding: 14, marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: colors.espresso, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 7 }}>
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: colors.espresso }}>{todayKcal} eaten</Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.taupe }}>{Math.max(CALORIE_GOAL - todayKcal, 0)} left</Text>
            </View>
            <View style={{ height: 7, backgroundColor: "rgba(44,31,20,0.08)", borderRadius: 4 }}>
              <View style={{ width: `${Math.min(todayKcal / CALORIE_GOAL, 1) * 100}%`, height: 7, backgroundColor: todayKcal >= CALORIE_GOAL ? "#C87070" : colors.tan, borderRadius: 4 }} />
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, color: colors.espresso, lineHeight: 20 }}>{CALORIE_GOAL}</Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: colors.taupe }}>goal</Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.cream, borderRadius: 14, paddingHorizontal: 14, height: 50, shadowColor: colors.espresso, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
          <Ionicons name="search-outline" size={18} color={colors.taupe} style={{ marginRight: 8 }} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search any food, brand, or dish…" placeholderTextColor={colors.taupe} style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: colors.espresso }} />
          {searching && <ActivityIndicator size="small" color={colors.tan} style={{ marginLeft: 8 }} />}
          {query.length > 0 && !searching && (
            <Pressable onPress={() => { setQuery(""); setResults([]); }}>
              <Ionicons name="close-circle" size={20} color={colors.taupe} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        {showSearch ? (
          <>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: colors.taupe, letterSpacing: 1.3, textTransform: "uppercase", marginBottom: 12 }}>
              Results · values per 100 g
            </Text>
            {results.map((item) => (
              <FoodCard key={item.id} item={item} onPress={() => { setSelected(item); setServingG(String(item.servingG)); }} />
            ))}
          </>
        ) : todayLogs.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 52 }}>
            <Text style={{ fontSize: 52, marginBottom: 18 }}>🥗</Text>
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 22, color: colors.espresso, marginBottom: 8 }}>Nothing logged yet</Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.taupe, textAlign: "center", lineHeight: 22 }}>
              Search above to log{"\n"}your first meal today
            </Text>
          </View>
        ) : (
          <>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, color: colors.taupe, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 18 }}>
              Today's meals
            </Text>
            {Object.entries(grouped).map(([mt, entries]) => {
              const meta = MEAL_META[mt] ?? { icon: "🍽️", label: mt };
              const groupKcal = entries.reduce((s, e) => s + e.kcal, 0);
              return (
                <View key={mt} style={{ marginBottom: 22 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 10 }}>
                    <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: `${colors.tan}25`, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 15 }}>{meta.icon}</Text>
                    </View>
                    <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.espresso, flex: 1 }}>{meta.label}</Text>
                    <View style={{ backgroundColor: `${colors.tan}30`, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3 }}>
                      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: colors.espresso }}>{groupKcal} kcal</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: colors.cream, borderRadius: 18, paddingHorizontal: 16, shadowColor: colors.espresso, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 }}>
                    {entries.map((entry, i) => (
                      <View key={entry.id} style={{ borderTopWidth: i > 0 ? 1 : 0, borderTopColor: "rgba(44,31,20,0.07)" }}>
                        <LogEntry entry={entry} onDelete={async () => { await deleteLog(entry.id); loadTodayLogs(); }} />
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(44,31,20,0.45)" }} onPress={() => setSelected(null)} />
        {selected && (
          <View style={{ backgroundColor: colors.bone, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 14, paddingBottom: Math.max(insets.bottom, 20) + 16, position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(44,31,20,0.15)", alignSelf: "center", marginBottom: 22 }} />

            <Text numberOfLines={2} style={{ fontFamily: "Fraunces_700Bold", fontSize: 21, color: colors.espresso, marginBottom: selected.brand ? 3 : 20 }}>
              {selected.name}
            </Text>
            {selected.brand ? <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.taupe, marginBottom: 20 }}>{selected.brand}</Text> : null}

            {/* Hero calorie card */}
            <View style={{ backgroundColor: colors.espresso, borderRadius: 22, padding: 22, marginBottom: 20, alignItems: "center" }}>
              <Text style={{ fontFamily: "Fraunces_300Light", fontSize: 60, color: colors.bone, lineHeight: 64 }}>{scaledKcal}</Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: `${colors.bone}70`, marginBottom: 18 }}>kcal</Text>
              <View style={{ flexDirection: "row", gap: 24 }}>
                {[{ l: "Protein", v: scaledProtein }, { l: "Carbs", v: scaledCarbs }, { l: "Fat", v: scaledFat }].map(({ l, v }) => (
                  <View key={l} style={{ alignItems: "center" }}>
                    <Text style={{ fontFamily: "Inter_700Bold", fontSize: 17, color: colors.tan }}>{v}g</Text>
                    <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: `${colors.bone}55` }}>{l}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Serving */}
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: colors.taupe, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Serving (g)</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              {[...new Set([50, 100, 150, selected.servingG])].sort((a, b) => a - b).slice(0, 4).map((g) => (
                <Pressable key={g} onPress={() => setServingG(String(g))} style={{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: serving === g ? colors.tan : colors.cream }}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: serving === g ? colors.bone : colors.espresso }}>{g}g</Text>
                </Pressable>
              ))}
            </View>
            <TextInput value={servingG} onChangeText={setServingG} keyboardType="numeric" placeholder="Custom amount…" placeholderTextColor={colors.taupe} style={{ backgroundColor: colors.cream, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: "Inter_400Regular", fontSize: 15, color: colors.espresso, marginBottom: 18 }} />

            {/* Meal type */}
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: colors.taupe, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Meal</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 22 }}>
              {MEAL_TYPES.map((m) => (
                <Pressable key={m} onPress={() => setMealType(m)} style={{ flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: "center", backgroundColor: mealType === m ? colors.espresso : colors.cream }}>
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, textTransform: "capitalize", color: mealType === m ? colors.bone : colors.taupe }}>{m}</Text>
                </Pressable>
              ))}
            </View>

            {/* Log button */}
            <Pressable onPress={handleLog} disabled={logging} style={({ pressed }) => ({ backgroundColor: colors.tan, borderRadius: 16, paddingVertical: 17, alignItems: "center", opacity: pressed || logging ? 0.75 : 1 })}>
              {logging ? <ActivityIndicator color={colors.bone} /> : (
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.bone }}>Add to log · {scaledKcal} kcal</Text>
              )}
            </Pressable>
          </View>
        )}
      </Modal>
    </View>
  );
}
