import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { colors } from "@/lib/tokens";
import { searchFood, FoodResult } from "@/lib/food/openFoodFacts";
import { searchLocal } from "@/lib/food/commonFoods";
import { logFood, getTodayLogs, deleteLog, FoodLogEntry } from "@/lib/food/foodLog";

const MEAL_TYPES = ["breakfast", "lunch", "snack", "dinner"] as const;

function MacroPill({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View style={{ alignItems: "center", gap: 2 }}>
      <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.espresso }}>
        {value}{unit}
      </Text>
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.taupe }}>
        {label}
      </Text>
    </View>
  );
}

function FoodResultRow({ item, onPress }: { item: FoodResult; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.cream : colors.bone,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text
          numberOfLines={1}
          style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.espresso }}
        >
          {item.name}
        </Text>
        {item.brand && (
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.taupe, marginTop: 2 }}>
            {item.brand}
          </Text>
        )}
      </View>
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.tan }}>
        {item.kcalPer100g} kcal
      </Text>
    </Pressable>
  );
}

function LogEntryRow({ entry, onDelete }: { entry: FoodLogEntry; onDelete: () => void }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.espresso }}>
          {entry.food_name}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.taupe, marginTop: 2 }}>
          {entry.serving_g}g · {entry.kcal} kcal · P {entry.protein_g}g · C {entry.carbs_g}g · F {entry.fat_g}g
        </Text>
      </View>
      <Pressable
        onPress={onDelete}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 8 })}
      >
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 18, color: colors.taupe }}>×</Text>
      </Pressable>
    </View>
  );
}

export default function LogScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [todayLogs, setTodayLogs] = useState<FoodLogEntry[]>([]);
  const [selected, setSelected] = useState<FoodResult | null>(null);
  const [servingG, setServingG] = useState("100");
  const [mealType, setMealType] = useState<string>("snack");
  const [logging, setLogging] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTodayLogs = useCallback(async () => {
    try {
      const logs = await getTodayLogs();
      setTodayLogs(logs);
    } catch {}
  }, []);

  useEffect(() => { loadTodayLogs(); }, [loadTodayLogs]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }

    // Show local results instantly
    setResults(searchLocal(query));
    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const apiRes = await searchFood(query);
        // Merge: API results first, then local ones not already in API results
        const apiIds = new Set(apiRes.map((r) => r.id));
        const local = searchLocal(query).filter((r) => !apiIds.has(r.id));
        setResults([...apiRes, ...local]);
      } catch {
        // Keep local results on API failure
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [query]);

  const serving = Math.max(1, Number(servingG) || 100);
  const ratio = serving / 100;
  const scaledKcal = selected ? Math.round(selected.kcalPer100g * ratio) : 0;
  const scaledProtein = selected ? Math.round(selected.proteinPer100g * ratio * 10) / 10 : 0;
  const scaledCarbs = selected ? Math.round(selected.carbsPer100g * ratio * 10) / 10 : 0;
  const scaledFat = selected ? Math.round(selected.fatPer100g * ratio * 10) / 10 : 0;

  async function handleLog() {
    if (!selected) return;
    setLogging(true);
    try {
      await logFood({
        food_name: selected.name,
        brand: selected.brand,
        kcal: scaledKcal,
        protein_g: scaledProtein,
        carbs_g: scaledCarbs,
        fat_g: scaledFat,
        serving_g: serving,
        meal_type: mealType,
      });
      setSelected(null);
      setQuery("");
      setResults([]);
      await loadTodayLogs();
    } catch (e) {
      console.error(e);
    } finally {
      setLogging(false);
    }
  }

  const todayKcal = todayLogs.reduce((s, e) => s + e.kcal, 0);
  const todayProtein = Math.round(todayLogs.reduce((s, e) => s + e.protein_g, 0) * 10) / 10;
  const todayCarbs = Math.round(todayLogs.reduce((s, e) => s + e.carbs_g, 0) * 10) / 10;
  const todayFat = Math.round(todayLogs.reduce((s, e) => s + e.fat_g, 0) * 10) / 10;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bone }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: colors.bone }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 28, color: colors.espresso }}>
          Log food
        </Text>

        {/* Search bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.cream,
            borderRadius: 14,
            paddingHorizontal: 14,
            marginTop: 16,
            height: 48,
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search any food, brand, or dish…"
            placeholderTextColor={colors.taupe}
            style={{
              flex: 1,
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              color: colors.espresso,
            }}
          />
          {searching && <ActivityIndicator size="small" color={colors.tan} />}
          {query.length > 0 && !searching && (
            <Pressable onPress={() => { setQuery(""); setResults([]); }}>
              <Text style={{ color: colors.taupe, fontSize: 18, paddingLeft: 8 }}>×</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Search results */}
        {results.length > 0 && (
          <View style={{ marginHorizontal: 20, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: colors.cream, marginBottom: 24 }}>
            {results.map((item) => (
              <FoodResultRow
                key={item.id}
                item={item}
                onPress={() => {
                  setSelected(item);
                  setServingG(String(item.servingG));
                }}
              />
            ))}
          </View>
        )}

        {/* Today's summary */}
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 10, color: colors.taupe, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
            Today's intake
          </Text>

          <View
            style={{
              backgroundColor: colors.cream,
              borderRadius: 16,
              padding: 18,
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 16,
            }}
          >
            <MacroPill label="Calories" value={todayKcal} unit="" />
            <View style={{ width: 1, backgroundColor: colors.tan, opacity: 0.3 }} />
            <MacroPill label="Protein" value={todayProtein} unit="g" />
            <View style={{ width: 1, backgroundColor: colors.tan, opacity: 0.3 }} />
            <MacroPill label="Carbs" value={todayCarbs} unit="g" />
            <View style={{ width: 1, backgroundColor: colors.tan, opacity: 0.3 }} />
            <MacroPill label="Fat" value={todayFat} unit="g" />
          </View>

          {todayLogs.length === 0 ? (
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.taupe, textAlign: "center", marginTop: 16 }}>
              Nothing logged yet — search above to add your first meal
            </Text>
          ) : (
            <View style={{ backgroundColor: colors.cream, borderRadius: 16, paddingHorizontal: 16, marginBottom: 40 }}>
              {todayLogs.map((entry) => (
                <LogEntryRow
                  key={entry.id}
                  entry={entry}
                  onDelete={async () => {
                    await deleteLog(entry.id);
                    loadTodayLogs();
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Log modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(44,31,20,0.4)" }}
          onPress={() => setSelected(null)}
        />
        {selected && (
          <View
            style={{
              backgroundColor: colors.bone,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 28,
              paddingBottom: 48,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: colors.espresso, marginBottom: 4 }} numberOfLines={2}>
              {selected.name}
            </Text>
            {selected.brand && (
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.taupe, marginBottom: 16 }}>
                {selected.brand}
              </Text>
            )}

            {/* Scaled macros */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor: colors.cream, borderRadius: 14, padding: 14, marginBottom: 20 }}>
              <MacroPill label="kcal" value={scaledKcal} unit="" />
              <MacroPill label="Protein" value={scaledProtein} unit="g" />
              <MacroPill label="Carbs" value={scaledCarbs} unit="g" />
              <MacroPill label="Fat" value={scaledFat} unit="g" />
            </View>

            {/* Serving size */}
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.taupe, marginBottom: 8 }}>
              Serving size (g)
            </Text>
            <TextInput
              value={servingG}
              onChangeText={setServingG}
              keyboardType="numeric"
              style={{
                backgroundColor: colors.cream,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                color: colors.espresso,
                marginBottom: 18,
              }}
            />

            {/* Meal type */}
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.taupe, marginBottom: 8 }}>
              Meal
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
              {MEAL_TYPES.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMealType(m)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: mealType === m ? colors.espresso : colors.cream,
                  }}
                >
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: mealType === m ? colors.bone : colors.taupe, textTransform: "capitalize" }}>
                    {m}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Log button */}
            <Pressable
              onPress={handleLog}
              disabled={logging}
              style={({ pressed }) => ({
                backgroundColor: colors.espresso,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                opacity: pressed || logging ? 0.7 : 1,
              })}
            >
              {logging ? (
                <ActivityIndicator color={colors.bone} />
              ) : (
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: colors.bone }}>
                  Log {scaledKcal} kcal
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </Modal>
    </View>
  );
}
