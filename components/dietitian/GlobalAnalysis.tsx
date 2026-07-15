import { useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColors, appNutrient } from "@/lib/tokens";
import type { Meal } from "@/lib/mealPlan/types";
import { dayNutrition, mealNutrition } from "@/lib/mealPlan/nutrition";
import { MacroDonut } from "@/components/dietitian/MacroDonut";

// Persistent analysis panel (PRD §6): energy, macro-distribution donut,
// per-nutrient bars, and a per-meal mini-donut carousel.
export function GlobalAnalysis({ meals }: { meals: Meal[] }) {
  const total = dayNutrition(meals);
  const maxG = Math.max(total.proteinG, total.carbsG, total.fatG, total.fiberG, 1);
  const hasFood = meals.some((m) => m.foods.length > 0);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={{ gap: 16 }}>
      <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 20, color: appColors.text }}>Global analysis</Text>

      {!hasFood ? (
        <View style={{
          backgroundColor: appColors.paperDim, borderRadius: 14,
          paddingVertical: 34, alignItems: "center", gap: 10,
        }}>
          <Ionicons name="git-commit-outline" size={22} color={appColors.textSoft} />
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.textSoft }}>
            Food has not yet been entered
          </Text>
        </View>
      ) : (
        <>
          {/* Energy */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="flame-outline" size={16} color={appNutrient.energy.fg} />
                <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 16, color: appColors.text }}>Energy</Text>
              </View>
              <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 16, color: appColors.text }}>
                {Math.round(total.calories)} <Text style={{ fontSize: 12, color: appColors.textSoft }}>kcal</Text>
              </Text>
            </View>
            <View style={{ height: 12, borderRadius: 6, backgroundColor: appNutrient.energy.bar }} />
          </View>

          {/* Donut + macro bars */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <MacroDonut nutrition={total} size={132} stroke={30} />
            <View style={{ flex: 1, gap: 14 }}>
              <MacroBar token={appNutrient.fat} icon="ellipse-outline" label="Fat" grams={total.fatG} max={maxG} />
              <MacroBar token={appNutrient.carbs} icon="ellipse-outline" label="Carbohydrate" grams={total.carbsG} max={maxG} />
              <MacroBar token={appNutrient.protein} icon="diamond-outline" label="Protein" grams={total.proteinG} max={maxG} />
            </View>
          </View>

          {/* Dietary fiber (separate — not in donut) */}
          <MacroBar token={appNutrient.fiber} icon="triangle-outline" label="Dietary fiber" grams={total.fiberG} max={maxG} />

          {/* Meals carousel */}
          <View style={{ backgroundColor: appColors.paper, borderRadius: 16, borderWidth: 1, borderColor: appColors.border, padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 16, color: appColors.text }}>Meals</Text>
              <View style={{ flexDirection: "row", gap: 14 }}>
                <Ionicons name="chevron-back" size={18} color={appColors.textSoft} onPress={() => scrollRef.current?.scrollTo({ x: 0, animated: true })} />
                <Ionicons name="chevron-forward" size={18} color={appColors.textSoft} onPress={() => scrollRef.current?.scrollToEnd({ animated: true })} />
              </View>
            </View>
            <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 18 }}>
              {meals.map((m) => (
                <View key={m.id} style={{ width: 78, alignItems: "center" }}>
                  <MacroDonut nutrition={mealNutrition(m)} size={62} stroke={12} />
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.text, marginTop: 8, textAlign: "center" }}>
                    {m.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

function MacroBar({ token, icon, label, grams, max }: {
  token: { fg: string; bar: string }; icon: any; label: string; grams: number; max: number;
}) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name={icon} size={14} color={token.fg} />
          <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 14, color: appColors.text }}>{label}</Text>
        </View>
        <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 14, color: appColors.text }}>
          {Math.round(grams * 10) / 10} <Text style={{ fontSize: 11, color: appColors.textSoft }}>g</Text>
        </Text>
      </View>
      <View style={{ height: 12, borderRadius: 6, backgroundColor: appColors.paperDim, overflow: "hidden" }}>
        <View style={{ width: `${Math.min(grams / max, 1) * 100}%`, height: 12, borderRadius: 6, backgroundColor: token.bar }} />
      </View>
    </View>
  );
}
