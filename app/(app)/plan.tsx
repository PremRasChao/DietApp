import {
  View, Text, TextInput, ScrollView, Pressable,
  ActivityIndicator, Image, Modal, Platform, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { appColors, appMacroColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { searchFood, FoodResult } from "@/lib/food/openFoodFacts";
import { searchLocal } from "@/lib/food/commonFoods";
import {
  searchRecipes, generateMealPlan, getRecipeDetails,
  SPOON_DIETS, SpoonRecipe, GeneratedPlan, RecipeDetails,
} from "@/lib/food/spoonacular";
import { searchMealDB, getRecipeDetailsByName, MealDBRecipe } from "@/lib/food/mealdb";
import { mockRecipes, mockPlanMeals, mockMealTemplates, type PlanMeal } from "@/lib/mockData";
import {
  getUserRecipes, subscribe as subscribeUserRecipes, addUserRecipe, addUserRecipes,
  parseRecipeSheet, SHEET_COLUMNS, type UserRecipe,
} from "@/lib/mealPlan/userRecipes";
import { useAuth } from "@/lib/auth/AuthContext";
import { TemplateLibrary } from "@/components/dietitian/TemplateLibrary";

const PLAN_TABS = ["Foods", "Recipes", "Equivalents", "Templates"] as const;
type PlanTab = typeof PLAN_TABS[number];

type DR = {
  id: string; name: string; cuisine: string; tags: string[];
  kcal: number; protein_g: number; carbs_g: number; fat_g: number;
  prepTime: string; thumbnail?: string;
  ingredients?: Array<{ amount: string; name: string }>;
  steps?: string[];
};

let featuredCache: DR[] = [];
// null = not fetched yet; false = fetched but failed/unavailable
const detailsCache = new Map<string, RecipeDetails | false>();

const CUISINE_HUE: Record<string, string> = {
  Indian: appColors.carb, Japanese: appColors.protein, Mexican: "#F5A623",
  Greek: appColors.fat, Thai: "#7B68EE", Moroccan: appColors.protein,
  Korean: appColors.carb, Brazilian: appColors.fat, Italian: appColors.protein,
  Ethiopian: "#8B6914", Lebanese: appColors.fat, Vietnamese: appColors.fat,
  Peruvian: appColors.protein, Turkish: appColors.carb, Canadian: appColors.fat,
  International: appColors.fat,
};

const TAG_COLOR: Record<string, string> = {
  "Vegan": appColors.fat, "Keto": appColors.protein, "Mediterranean": appColors.fat,
  "High Protein": appColors.fat, "Weight Loss": appColors.protein, "Sports": appColors.fat,
  "Diabetes": "#8B6914", "Cultural": appColors.fat, "Bone Health": appColors.fat,
  "Vegetarian": appColors.fat, "Balanced": appColors.fat,
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function spoonToDR(r: SpoonRecipe): DR {
  return { id: r.id, name: r.name, cuisine: r.cuisine, tags: r.tags,
    kcal: r.kcal, protein_g: r.protein_g, carbs_g: r.carbs_g, fat_g: r.fat_g,
    prepTime: r.prepTime, thumbnail: r.thumbnail,
    ingredients: r.ingredients, steps: r.steps };
}
function mealdbToDR(r: MealDBRecipe): DR {
  return { id: r.id, name: r.name, cuisine: r.cuisine, tags: r.tags,
    kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, prepTime: "—",
    thumbnail: r.thumbnail ?? undefined };
}

// ── Recipe detail modal ────────────────────────────────────────────────────────
function RecipeDetailModal({ recipe, onClose }: { recipe: DR | null; onClose: () => void }) {
  const [details, setDetails] = useState<RecipeDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (!recipe) { setDetails(null); setDetailsLoading(false); return; }

    // 1. Best case: ingredients/steps embedded from complexSearch — instant, no API call
    if (recipe.ingredients || recipe.steps) {
      setDetails({ ingredients: recipe.ingredients ?? [], steps: recipe.steps ?? [] });
      setDetailsLoading(false);
      return;
    }

    // 2. Check module-level cache (covers repeated taps on the same card)
    const cached = detailsCache.get(recipe.id);
    if (cached !== undefined) {
      setDetails(cached === false ? null : cached);
      setDetailsLoading(false);
      return;
    }

    setDetails(null);
    setDetailsLoading(true);

    const fetchDetails = async () => {
      // 3. Try Spoonacular by numeric ID (if Spoonacular sourced and not rate-limited)
      if (/^\d+$/.test(recipe.id)) {
        const spoon = await getRecipeDetails(recipe.id);
        if (spoon) {
          detailsCache.set(recipe.id, spoon);
          setDetails(spoon);
          setDetailsLoading(false);
          return;
        }
      }

      // 4. Free fallback: TheMealDB search by recipe name (no key, 200 req/day limit)
      const mdb = await getRecipeDetailsByName(recipe.name);
      if (mdb) {
        detailsCache.set(recipe.id, mdb);
        setDetails(mdb);
        setDetailsLoading(false);
        return;
      }

      // 5. Nothing worked
      detailsCache.set(recipe.id, false);
      setDetails(null);
      setDetailsLoading(false);
    };

    fetchDetails();
  }, [recipe?.id]);

  if (!recipe) return null;
  const hue = CUISINE_HUE[recipe.cuisine] ?? appColors.fat;

  return (
    <Modal visible animationType="slide" transparent>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={onClose} />
      <LinearGradient colors={appGradient.shell} style={{ borderTopLeftRadius: 28, borderTopRightRadius: 28,
        position: "absolute", bottom: 0, left: 0, right: 0, maxHeight: "88%" }}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {recipe.thumbnail ? (
            <Image source={{ uri: recipe.thumbnail }}
              style={{ width: "100%", height: 220, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
              resizeMode="cover" />
          ) : (
            <View style={{ height: 160, backgroundColor: `${hue}30`,
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: hue,
                alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="restaurant" size={32} color={appColors.paper} />
              </View>
            </View>
          )}

          <AnimatedPressable onPress={onClose} style={{ position: "absolute", top: 16, right: 16,
            width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.4)",
            alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="close" size={20} color={appColors.paper} />
          </AnimatedPressable>

          <View style={{ padding: 24, paddingBottom: 48, gap: 20 }}>
            <View>
              <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 24, color: appColors.onInk, marginBottom: 10 }}>
                {recipe.name}
              </Text>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Ionicons name="globe-outline" size={14} color={appColors.onInkSoft} />
                  <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.onInkSoft }}>{recipe.cuisine}</Text>
                </View>
                {recipe.prepTime !== "—" && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="time-outline" size={14} color={appColors.onInkSoft} />
                    <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.onInkSoft }}>{recipe.prepTime}</Text>
                  </View>
                )}
              </View>
            </View>

            {recipe.tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {recipe.tags.map((t) => (
                  <View key={t} style={{ backgroundColor: appColors.inkRaised, borderRadius: 8,
                    paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 12, color: appColors.fat }}>{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Nutrition */}
            {recipe.kcal > 0 ? (
              <View style={{ backgroundColor: appColors.paper, borderRadius: 18, padding: 20 }}>
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: appColors.textSoft,
                  letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 16 }}>
                  Nutrition per serving
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  {[
                    { label: "Energy",  value: recipe.kcal,      unit: "kcal", color: appColors.carb },
                    { label: "Protein", value: recipe.protein_g,  unit: "g",    color: appMacroColors.protein },
                    { label: "Carbs",   value: recipe.carbs_g,   unit: "g",    color: appMacroColors.carbs },
                    { label: "Fat",     value: recipe.fat_g,     unit: "g",    color: appMacroColors.fat },
                  ].map(({ label, value, unit, color }) => (
                    <View key={label} style={{ alignItems: "center", gap: 3 }}>
                      <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 24, color: appColors.text }}>{value}</Text>
                      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.textSoft }}>{unit}</Text>
                      <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 11, color }}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Ingredients & Steps */}
            {detailsLoading ? (
              <View style={{ alignItems: "center", paddingVertical: 20, gap: 10 }}>
                <ActivityIndicator size="small" color={appColors.fat} />
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.onInkSoft }}>
                  Loading recipe…
                </Text>
              </View>
            ) : details ? (
              <>
                {details.ingredients.length > 0 && (
                  <View>
                    <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: appColors.onInkSoft,
                      letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>
                      Ingredients
                    </Text>
                    <View style={{ gap: 8 }}>
                      {details.ingredients.map((ing, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: appColors.fat, marginTop: 6 }} />
                          <Text style={{ flex: 1, fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.onInk, lineHeight: 20 }}>
                            {ing.amount ? `${ing.amount} ` : ""}{ing.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {details.steps.length > 0 && (
                  <View>
                    <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: appColors.onInkSoft,
                      letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>
                      Instructions
                    </Text>
                    <View style={{ gap: 14 }}>
                      {details.steps.map((step, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: appColors.fat,
                            alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: appColors.inkText }}>
                              {i + 1}
                            </Text>
                          </View>
                          <Text style={{ flex: 1, fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.onInk,
                            lineHeight: 22, paddingTop: 3 }}>
                            {step}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View style={{ backgroundColor: appColors.inkRaised, borderRadius: 14, padding: 16, gap: 6 }}>
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.onInk }}>
                  Recipe steps not available
                </Text>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.onInkSoft }}>
                  {/^\d+$/.test(recipe.id)
                    ? "Couldn't load steps right now — API limit reached. Try again later or search this dish in the Foods tab."
                    : "Search for this dish in the Recipes tab to find a version with full ingredients and instructions."}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

// ── Recipe card (pressable) ────────────────────────────────────────────────────
function RecipeCard({ r, onPress }: { r: DR; onPress: () => void }) {
  const hue = CUISINE_HUE[r.cuisine] ?? appColors.fat;
  return (
    <AnimatedPressable onPress={onPress}
      style={{ backgroundColor: appColors.paper, borderRadius: 16, overflow: "hidden" }}>
      {r.thumbnail ? (
        <Image source={{ uri: r.thumbnail }} style={{ width: "100%", height: 80 }} resizeMode="cover" />
      ) : (
        <View style={{ height: 80, backgroundColor: `${hue}25`, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: hue,
            alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="restaurant" size={22} color={appColors.paper} />
          </View>
        </View>
      )}
      <View style={{ padding: 12 }}>
        <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.text, marginBottom: 4 }} numberOfLines={2}>
          {r.name}
        </Text>
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: "#8A8874", marginBottom: 7 }}>
          {r.cuisine} · {r.prepTime}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {r.tags.slice(0, 2).map((t) => (
            <View key={t} style={{ backgroundColor: `${TAG_COLOR[t] ?? appColors.fat}20`, borderRadius: 999,
              paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 9, color: TAG_COLOR[t] ?? appColors.fat }}>{t}</Text>
            </View>
          ))}
        </View>
        {r.kcal > 0 ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 15, color: appColors.text }}>
              {r.kcal}
            </Text>
            <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 9, color: "#8A8874" }}>kcal</Text>
          </View>
        ) : (
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.fat }}>Tap to view →</Text>
        )}
      </View>
    </AnimatedPressable>
  );
}

// ── Shared search bar ──────────────────────────────────────────────────────────
function SearchBar({ value, onChangeText, placeholder, loading }: {
  value: string; onChangeText: (v: string) => void; placeholder: string; loading?: boolean;
}) {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: appColors.inkRaised, borderRadius: 14, paddingHorizontal: 14, height: 48 }}>
        <Ionicons name="search-outline" size={16} color={appColors.onInkSoft} />
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder}
          placeholderTextColor={appColors.onInkSoft}
          style={{ flex: 1, fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.onInk }} />
        {loading && <ActivityIndicator size="small" color={appColors.fat} />}
      </View>
    </View>
  );
}

// ── Foods sub-tab ──────────────────────────────────────────────────────────────
function FoodsTab() {
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <View>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Add foods to your plan…" loading={searching} />
      {results.length > 0 ? (
        <View style={{ marginHorizontal: 20, backgroundColor: appColors.paper, borderRadius: 16, overflow: "hidden" }}>
          {results.slice(0, 10).map((item) => (
            <AnimatedPressable key={item.id} style={{
              flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13,
              borderBottomWidth: 0.5, borderBottomColor: appColors.divider }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.text }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.textSoft, marginTop: 2 }}>
                  {item.brand ?? "USDA, 2024"} · per 100 g
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", marginRight: 10 }}>
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text }}>
                  {item.kcalPer100g}{" "}<Text style={{ fontFamily: "PublicSans_400Regular", color: appColors.textSoft, fontSize: 10 }}>kcal</Text>
                </Text>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: appColors.textSoft, marginTop: 2 }}>
                  P {item.proteinPer100g}g · C {item.carbsPer100g}g · F {item.fatPer100g}g
                </Text>
              </View>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: appColors.fat,
                alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="add" size={16} color={appColors.inkText} />
              </View>
            </AnimatedPressable>
          ))}
        </View>
      ) : query.length === 0 ? (
        <View style={{ alignItems: "center", padding: 30, paddingTop: 34 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: appColors.inkRaised,
            alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Ionicons name="nutrition-outline" size={22} color={appColors.fat} />
          </View>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 14, color: appColors.onInk, marginBottom: 6 }}>
            Add foods to your plan
          </Text>
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.onInkSoft, textAlign: "center", lineHeight: 18 }}>
            Search the USDA database and your saved foods to build today's plan.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ── Bulk sheet upload (web file picker) ─────────────────────────────────────────
function pickAndParseSheet(): Promise<number> {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      reject(new Error("Sheet upload is available on the web app."));
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { resolve(0); return; }
      try {
        const buf = await file.arrayBuffer();
        const rows = parseRecipeSheet(buf);
        if (!rows.length) { reject(new Error("No valid rows found. Check the column headers.")); return; }
        resolve(addUserRecipes(rows));
      } catch (e) {
        reject(e instanceof Error ? e : new Error("Could not read that file."));
      }
    };
    input.click();
  });
}

// ── Manual add-recipe modal ─────────────────────────────────────────────────────
function ManualRecipeModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [name, setName]       = useState("");
  const [cuisine, setCuisine] = useState("");
  const [tags, setTags]       = useState("");
  const [prepTime, setPrep]   = useState("");
  const [kcal, setKcal]       = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs]     = useState("");
  const [fat, setFat]         = useState("");

  const reset = () => { setName(""); setCuisine(""); setTags(""); setPrep("");
    setKcal(""); setProtein(""); setCarbs(""); setFat(""); };
  const n = (v: string) => { const x = parseFloat(v); return Number.isFinite(x) ? x : 0; };

  const save = () => {
    if (!name.trim()) return;
    addUserRecipe({
      name: name.trim(),
      cuisine: cuisine.trim() || "International",
      tags: tags.split(/[,;]/).map((t) => t.trim()).filter(Boolean),
      kcal: n(kcal), protein_g: n(protein), carbs_g: n(carbs), fat_g: n(fat),
      prepTime: prepTime.trim() || "—",
    });
    reset();
    onClose();
  };

  const field = (label: string, value: string, set: (v: string) => void, opts?: { keyboard?: "numeric"; flex?: number; placeholder?: string }) => (
    <View style={{ flex: opts?.flex ?? 1, marginBottom: 12 }}>
      <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 11, color: appColors.onInkSoft, marginBottom: 5 }}>{label}</Text>
      <TextInput value={value} onChangeText={set} placeholder={opts?.placeholder}
        placeholderTextColor="#8A8874"
        keyboardType={opts?.keyboard === "numeric" ? "numeric" : "default"}
        style={{ backgroundColor: appColors.inkRaised, borderRadius: 12, paddingHorizontal: 12,
          paddingVertical: 10, fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.onInk }} />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: appColors.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "88%" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingBottom: 8 }}>
            <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 20, color: appColors.text }}>Add a recipe</Text>
            <Pressable onPress={onClose} hitSlop={10}><Ionicons name="close" size={24} color={appColors.text} /></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
            {field("Name*", name, setName, { placeholder: "Grilled salmon bowl" })}
            <View style={{ flexDirection: "row", gap: 12 }}>
              {field("Cuisine", cuisine, setCuisine, { placeholder: "Japanese" })}
              {field("Prep time", prepTime, setPrep, { placeholder: "25 min" })}
            </View>
            {field("Tags (comma-separated)", tags, setTags, { placeholder: "High Protein, Balanced" })}
            <View style={{ flexDirection: "row", gap: 12 }}>
              {field("Calories", kcal, setKcal, { keyboard: "numeric", placeholder: "0" })}
              {field("Protein (g)", protein, setProtein, { keyboard: "numeric", placeholder: "0" })}
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              {field("Carbs (g)", carbs, setCarbs, { keyboard: "numeric", placeholder: "0" })}
              {field("Fat (g)", fat, setFat, { keyboard: "numeric", placeholder: "0" })}
            </View>
            <AnimatedPressable onPress={save} scaleTo={0.97}
              style={{ backgroundColor: name.trim() ? appColors.fat : appColors.inkRaised, borderRadius: 14,
                paddingVertical: 14, alignItems: "center", marginTop: 8 }}>
              <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 14, color: name.trim() ? appColors.paper : "#8A8874" }}>
                Save recipe
              </Text>
            </AnimatedPressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Recipes sub-tab ────────────────────────────────────────────────────────────
function useUserRecipes(): UserRecipe[] {
  const [list, setList] = useState<UserRecipe[]>(getUserRecipes());
  useEffect(() => subscribeUserRecipes(() => setList([...getUserRecipes()])), []);
  return list;
}

function RecipesTab({ onSelect }: { onSelect: (r: DR) => void }) {
  const [search, setSearch]   = useState("");
  const userRecipes = useUserRecipes();
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [genPlan, setGenPlan] = useState<GeneratedPlan | null>(null);
  const [generating, setGenerating] = useState(false);

  // Spoonacular meal-plan generation (same engine as the Templates tab).
  const onGenerate = async () => {
    setGenerating(true);
    const kcal = 2000;
    let plan = await generateMealPlan(kcal, "");
    if (!plan) {
      // Local fallback: 3 mock recipes closest to a per-meal calorie target.
      const perMeal = kcal / 3;
      const picked = [...mockRecipes]
        .sort((a, b) => Math.abs(a.kcal - perMeal) - Math.abs(b.kcal - perMeal))
        .slice(0, 3);
      plan = {
        meals: picked.map((r) => ({ title: r.name, readyInMinutes: parseInt(r.prepTime) || 30 })),
        nutrients: {
          calories: picked.reduce((s, r) => s + r.kcal, 0),
          protein:  picked.reduce((s, r) => s + r.protein_g, 0),
          fat:      picked.reduce((s, r) => s + r.fat_g, 0),
          carbohydrates: picked.reduce((s, r) => s + r.carbs_g, 0),
        },
      };
    }
    setGenPlan(plan);
    setGenerating(false);
  };

  const onUpload = async () => {
    setUploading(true);
    try {
      const count = await pickAndParseSheet();
      if (count > 0 && Platform.OS === "web") {
        // eslint-disable-next-line no-alert
        window.alert(`Added ${count} recipe${count === 1 ? "" : "s"} from the sheet.`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed.";
      if (Platform.OS === "web") window.alert(msg); else Alert.alert("Upload", msg);
    } finally {
      setUploading(false);
    }
  };

  const [featured, setFeatured] = useState<DR[]>(
    featuredCache.length
      ? featuredCache
      : mockRecipes.map((r) => ({ ...r, thumbnail: undefined }))
  );
  const [liveResults, setLiveResults] = useState<DR[]>([]);
  const [loading, setLoading]         = useState(false);
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Upgrade featured cards to Spoonacular data (with real images + nutrition) once on first open
  useEffect(() => {
    if (featuredCache.length) return;
    searchRecipes("").then((results) => {
      if (results.length) {
        featuredCache = results.map(spoonToDR);
        setFeatured(featuredCache);
      }
    });
  }, []);

  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    if (search.length < 2) { setLiveResults([]); return; }
    setLoading(true);
    debRef.current = setTimeout(async () => {
      const spoon = await searchRecipes(search);
      if (spoon.length) {
        setLiveResults(spoon.map(spoonToDR));
      } else {
        const mdb = await searchMealDB(search);
        if (mdb.length) {
          setLiveResults(mdb.map(mealdbToDR));
        } else {
          setLiveResults(mockRecipes.filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(search.toLowerCase())
          ).map((r) => ({ ...r, thumbnail: undefined })));
        }
      }
      setLoading(false);
    }, 400);
  }, [search]);

  const q = search.toLowerCase();
  const matchedUser = search.length >= 2
    ? userRecipes.filter((r) =>
        r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)))
    : userRecipes;
  const display: DR[] = search.length >= 2
    ? [...matchedUser, ...liveResults]
    : [...userRecipes, ...featured];

  return (
    <View>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search by name, cuisine or tag…" loading={loading} />

      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 14 }}>
        <AnimatedPressable onPress={() => setShowAdd(true)} scaleTo={0.96}
          style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
            backgroundColor: appColors.fat, borderRadius: 12, paddingVertical: 11 }}>
          <Ionicons name="add" size={16} color={appColors.paper} />
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.paper }}>Add recipe</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={onUpload} scaleTo={0.96} disabled={uploading}
          style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
            backgroundColor: appColors.inkRaised, borderRadius: 12, paddingVertical: 11 }}>
          {uploading
            ? <ActivityIndicator size="small" color={appColors.onInk} />
            : <Ionicons name="cloud-upload-outline" size={16} color={appColors.onInk} />}
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.onInk }}>Upload sheet</Text>
        </AnimatedPressable>
      </View>
      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: appColors.onInkSoft,
        paddingHorizontal: 20, marginBottom: 14 }}>
        Sheet columns: {SHEET_COLUMNS.join(", ")} — only name is required.
      </Text>

      {/* Spoonacular meal-plan generator */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <AnimatedPressable onPress={() => !generating && onGenerate()} scaleTo={0.97}
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
            paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: appColors.fat,
            backgroundColor: `${appColors.fat}0D` }}>
          {generating ? (
            <><ActivityIndicator size="small" color={appColors.fat} />
            <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.fat }}>Generating…</Text></>
          ) : (
            <><Ionicons name={genPlan ? "refresh-outline" : "sparkles-outline"} size={15} color={appColors.fat} />
            <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.fat }}>
              {genPlan ? "Regenerate meal plan" : "Generate meal plan"}
            </Text></>
          )}
        </AnimatedPressable>

        {genPlan && (
          <View style={{ backgroundColor: appColors.paper, borderRadius: 14, padding: 16, marginTop: 10, gap: 8 }}>
            <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 10, color: "#8A8874",
              letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 4 }}>
              Suggested day · {Math.round(genPlan.nutrients.calories)} kcal
            </Text>
            {genPlan.meals.map((m, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: appColors.fat }} />
                <Text style={{ flex: 1, fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.text }}>{m.title}</Text>
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: "#8A8874" }}>{m.readyInMinutes} min</Text>
              </View>
            ))}
            <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: "#8A8874", marginTop: 4 }}>
              P {Math.round(genPlan.nutrients.protein)}g · C {Math.round(genPlan.nutrients.carbohydrates)}g · F {Math.round(genPlan.nutrients.fat)}g
            </Text>
          </View>
        )}
      </View>

      <ManualRecipeModal visible={showAdd} onClose={() => setShowAdd(false)} />

      <View style={{ paddingHorizontal: 20 }}>
        {chunk(display, 2).map((row, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {row.map((r) => (
              <View key={r.id} style={{ flex: 1 }}>
                <RecipeCard r={r} onPress={() => onSelect(r)} />
              </View>
            ))}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Equivalents sub-tab ────────────────────────────────────────────────────────
function macroDist(meal: PlanMeal, r: { kcal: number; protein_g: number; carbs_g: number; fat_g: number }) {
  return Math.abs(meal.kcal - r.kcal) / 10 +
    Math.abs(meal.protein_g - r.protein_g) +
    Math.abs(meal.carbs_g - r.carbs_g) +
    Math.abs(meal.fat_g - r.fat_g);
}

// The shared recipe pool the Equivalents tab draws from — the same recipes
// shown in the Recipes tab (your added recipes first, then the featured/live
// catalog). This is what connects the two tabs: equivalents ARE recipes, and
// tapping one opens the same recipe detail.
function recipePool(userRecipes: UserRecipe[]): DR[] {
  return [
    ...userRecipes,
    ...(featuredCache.length ? featuredCache : mockRecipes.map((r) => ({ ...r, thumbnail: undefined }))),
  ];
}

function EquivalentsTab({ onSelect }: { onSelect: (r: DR) => void }) {
  const userRecipes = useUserRecipes();
  const pool = recipePool(userRecipes);

  return (
    <View style={{ paddingHorizontal: 20, gap: 24 }}>
      {mockPlanMeals.map((meal) => {
        // Closest 3 recipes by macro distance — pulled straight from the pool.
        const alts = [...pool]
          .sort((a, b) => macroDist(meal, a) - macroDist(meal, b))
          .slice(0, 3);
        return (
          <View key={meal.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: appColors.carb }} />
              <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 14, color: appColors.onInk }}>{meal.meal_type}</Text>
              <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 14, color: appColors.onInkSoft }}>— {meal.name}</Text>
            </View>
            <View style={{ backgroundColor: appColors.inkRaised, borderRadius: 14, padding: 14, marginBottom: 10,
              borderLeftWidth: 3, borderLeftColor: appColors.carb }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.onInk }}>Assigned meal</Text>
                <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.carb }}>{meal.kcal} kcal</Text>
              </View>
              <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.onInkSoft, marginTop: 4 }}>
                P {meal.protein_g}g · C {meal.carbs_g}g · F {meal.fat_g}g
              </Text>
            </View>
            <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 11, color: appColors.onInkSoft,
              marginBottom: 8, letterSpacing: 0.6, textTransform: "uppercase" }}>
              Equivalent alternatives
            </Text>
            <View style={{ gap: 8 }}>
              {alts.map((alt) => {
                const hue = CUISINE_HUE[alt.cuisine] ?? appColors.fat;
                return (
                  <AnimatedPressable key={alt.id} onPress={() => onSelect(alt)}
                    style={{ backgroundColor: appColors.paper, borderRadius: 14, overflow: "hidden" }}>
                    {alt.thumbnail && (
                      <Image source={{ uri: alt.thumbnail }} style={{ width: "100%", height: 70 }} resizeMode="cover" />
                    )}
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                      {!alt.thumbnail && (
                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${hue}25`,
                          alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                          <Ionicons name="restaurant" size={18} color={hue} />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.text }} numberOfLines={1}>
                          {alt.name}
                        </Text>
                        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.textSoft, marginTop: 2 }}>
                          {alt.cuisine}{alt.kcal > 0 ? ` · P ${alt.protein_g}g · C ${alt.carbs_g}g · F ${alt.fat_g}g` : ""}
                        </Text>
                      </View>
                      {alt.kcal > 0 ? (
                        <View style={{ alignItems: "flex-end", marginLeft: 8 }}>
                          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 13, color: appColors.text }}>{alt.kcal}</Text>
                          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: appColors.textSoft }}>kcal</Text>
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={16} color="#8A8874" />
                      )}
                    </View>
                  </AnimatedPressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Templates sub-tab ──────────────────────────────────────────────────────────
function TemplatesTab() {
  const { role } = useAuth();
  // Dietitians get the practitioner template library + builder here.
  if (role === "dietitian") return <TemplateLibrary />;
  return <PatientTemplatesTab />;
}

function PatientTemplatesTab() {
  const [search, setSearch]       = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [genPlans, setGenPlans]   = useState<Map<string, GeneratedPlan>>(new Map());

  async function handleGenerate(id: string, kcal: number, tags: string[]) {
    setLoadingId(id);
    const diet = tags.map((t) => SPOON_DIETS[t]).find(Boolean) ?? "";
    let plan = await generateMealPlan(kcal, diet);

    if (!plan) {
      // Local fallback: pick 3 mock recipes closest to the calorie target
      const perMeal = kcal / 3;
      const picked = [...mockRecipes]
        .sort((a, b) => Math.abs(a.kcal - perMeal) - Math.abs(b.kcal - perMeal))
        .slice(0, 3);
      plan = {
        meals: picked.map((r) => ({ title: r.name, readyInMinutes: parseInt(r.prepTime) || 30 })),
        nutrients: {
          calories: picked.reduce((s, r) => s + r.kcal, 0),
          protein:  picked.reduce((s, r) => s + r.protein_g, 0),
          fat:      picked.reduce((s, r) => s + r.fat_g, 0),
          carbohydrates: picked.reduce((s, r) => s + r.carbs_g, 0),
        },
      };
    }

    setGenPlans((prev) => new Map(prev).set(id, plan!));
    setLoadingId(null);
  }

  const filtered = mockMealTemplates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search meal plan templates…" />
      <View style={{ marginHorizontal: 20, gap: 12 }}>
        {filtered.map((t) => {
          const plan = genPlans.get(t.id);
          return (
            <View key={t.id} style={{ backgroundColor: appColors.paper, borderRadius: 16, overflow: "hidden" }}>
              <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 14, color: appColors.text, marginBottom: 4 }}>{t.name}</Text>
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: "#8A8874", marginBottom: 8, lineHeight: 16 }} numberOfLines={2}>
                    {t.description}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                    {t.tags.map((tag) => (
                      <View key={tag} style={{ borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3,
                        backgroundColor: `${TAG_COLOR[tag] ?? appColors.fat}20` }}>
                        <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 9, color: TAG_COLOR[tag] ?? appColors.fat }}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={{ alignItems: "flex-end", minWidth: 46 }}>
                  <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 15, color: appColors.text }}>{t.kcal.toLocaleString()}</Text>
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 9, color: "#8A8874" }}>kcal</Text>
                </View>
              </View>

              <AnimatedPressable onPress={() => !loadingId && handleGenerate(t.id, t.kcal, t.tags)}
                style={{
                  flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  paddingVertical: 12, marginHorizontal: 14, marginBottom: 14, borderRadius: 999,
                  borderWidth: plan ? 0 : 0.5, borderColor: appColors.border,
                  backgroundColor: plan ? appColors.paperDim : "transparent",
                  opacity: loadingId !== null && loadingId !== t.id ? 0.5 : 1 }}>
                {loadingId === t.id ? (
                  <><ActivityIndicator size="small" color={appColors.fat} />
                  <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text }}>Generating…</Text></>
                ) : (
                  <><Ionicons name={plan ? "refresh-outline" : "sparkles-outline"} size={14} color={appColors.text} />
                  <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text }}>
                    {plan ? "Regenerate plan" : "Generate plan"}
                  </Text></>
                )}
              </AnimatedPressable>

              {plan && (
                <View style={{ borderTopWidth: 1, borderStyle: "dashed", borderTopColor: appColors.border, padding: 16, gap: 8 }}>
                  <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 10, color: "#8A8874",
                    letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 4 }}>
                    Today's meals · {Math.round(plan.nutrients.calories)} kcal
                  </Text>
                  {plan.meals.map((m, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: appColors.fat }} />
                      <Text style={{ flex: 1, fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.text }}>{m.title}</Text>
                      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: "#8A8874" }}>{m.readyInMinutes} min</Text>
                    </View>
                  ))}
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: "#8A8874", marginTop: 4 }}>
                    P {Math.round(plan.nutrients.protein)}g · C {Math.round(plan.nutrients.carbohydrates)}g · F {Math.round(plan.nutrients.fat)}g
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function MealsScreen() {
  const [activeTab, setActiveTab]       = useState<PlanTab>("Foods");
  const [selectedRecipe, setSelected]   = useState<DR | null>(null);

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 28, color: appColors.onInk }}>Meal plan</Text>
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.onInkSoft, marginTop: 4 }}>
          Build, explore and swap your meals
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
        <View style={{ flexDirection: "row", backgroundColor: appColors.inkRaised, borderRadius: 999, padding: 4 }}>
          {PLAN_TABS.map((tab) => (
            <AnimatedPressable key={tab} onPress={() => setActiveTab(tab)} scaleTo={0.94}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: "center" }}>
              <MotiView
                animate={{ opacity: activeTab === tab ? 1 : 0 }}
                transition={{ type: "timing", duration: 180 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 999, backgroundColor: appColors.paper }}
              />
              <Text style={{ fontFamily: activeTab === tab ? "PublicSans_600SemiBold" : "PublicSans_400Regular",
                fontSize: 11, color: activeTab === tab ? appColors.text : appColors.onInkSoft }}>
                {tab}
              </Text>
            </AnimatedPressable>
          ))}
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}>
        <MotiView key={activeTab} from={{ opacity: 0, translateY: 6 }} animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 220 }}>
          {activeTab === "Foods"       && <FoodsTab />}
          {activeTab === "Recipes"     && <RecipesTab onSelect={setSelected} />}
          {activeTab === "Equivalents" && <EquivalentsTab onSelect={setSelected} />}
          {activeTab === "Templates"   && <TemplatesTab />}
        </MotiView>
      </ScrollView>

      <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelected(null)} />
    </LinearGradient>
  );
}
