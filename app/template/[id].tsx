import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth/AuthContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { appColors } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { addFood, addMeal, deleteTemplate, renameTemplate, useTemplate } from "@/lib/mealPlan/store";
import { MealCard } from "@/components/dietitian/MealCard";
import { GlobalAnalysis } from "@/components/dietitian/GlobalAnalysis";
import { AddMealModal } from "@/components/dietitian/AddMealModal";
import { AddFoodModal } from "@/components/dietitian/AddFoodModal";

type View2 = "Plan" | "Analysis";

export default function TemplateEditorScreen() {
  const { role } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMd } = useBreakpoint();
  const template = useTemplate(id!);

  const [view, setView] = useState<View2>("Plan");
  const [mealPickerOpen, setMealPickerOpen] = useState(false);
  const [foodPickerMealId, setFoodPickerMealId] = useState<string | null>(null);

  if (role !== "dietitian") return <Redirect href="/(app)" />;
  if (!template) return <Redirect href="/templates" />;

  const meals = template.meals;

  function handleDeleteTemplate() {
    if (Platform.OS === "web") {
      if (window.confirm("Delete this template? This can't be undone.")) { deleteTemplate(id!); router.replace("/templates"); }
    } else {
      Alert.alert("Delete template", "Delete this template? This can't be undone.", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => { deleteTemplate(id!); router.replace("/templates"); } },
      ]);
    }
  }

  const editor = (
    <View style={{ gap: 16 }}>
      {/* Template name card */}
      <View style={{
        flexDirection: "row", alignItems: "center", gap: 12,
        backgroundColor: appColors.paper, borderRadius: 16, borderWidth: 1, borderColor: appColors.border, padding: 16,
      }}>
        <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 15, color: appColors.text }}>Template name</Text>
        <TextInput
          value={template.name}
          onChangeText={(v) => renameTemplate(template.id, v)}
          placeholder="Meal plan template"
          placeholderTextColor={appColors.textSoft}
          style={{
            flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: appColors.border,
            paddingHorizontal: 14, fontFamily: "PublicSans_400Regular", fontSize: 15, color: appColors.text,
          }}
        />
        <Pressable
          onPress={handleDeleteTemplate}
          style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: appColors.danger, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="trash-outline" size={19} color="#FFFFFF" />
        </Pressable>
      </View>

      {meals.map((m) => (
        <MealCard
          key={m.id}
          templateId={template.id}
          meal={m}
          onAddFood={(mealId) => setFoodPickerMealId(mealId)}
        />
      ))}

      {/* Add meal (solid primary) */}
      <AnimatedPressable
        onPress={() => setMealPickerOpen(true)}
        style={{
          flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
          height: 52, borderRadius: 14, backgroundColor: appColors.fat,
        }}
      >
        <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 15, color: appColors.inkText }}>Add new meal</Text>
        <Ionicons name="add" size={19} color={appColors.inkText} />
      </AnimatedPressable>
    </View>
  );

  const showPlan = view === "Plan";

  return (
    <View style={{ flex: 1, backgroundColor: appColors.ink }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Top bar: back + view toggle */}
        <View style={{
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
          paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8,
        }}>
          <AnimatedPressable onPress={() => router.replace("/templates")} style={{ padding: 4, marginLeft: -4 }}>
            <Ionicons name="arrow-back" size={22} color={appColors.text} />
          </AnimatedPressable>

          <View style={{ flexDirection: "row", backgroundColor: appColors.paper, borderRadius: 12, borderWidth: 1, borderColor: appColors.border, padding: 3 }}>
            {(["Plan", "Analysis"] as View2[]).map((v) => {
              const active = view === v;
              return (
                <Pressable
                  key={v}
                  onPress={() => setView(v)}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 6,
                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9,
                    backgroundColor: active ? `${appColors.fat}12` : "transparent",
                  }}
                >
                  <Ionicons name={v === "Plan" ? "bar-chart-outline" : "leaf-outline"} size={15} color={active ? appColors.fat : appColors.textSoft} />
                  <Text style={{ fontFamily: active ? "PublicSans_600SemiBold" : "PublicSans_400Regular", fontSize: 13, color: active ? appColors.fat : appColors.textSoft }}>
                    {v}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* "Every day" banner */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 4 }}>
          <View style={{ backgroundColor: `${appColors.fat}10`, borderRadius: 12, paddingVertical: 14, alignItems: "center" }}>
            <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 15, color: appColors.fat }}>Every day</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 12, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          {isMd && showPlan ? (
            <View style={{ flexDirection: "row", gap: 24, alignItems: "flex-start" }}>
              <View style={{ flex: 1.7 }}>{editor}</View>
              <View style={{ flex: 1, maxWidth: 400 }}>
                <GlobalAnalysis meals={meals} />
              </View>
            </View>
          ) : showPlan ? (
            editor
          ) : (
            <GlobalAnalysis meals={meals} />
          )}
        </ScrollView>
      </SafeAreaView>

      <AddMealModal
        visible={mealPickerOpen}
        onClose={() => setMealPickerOpen(false)}
        onSelect={(presetId) => addMeal(template.id, presetId)}
      />
      <AddFoodModal
        visible={foodPickerMealId !== null}
        onClose={() => setFoodPickerMealId(null)}
        onAdd={(row) => {
          if (foodPickerMealId) addFood(template.id, foodPickerMealId, row);
        }}
      />
    </View>
  );
}
