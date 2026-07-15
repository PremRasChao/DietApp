import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { appColors, appNutrient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import {
  useTemplates, createTemplate, duplicateTemplate, deleteTemplate,
} from "@/lib/mealPlan/store";
import { dayNutrition, macroPercents } from "@/lib/mealPlan/nutrition";

type Filter = "All templates" | "My templates" | "System templates";
const FILTERS: Filter[] = ["All templates", "My templates", "System templates"];

// The template library body (create / filter / search / list). Rendered both by
// the standalone /templates route and inside the Meals → Templates sub-tab.
export function TemplateLibrary() {
  const templates = useTemplates();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All templates");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) =>
      t.name.toLowerCase().includes(q) &&
      (filter === "All templates" || t.source === filter));
  }, [templates, query, filter]);

  function handleCreate() {
    const t = createTemplate();
    router.push(`/template/${t.id}` as any);
  }

  function confirmDelete(id: string, name: string) {
    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${name}"? This can't be undone.`)) deleteTemplate(id);
    } else {
      Alert.alert("Delete template", `Delete "${name}"? This can't be undone.`, [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTemplate(id) },
      ]);
    }
  }

  return (
    <View>
      {/* Controls row */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }}>
        <AnimatedPressable
          onPress={handleCreate}
          style={{
            flexDirection: "row", alignItems: "center", gap: 8,
            backgroundColor: appColors.fat, borderRadius: 999,
            paddingHorizontal: 18, paddingVertical: 11,
          }}
        >
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 14, color: appColors.inkText }}>
            Create template
          </Text>
          <Ionicons name="add" size={18} color={appColors.inkText} />
        </AnimatedPressable>

        {/* Filter dropdown */}
        <View>
          <Pressable
            onPress={() => setFilterOpen((o) => !o)}
            style={{
              flexDirection: "row", alignItems: "center", gap: 8,
              backgroundColor: appColors.paper, borderRadius: 999,
              borderWidth: 1, borderColor: appColors.border,
              paddingHorizontal: 16, paddingVertical: 10,
            }}
          >
            <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.text }}>{filter}</Text>
            <Ionicons name={filterOpen ? "chevron-up" : "chevron-down"} size={15} color={appColors.textSoft} />
          </Pressable>
          {filterOpen && (
            <View style={{
              position: "absolute", top: 46, right: 0, zIndex: 20, minWidth: 180,
              backgroundColor: appColors.paper, borderRadius: 14, borderWidth: 1, borderColor: appColors.border,
              paddingVertical: 4,
              ...(Platform.OS === "web" ? { boxShadow: "0 8px 24px rgba(28,25,23,0.12)" } as any : { elevation: 6 }),
            }}>
              {FILTERS.map((f) => (
                <Pressable
                  key={f}
                  onPress={() => { setFilter(f); setFilterOpen(false); }}
                  style={({ pressed }) => ({ paddingHorizontal: 14, paddingVertical: 11, opacity: pressed ? 0.6 : 1 })}
                >
                  <Text style={{
                    fontFamily: f === filter ? "PublicSans_600SemiBold" : "PublicSans_400Regular",
                    fontSize: 13, color: f === filter ? appColors.fat : appColors.text,
                  }}>{f}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 8,
          backgroundColor: appColors.paper, borderRadius: 14,
          borderWidth: 1, borderColor: appColors.border,
          paddingHorizontal: 16, height: 48,
        }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search meal plan template"
            placeholderTextColor={appColors.textSoft}
            style={{ flex: 1, fontFamily: "PublicSans_400Regular", fontSize: 15, color: appColors.text }}
          />
          <Ionicons name="search" size={18} color={appColors.textSoft} />
        </View>
      </View>

      {/* List */}
      <View style={{ padding: 20, paddingTop: 16, gap: 12 }}>
        {filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <Ionicons name="documents-outline" size={34} color={appColors.textSoft} />
            <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 14, color: appColors.textSoft, marginTop: 10 }}>
              {templates.length === 0 ? "No templates yet" : "No matches"}
            </Text>
          </View>
        )}

        {filtered.map((t) => {
          const n = dayNutrition(t.meals);
          const pct = macroPercents(n);
          return (
            <AnimatedPressable
              key={t.id}
              onPress={() => router.push(`/template/${t.id}` as any)}
              style={{
                backgroundColor: appColors.paper, borderRadius: 16,
                borderWidth: 1, borderColor: appColors.border,
                paddingVertical: 18, paddingHorizontal: 20,
                flexDirection: "row", alignItems: "center",
              }}
            >
              {/* Left: name + source */}
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 16, color: appColors.text }}>
                  {t.name}
                </Text>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.textSoft, marginTop: 3 }}>
                  {t.source}
                </Text>
              </View>

              {/* Right: stat columns */}
              <StatCol value={`${Math.round(n.calories)} kcal`} label="Energy" icon="flame-outline" color={appNutrient.energy.fg} />
              <StatCol value={`${pct.fat} %`} label="Fat" icon="ellipse-outline" color={appNutrient.fat.fg} />
              <StatCol value={`${pct.carbs} %`} label="Carbohydrate" icon="ellipse-outline" color={appNutrient.carbs.fg} />
              <StatCol value={`${pct.protein} %`} label="Protein" icon="diamond-outline" color={appNutrient.protein.fg} />

              <Pressable
                onPress={(e) => {
                  (e as any).stopPropagation?.();
                  if (Platform.OS === "web") {
                    const a = window.confirm(`Duplicate "${t.name}"?  (Cancel to delete)`);
                    if (a) duplicateTemplate(t.id); else confirmDelete(t.id, t.name);
                  } else {
                    Alert.alert(t.name, undefined, [
                      { text: "Duplicate", onPress: () => duplicateTemplate(t.id) },
                      { text: "Delete", style: "destructive", onPress: () => confirmDelete(t.id, t.name) },
                      { text: "Cancel", style: "cancel" },
                    ]);
                  }
                }}
                hitSlop={8}
                style={{ paddingLeft: 12, paddingVertical: 4 }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color={appColors.textSoft} />
              </Pressable>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

function StatCol({ value, label, icon, color }: { value: string; label: string; icon: any; color: string }) {
  return (
    <View style={{ alignItems: "center", minWidth: 84 }}>
      <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 16, color: appColors.text }}>{value}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
        <Ionicons name={icon} size={12} color={color} />
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.textSoft }}>{label}</Text>
      </View>
    </View>
  );
}
