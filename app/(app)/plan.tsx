import {
  View, Text, TextInput, ScrollView, Pressable,
  ActivityIndicator, Image, Modal,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, macroColors } from "@/lib/tokens";
import { searchFood, FoodResult } from "@/lib/food/openFoodFacts";
import { searchLocal } from "@/lib/food/commonFoods";
import {
  searchRecipes, findEquivalents, generateMealPlan, getRecipeDetails,
  SPOON_DIETS, SpoonRecipe, GeneratedPlan, RecipeDetails,
} from "@/lib/food/spoonacular";
import { searchMealDB, getRecipeDetailsByName, MealDBRecipe } from "@/lib/food/mealdb";
import { mockRecipes, mockPlanMeals, mockMealTemplates, type PlanMeal } from "@/lib/mockData";

const PLAN_TABS = ["Foods", "Recipes", "Equivalents", "Templates"] as const;
type PlanTab = typeof PLAN_TABS[number];

type DR = {
  id: string; name: string; cuisine: string; tags: string[];
  kcal: number; protein_g: number; carbs_g: number; fat_g: number;
  prepTime: string; thumbnail?: string;
  ingredients?: Array<{ amount: string; name: string }>;
  steps?: string[];
};

const equivCache = new Map<string, DR[]>();
let featuredCache: DR[] = [];
// null = not fetched yet; false = fetched but failed/unavailable
const detailsCache = new Map<string, RecipeDetails | false>();

const CUISINE_HUE: Record<string, string> = {
  Indian: "#E07B39", Japanese: "#C44B3A", Mexican: "#F5A623",
  Greek: "#2D4A3E", Thai: "#7B68EE", Moroccan: "#C44B3A",
  Korean: "#E07B39", Brazilian: "#5A8A78", Italian: "#C44B3A",
  Ethiopian: "#8B6914", Lebanese: "#5A8A78", Vietnamese: "#2D4A3E",
  Peruvian: "#C44B3A", Turkish: "#E07B39", Canadian: "#5A8A78",
  International: "#5A8A78",
};

const TAG_COLOR: Record<string, string> = {
  "Vegan": colors.sage, "Keto": colors.clay, "Mediterranean": colors.forest,
  "High Protein": colors.forest, "Weight Loss": colors.clay, "Sports": colors.sage,
  "Diabetes": "#8B6914", "Cultural": colors.sage, "Bone Health": colors.sage,
  "Vegetarian": colors.sage, "Balanced": colors.forest,
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
  const hue = CUISINE_HUE[recipe.cuisine] ?? colors.sage;

  return (
    <Modal visible animationType="slide" transparent>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(28,25,23,0.5)" }} onPress={onClose} />
      <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        position: "absolute", bottom: 0, left: 0, right: 0, maxHeight: "88%" }}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {recipe.thumbnail ? (
            <Image source={{ uri: recipe.thumbnail }}
              style={{ width: "100%", height: 220, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
              resizeMode="cover" />
          ) : (
            <View style={{ height: 160, backgroundColor: `${hue}25`,
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: hue,
                alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="restaurant" size={32} color={colors.white} />
              </View>
            </View>
          )}

          <Pressable onPress={onClose} style={{ position: "absolute", top: 16, right: 16,
            width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(0,0,0,0.35)",
            alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="close" size={20} color={colors.white} />
          </Pressable>

          <View style={{ padding: 24, paddingBottom: 48, gap: 20 }}>
            <View>
              <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 26, color: colors.ink, marginBottom: 10 }}>
                {recipe.name}
              </Text>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Ionicons name="globe-outline" size={14} color={colors.stone} />
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.stone }}>{recipe.cuisine}</Text>
                </View>
                {recipe.prepTime !== "—" && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="time-outline" size={14} color={colors.stone} />
                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.stone }}>{recipe.prepTime}</Text>
                  </View>
                )}
              </View>
            </View>

            {recipe.tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {recipe.tags.map((t) => (
                  <View key={t} style={{ backgroundColor: `${colors.forest}15`, borderRadius: 8,
                    paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: colors.forest }}>{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Nutrition */}
            {recipe.kcal > 0 ? (
              <View style={{ backgroundColor: colors.linen, borderRadius: 18, padding: 20 }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.stone,
                  letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 16 }}>
                  Nutrition per serving
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  {[
                    { label: "Energy",  value: recipe.kcal,      unit: "kcal", color: colors.clay },
                    { label: "Protein", value: recipe.protein_g,  unit: "g",    color: macroColors.protein },
                    { label: "Carbs",   value: recipe.carbs_g,   unit: "g",    color: macroColors.carbs },
                    { label: "Fat",     value: recipe.fat_g,     unit: "g",    color: macroColors.fat },
                  ].map(({ label, value, unit, color }) => (
                    <View key={label} style={{ alignItems: "center", gap: 3 }}>
                      <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 26, color: colors.ink }}>{value}</Text>
                      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone }}>{unit}</Text>
                      <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color }}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Ingredients & Steps */}
            {detailsLoading ? (
              <View style={{ alignItems: "center", paddingVertical: 20, gap: 10 }}>
                <ActivityIndicator size="small" color={colors.forest} />
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone }}>
                  Loading recipe…
                </Text>
              </View>
            ) : details ? (
              <>
                {details.ingredients.length > 0 && (
                  <View>
                    <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.stone,
                      letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>
                      Ingredients
                    </Text>
                    <View style={{ gap: 8 }}>
                      {details.ingredients.map((ing, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sage, marginTop: 6 }} />
                          <Text style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: colors.ink, lineHeight: 20 }}>
                            {ing.amount ? `${ing.amount} ` : ""}{ing.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {details.steps.length > 0 && (
                  <View>
                    <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.stone,
                      letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>
                      Instructions
                    </Text>
                    <View style={{ gap: 14 }}>
                      {details.steps.map((step, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.forest,
                            alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.white }}>
                              {i + 1}
                            </Text>
                          </View>
                          <Text style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: colors.ink,
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
              <View style={{ backgroundColor: colors.linen, borderRadius: 14, padding: 16, gap: 6 }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.ink }}>
                  Recipe steps not available
                </Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone }}>
                  {/^\d+$/.test(recipe.id)
                    ? "Couldn't load steps right now — API limit reached. Try again later or search this dish in the Foods tab."
                    : "Search for this dish in the Recipes tab to find a version with full ingredients and instructions."}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Recipe card (pressable) ────────────────────────────────────────────────────
function RecipeCard({ r, onPress }: { r: DR; onPress: () => void }) {
  const hue = CUISINE_HUE[r.cuisine] ?? colors.sage;
  return (
    <Pressable onPress={onPress}
      style={({ pressed }) => ({ backgroundColor: colors.white, borderRadius: 18,
        overflow: "hidden", opacity: pressed ? 0.88 : 1,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 })}>
      {r.thumbnail ? (
        <Image source={{ uri: r.thumbnail }} style={{ width: "100%", height: 80 }} resizeMode="cover" />
      ) : (
        <View style={{ height: 80, backgroundColor: `${hue}20`, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: hue,
            alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="restaurant" size={22} color={colors.white} />
          </View>
        </View>
      )}
      <View style={{ padding: 12 }}>
        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.ink, marginBottom: 2 }} numberOfLines={2}>
          {r.name}
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginBottom: 6 }}>
          {r.cuisine} · {r.prepTime}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {r.tags.slice(0, 2).map((t) => (
            <View key={t} style={{ backgroundColor: `${colors.forest}15`, borderRadius: 6,
              paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 10, color: colors.forest }}>{t}</Text>
            </View>
          ))}
        </View>
        {r.kcal > 0 ? (
          <>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.ink }}>
              {r.kcal}{" "}<Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone }}>kcal</Text>
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginTop: 2 }}>
              P {r.protein_g}g · C {r.carbs_g}g · F {r.fat_g}g
            </Text>
          </>
        ) : (
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.sage }}>Tap to view →</Text>
        )}
      </View>
    </Pressable>
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
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10,
          backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 16, height: 50,
          shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}>
          <Ionicons name="search-outline" size={18} color={colors.stone} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Add foods to your plan…"
            placeholderTextColor={`${colors.stone}80`}
            style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: colors.ink }} />
          {searching && <ActivityIndicator size="small" color={colors.sage} />}
          {query.length > 0 && !searching && (
            <Pressable onPress={() => { setQuery(""); setResults([]); }}>
              <Ionicons name="close-circle" size={20} color={colors.stone} />
            </Pressable>
          )}
        </View>
      </View>
      {results.length > 0 ? (
        <View style={{ marginHorizontal: 20, backgroundColor: colors.white, borderRadius: 18, overflow: "hidden",
          shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
          {results.slice(0, 10).map((item) => (
            <Pressable key={item.id} style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14,
              backgroundColor: pressed ? `${colors.forest}06` : "transparent",
              borderBottomWidth: 1, borderBottomColor: "#F0EDE6" })}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.ink }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, marginTop: 2 }}>
                  {item.brand ?? "USDA, 2024"} · per 100 g
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", marginRight: 10 }}>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: colors.ink }}>
                  {item.kcalPer100g}{" "}<Text style={{ fontFamily: "Inter_400Regular", color: colors.stone, fontSize: 11 }}>kcal</Text>
                </Text>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginTop: 2 }}>
                  P {item.proteinPer100g}g · C {item.carbsPer100g}g · F {item.fatPer100g}g
                </Text>
              </View>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.forest,
                alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="add" size={18} color={colors.white} />
              </View>
            </Pressable>
          ))}
        </View>
      ) : query.length === 0 ? (
        <View style={{ paddingVertical: 56, alignItems: "center", gap: 12, paddingHorizontal: 40 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: `${colors.forest}15`,
            alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="nutrition-outline" size={32} color={colors.forest} />
          </View>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: colors.ink, textAlign: "center" }}>
            Add foods to your plan
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone, textAlign: "center", lineHeight: 20 }}>
            Search the USDA database and your saved foods to build your daily meal plan
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ── Recipes sub-tab ────────────────────────────────────────────────────────────
function RecipesTab({ onSelect }: { onSelect: (r: DR) => void }) {
  const [search, setSearch]   = useState("");
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

  const display = search.length >= 2 ? liveResults : featured;

  return (
    <View>
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10,
          backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 16, height: 50,
          shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}>
          <Ionicons name="search-outline" size={18} color={colors.stone} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search by name, cuisine or tag…"
            placeholderTextColor={`${colors.stone}80`}
            style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: colors.ink }} />
          {loading && <ActivityIndicator size="small" color={colors.sage} />}
        </View>
      </View>
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

function EquivalentsTab({ onSelect }: { onSelect: (r: DR) => void }) {
  const [results, setResults] = useState<Map<string, DR[]>>(new Map(equivCache));
  const [loading, setLoading] = useState(equivCache.size === 0);

  useEffect(() => {
    if (equivCache.size > 0) return;
    Promise.all(
      mockPlanMeals.map(async (meal) => {
        try {
          const spoon = await findEquivalents(meal.kcal, meal.protein_g, meal.carbs_g, meal.fat_g);
          const alts: DR[] = spoon.length ? spoon.map(spoonToDR)
            : [...mockRecipes].sort((a, b) => macroDist(meal, a) - macroDist(meal, b))
                .slice(0, 3).map((r) => ({ ...r, thumbnail: undefined }));
          return { id: meal.id, alts };
        } catch {
          const alts = [...mockRecipes]
            .sort((a, b) => macroDist(meal, a) - macroDist(meal, b))
            .slice(0, 3).map((r) => ({ ...r, thumbnail: undefined }));
          return { id: meal.id, alts };
        }
      })
    ).then((all) => {
      all.forEach(({ id, alts }) => equivCache.set(id, alts));
      setResults(new Map(equivCache));
      setLoading(false);
    }).catch(() => {
      mockPlanMeals.forEach((meal) => {
        const alts = [...mockRecipes]
          .sort((a, b) => macroDist(meal, a) - macroDist(meal, b))
          .slice(0, 3).map((r) => ({ ...r, thumbnail: undefined }));
        equivCache.set(meal.id, alts);
      });
      setResults(new Map(equivCache));
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <View style={{ paddingVertical: 60, alignItems: "center", gap: 12 }}>
      <ActivityIndicator size="large" color={colors.forest} />
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone }}>
        Finding alternatives via Spoonacular…
      </Text>
    </View>
  );

  return (
    <View style={{ paddingHorizontal: 20, gap: 24 }}>
      {mockPlanMeals.map((meal) => {
        const alts = results.get(meal.id) ?? [];
        return (
          <View key={meal.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.clay }} />
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.ink }}>{meal.meal_type}</Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone }}>— {meal.name}</Text>
            </View>
            <View style={{ backgroundColor: `${colors.clay}10`, borderRadius: 14, padding: 14, marginBottom: 10,
              borderLeftWidth: 3, borderLeftColor: colors.clay }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.ink }}>Assigned meal</Text>
                <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: colors.clay }}>{meal.kcal} kcal</Text>
              </View>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, marginTop: 4 }}>
                P {meal.protein_g}g · C {meal.carbs_g}g · F {meal.fat_g}g
              </Text>
            </View>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 11, color: colors.stone,
              marginBottom: 8, letterSpacing: 0.6, textTransform: "uppercase" }}>
              Equivalent alternatives
            </Text>
            <View style={{ gap: 8 }}>
              {alts.map((alt) => {
                const hue = CUISINE_HUE[alt.cuisine] ?? colors.sage;
                return (
                  <Pressable key={alt.id} onPress={() => onSelect(alt)}
                    style={({ pressed }) => ({ backgroundColor: colors.white, borderRadius: 14,
                      overflow: "hidden", opacity: pressed ? 0.88 : 1,
                      shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 })}>
                    {alt.thumbnail && (
                      <Image source={{ uri: alt.thumbnail }} style={{ width: "100%", height: 70 }} resizeMode="cover" />
                    )}
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                      {!alt.thumbnail && (
                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${hue}20`,
                          alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                          <Ionicons name="restaurant" size={18} color={hue} />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.ink }} numberOfLines={1}>
                          {alt.name}
                        </Text>
                        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginTop: 2 }}>
                          {alt.cuisine}{alt.kcal > 0 ? ` · P ${alt.protein_g}g · C ${alt.carbs_g}g · F ${alt.fat_g}g` : ""}
                        </Text>
                      </View>
                      {alt.kcal > 0 ? (
                        <View style={{ alignItems: "flex-end", marginLeft: 8 }}>
                          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 13, color: colors.ink }}>{alt.kcal}</Text>
                          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone }}>kcal</Text>
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={16} color={colors.stone} />
                      )}
                    </View>
                  </Pressable>
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
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10,
          backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 16, height: 50,
          shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}>
          <Ionicons name="search-outline" size={18} color={colors.stone} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search meal plan templates…"
            placeholderTextColor={`${colors.stone}80`}
            style={{ flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: colors.ink }} />
        </View>
      </View>
      <View style={{ marginHorizontal: 20, gap: 12 }}>
        {filtered.map((t) => {
          const plan = genPlans.get(t.id);
          return (
            <View key={t.id} style={{ backgroundColor: colors.white, borderRadius: 18, overflow: "hidden",
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", padding: 18 }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.ink, marginBottom: 3 }}>{t.name}</Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone, marginBottom: 8 }} numberOfLines={1}>
                    {t.description}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                    {t.tags.map((tag) => (
                      <View key={tag} style={{ borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3,
                        backgroundColor: `${TAG_COLOR[tag] ?? colors.sage}20` }}>
                        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 10, color: TAG_COLOR[tag] ?? colors.sage }}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 16, color: colors.ink }}>{t.kcal.toLocaleString()}</Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginBottom: 6 }}>kcal</Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: macroColors.fat }}>{t.fatPct}% Fat</Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: macroColors.carbs }}>{t.carbsPct}% Carbs</Text>
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 10, color: macroColors.protein }}>{t.proteinPct}% Protein</Text>
                </View>
              </View>

              <Pressable onPress={() => !loadingId && handleGenerate(t.id, t.kcal, t.tags)}
                style={({ pressed }) => ({
                  flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#F0EDE6",
                  backgroundColor: plan ? `${colors.forest}08` : "transparent",
                  opacity: pressed || (loadingId !== null && loadingId !== t.id) ? 0.5 : 1 })}>
                {loadingId === t.id ? (
                  <><ActivityIndicator size="small" color={colors.forest} />
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.forest }}>Generating…</Text></>
                ) : (
                  <><Ionicons name={plan ? "refresh-outline" : "sparkles-outline"} size={16} color={colors.forest} />
                  <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors.forest }}>
                    {plan ? "Regenerate Plan" : "Generate Plan"}
                  </Text></>
                )}
              </Pressable>

              {plan && (
                <View style={{ borderTopWidth: 1, borderTopColor: "#F0EDE6", padding: 16, gap: 8 }}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.stone,
                    letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 4 }}>
                    Today's meals · {Math.round(plan.nutrients.calories)} kcal
                  </Text>
                  {plan.meals.map((m, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.forest }} />
                      <Text style={{ flex: 1, fontFamily: "Inter_500Medium", fontSize: 13, color: colors.ink }}>{m.title}</Text>
                      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone }}>{m.readyInMinutes} min</Text>
                    </View>
                  ))}
                  <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginTop: 4 }}>
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
    <View style={{ flex: 1, backgroundColor: colors.linen }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 36, color: colors.ink }}>Meal Plan</Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone, marginTop: 4 }}>
          Build, explore and swap your meals
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", backgroundColor: colors.white, borderRadius: 14, padding: 4,
          shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
          {PLAN_TABS.map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center",
                backgroundColor: activeTab === tab ? colors.forest : "transparent" }}>
              <Text style={{ fontFamily: activeTab === tab ? "Inter_600SemiBold" : "Inter_400Regular",
                fontSize: 12, color: activeTab === tab ? colors.white : colors.stone }}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}>
        {activeTab === "Foods"       && <FoodsTab />}
        {activeTab === "Recipes"     && <RecipesTab onSelect={setSelected} />}
        {activeTab === "Equivalents" && <EquivalentsTab onSelect={setSelected} />}
        {activeTab === "Templates"   && <TemplatesTab />}
      </ScrollView>

      <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelected(null)} />
    </View>
  );
}
