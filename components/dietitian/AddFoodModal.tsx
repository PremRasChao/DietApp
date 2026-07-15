import { useMemo, useState } from "react";
import { Modal, View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColors } from "@/lib/tokens";
import { COMMON_FOODS } from "@/lib/food/commonFoods";
import type { FoodResult } from "@/lib/food/openFoodFacts";
import { foodRowFromResult } from "@/lib/mealPlan/nutrition";
import type { FoodRow } from "@/lib/mealPlan/types";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (row: Omit<FoodRow, "id">) => void;
};

// Lightweight add-food flow: search the local food DB, pick one, set grams.
// (The PRD notes the full food-search flow is specified separately.)
export function AddFoodModal({ visible, onClose, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FoodResult | null>(null);
  const [grams, setGrams] = useState("100");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? COMMON_FOODS.filter((f) => f.name.toLowerCase().includes(q)) : COMMON_FOODS;
    return list.slice(0, 40);
  }, [query]);

  function reset() {
    setQuery(""); setSelected(null); setGrams("100");
  }

  function confirm() {
    if (!selected) return;
    const g = Math.max(1, parseInt(grams, 10) || 0);
    onAdd(foodRowFromResult(selected, g));
    reset();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { reset(); onClose(); }}>
      <Pressable
        onPress={() => { reset(); onClose(); }}
        style={{ flex: 1, backgroundColor: "rgba(28,25,23,0.45)", justifyContent: "flex-end" }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: appColors.paper,
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, height: "78%",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: appColors.border }} />
          </View>

          {!selected ? (
            <>
              <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 18, color: appColors.text, marginBottom: 12 }}>
                Add food
              </Text>
              <View style={{
                flexDirection: "row", alignItems: "center", gap: 8,
                backgroundColor: appColors.paperDim, borderRadius: 12,
                paddingHorizontal: 12, height: 44, marginBottom: 12,
              }}>
                <Ionicons name="search" size={16} color={appColors.textSoft} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  placeholder="Search foods"
                  placeholderTextColor={appColors.textSoft}
                  style={{ flex: 1, fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.text }}
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {results.map((f) => (
                  <Pressable
                    key={f.id}
                    onPress={() => { setSelected(f); setGrams(String(f.servingG)); }}
                    style={({ pressed }) => ({
                      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                      paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: appColors.divider,
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 14, color: appColors.text, flex: 1 }}>
                      {f.name}
                    </Text>
                    <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.textSoft }}>
                      {f.kcalPer100g} kcal/100g
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <Pressable onPress={() => setSelected(null)} style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 16 }}>
                <Ionicons name="chevron-back" size={18} color={appColors.textSoft} />
                <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.textSoft }}>Back to search</Text>
              </Pressable>

              <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 20, color: appColors.text }}>
                {selected.name}
              </Text>

              <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: appColors.textSoft, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 20, marginBottom: 8 }}>
                Quantity (grams)
              </Text>
              <TextInput
                value={grams}
                onChangeText={setGrams}
                keyboardType="number-pad"
                style={{
                  height: 48, borderRadius: 12, borderWidth: 1, borderColor: appColors.border,
                  backgroundColor: appColors.paperDim, paddingHorizontal: 14,
                  fontFamily: "PublicSans_500Medium", fontSize: 16, color: appColors.text,
                }}
              />

              {/* Live preview of the row's macros */}
              {(() => {
                const g = Math.max(1, parseInt(grams, 10) || 0);
                const row = foodRowFromResult(selected, g);
                return (
                  <View style={{ flexDirection: "row", gap: 16, marginTop: 20 }}>
                    <Stat label="kcal" value={row.calories} />
                    <Stat label="P" value={`${row.proteinG}g`} color={appColors.protein} />
                    <Stat label="C" value={`${row.carbsG}g`} color={appColors.carb} />
                    <Stat label="F" value={`${row.fatG}g`} color={appColors.fat} />
                  </View>
                );
              })()}

              <Pressable
                onPress={confirm}
                style={({ pressed }) => ({
                  marginTop: 28, height: 50, borderRadius: 14, backgroundColor: appColors.fat,
                  alignItems: "center", justifyContent: "center", opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 15, color: appColors.inkText }}>
                  Add to meal
                </Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <View>
      <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 11, color: color ?? appColors.textSoft }}>{label}</Text>
      <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 16, color: appColors.text, marginTop: 2 }}>{value}</Text>
    </View>
  );
}
