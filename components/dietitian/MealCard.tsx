import { useState } from "react";
import { View, Text, TextInput, Pressable, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColors, appNutrient } from "@/lib/tokens";
import type { Meal } from "@/lib/mealPlan/types";
import { mealNutrition } from "@/lib/mealPlan/nutrition";
import { deleteFood, deleteMeal, setMealNotes, setMealTime } from "@/lib/mealPlan/store";

type Props = {
  templateId: string;
  meal: Meal;
  onAddFood: (mealId: string) => void;
};

export function MealCard({ templateId, meal, onAddFood }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const n = mealNutrition(meal);

  function confirmDelete() {
    if (Platform.OS === "web") {
      if (window.confirm(`Delete the ${meal.title} meal?`)) deleteMeal(templateId, meal.id);
    } else {
      Alert.alert("Delete meal", `Delete the ${meal.title} meal?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMeal(templateId, meal.id) },
      ]);
    }
  }

  return (
    <View style={{ backgroundColor: appColors.paper, borderRadius: 16, borderWidth: 1, borderColor: appColors.border, padding: 16 }}>
      {/* Header: time + title + actions */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TextInput
          value={meal.time}
          onChangeText={(v) => setMealTime(templateId, meal.id, v)}
          placeholder="00:00"
          placeholderTextColor={appColors.textSoft}
          style={{ width: 56, fontFamily: "PublicSans_500Medium", fontSize: 15, color: appColors.text }}
        />
        <Text style={{ flex: 1, fontFamily: "PublicSans_700Bold", fontSize: 18, color: appColors.text }}>
          {meal.title}
        </Text>
        <SquareBtn icon="ellipsis-vertical" onPress={confirmDelete} />
        <SquareBtn icon={collapsed ? "chevron-down" : "chevron-up"} onPress={() => setCollapsed((c) => !c)} bordered />
      </View>

      {!collapsed && (
        <>
          {/* Add new food (pale primary, at top per reference) */}
          <Pressable
            onPress={() => onAddFood(meal.id)}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 14, height: 46, borderRadius: 12,
              backgroundColor: `${appColors.fat}12`, opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 14, color: appColors.fat }}>Add new food</Text>
            <Ionicons name="add" size={18} color={appColors.fat} />
          </Pressable>

          {/* Food rows */}
          {meal.foods.map((f) => (
            <View key={f.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}>
              <View style={{
                width: 40, height: 44, borderRadius: 10, backgroundColor: appColors.paperDim,
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name="reorder-two" size={18} color={appColors.textSoft} />
              </View>
              <View style={{
                flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: appColors.border,
                justifyContent: "center", paddingHorizontal: 14,
              }}>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.text }} numberOfLines={1}>
                  {f.foodName}{f.quantityG ? `  ${f.quantityG} g` : ""}
                </Text>
              </View>
              <SquareBtn icon="trash-outline" tint={appColors.danger} onPress={() => deleteFood(templateId, meal.id, f.id)} bordered tall />
            </View>
          ))}

          {/* Notes */}
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.textSoft, marginTop: 18, marginBottom: 8 }}>
            Notes
          </Text>
          <TextInput
            value={meal.notes}
            onChangeText={(v) => setMealNotes(templateId, meal.id, v)}
            placeholder=""
            multiline
            style={{
              minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: appColors.border,
              padding: 12, fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.text,
              textAlignVertical: "top",
            }}
          />

          {/* Nutrient chips */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 18 }}>
            <NutrientChip token={appNutrient.energy} icon="flame-outline" label="Energy" value={`${Math.round(n.calories)} kcal`} />
            <NutrientChip token={appNutrient.fat} icon="ellipse-outline" label="Fat" value={`${Math.round(n.fatG)} g`} />
            <NutrientChip token={appNutrient.carbs} icon="ellipse-outline" label="Carbohydrate" value={`${Math.round(n.carbsG)} g`} />
            <NutrientChip token={appNutrient.protein} icon="diamond-outline" label="Protein" value={`${Math.round(n.proteinG)} g`} />
            <NutrientChip token={appNutrient.fiber} icon="triangle-outline" label="Fiber" value={`${Math.round(n.fiberG)} g`} />
          </View>
        </>
      )}
    </View>
  );
}

function SquareBtn({ icon, onPress, tint, bordered, tall }: {
  icon: any; onPress: () => void; tint?: string; bordered?: boolean; tall?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={{
        width: 40, height: tall ? 44 : 40, borderRadius: 10,
        alignItems: "center", justifyContent: "center",
        borderWidth: bordered ? 1 : 0, borderColor: appColors.border,
      }}
    >
      <Ionicons name={icon} size={18} color={tint ?? appColors.textSoft} />
    </Pressable>
  );
}

function NutrientChip({ token, icon, label, value }: {
  token: { fg: string; bg: string }; icon: any; label: string; value: string;
}) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View style={{
        flexDirection: "row", alignItems: "center", gap: 4,
        backgroundColor: token.bg, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4,
      }}>
        <Ionicons name={icon} size={11} color={token.fg} />
        <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: token.fg }} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.text, marginTop: 6 }}>{value}</Text>
    </View>
  );
}
