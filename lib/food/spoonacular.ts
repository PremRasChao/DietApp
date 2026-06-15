import { canRequest, recordRequest } from "@/lib/rateLimit";

const BASE = "https://api.spoonacular.com";
const KEY  = process.env.EXPO_PUBLIC_SPOONACULAR_KEY ?? "";

export type SpoonRecipe = {
  id: string;
  name: string;
  cuisine: string;
  tags: string[];
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  prepTime: string;
  thumbnail?: string;
  ingredients?: Array<{ amount: string; name: string }>;
  steps?: string[];
};

export type GeneratedMeal = { title: string; readyInMinutes: number };
export type GeneratedPlan = {
  meals: GeneratedMeal[];
  nutrients: { calories: number; protein: number; fat: number; carbohydrates: number };
};

function nutrient(list: Array<{ name: string; amount: number }>, name: string): number {
  return Math.round(list.find((n) => n.name === name)?.amount ?? 0);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Search recipes with full nutrition data. Returns [] on rate limit or error.
export async function searchRecipes(query: string, diet?: string): Promise<SpoonRecipe[]> {
  if (!KEY || !canRequest("spoonacular")) return [];
  recordRequest("spoonacular");

  const p = new URLSearchParams({
    query: query || "healthy",
    addRecipeNutrition: "true",
    addRecipeInformation: "true",
    number: "12",
    apiKey: KEY,
    ...(diet ? { diet } : {}),
  });

  try {
    const res = await fetch(`${BASE}/recipes/complexSearch?${p}`);
    if (!res.ok) return [];
    const data = await res.json();

    return (data.results ?? []).map((r: any) => {
      const n: Array<{ name: string; amount: number }> = r.nutrition?.nutrients ?? [];

      const ingredients = (r.extendedIngredients ?? []).map((ing: any) => ({
        amount: `${ing.amount ?? ""} ${ing.unit ?? ""}`.trim(),
        name: ing.originalName ?? ing.name ?? "",
      }));

      const steps: string[] = [];
      for (const group of (r.analyzedInstructions ?? [])) {
        for (const step of (group.steps ?? [])) {
          if (step.step) steps.push(step.step);
        }
      }

      return {
        id: String(r.id),
        name: r.title,
        cuisine: r.cuisines?.[0] ?? "International",
        tags: (r.diets ?? []).slice(0, 3).map(capitalize),
        kcal: nutrient(n, "Calories"),
        protein_g: nutrient(n, "Protein"),
        carbs_g: nutrient(n, "Carbohydrates"),
        fat_g: nutrient(n, "Fat"),
        prepTime: `${r.readyInMinutes ?? "?"} min`,
        thumbnail: r.image ?? undefined,
        ingredients: ingredients.length ? ingredients : undefined,
        steps: steps.length ? steps : undefined,
      };
    });
  } catch {
    return [];
  }
}

// Find recipes matching given macros within ±30%. Returns [] on rate limit or error.
export async function findEquivalents(
  kcal: number,
  protein_g: number,
  carbs_g: number,
  fat_g: number
): Promise<SpoonRecipe[]> {
  if (!KEY || !canRequest("spoonacular")) return [];
  recordRequest("spoonacular");

  const tol = 0.3;
  const p = new URLSearchParams({
    minCalories: String(Math.round(kcal * (1 - tol))),
    maxCalories: String(Math.round(kcal * (1 + tol))),
    minProtein:  String(Math.round(protein_g * (1 - tol))),
    maxProtein:  String(Math.round(protein_g * (1 + tol))),
    minCarbs:    String(Math.round(carbs_g * (1 - tol))),
    maxCarbs:    String(Math.round(carbs_g * (1 + tol))),
    number: "3",
    apiKey: KEY,
  });

  try {
    const res = await fetch(`${BASE}/recipes/findByNutrients?${p}`);
    if (!res.ok) return [];
    const data: Array<{
      id: number; title: string; calories: number;
      protein: string; carbs: string; fat: string; image: string;
    }> = await res.json();

    return data.map((r) => ({
      id: String(r.id),
      name: r.title,
      cuisine: "International",
      tags: [],
      kcal: r.calories,
      protein_g: parseFloat(r.protein),
      carbs_g: parseFloat(r.carbs),
      fat_g: parseFloat(r.fat),
      prepTime: "—",
      thumbnail: r.image ?? undefined,
    }));
  } catch {
    return [];
  }
}

export type RecipeDetails = {
  ingredients: Array<{ amount: string; name: string }>;
  steps: string[];
};

// Fetch full recipe details (ingredients + steps). Returns null on rate limit or error.
export async function getRecipeDetails(id: string): Promise<RecipeDetails | null> {
  if (!KEY || !canRequest("spoonacular")) return null;
  recordRequest("spoonacular");

  try {
    const res = await fetch(`${BASE}/recipes/${id}/information?apiKey=${KEY}`);
    if (!res.ok) return null;
    const data = await res.json();

    const ingredients = (data.extendedIngredients ?? []).map((ing: any) => ({
      amount: `${ing.amount ?? ""} ${ing.unit ?? ""}`.trim(),
      name: ing.originalName ?? ing.name ?? "",
    }));

    const steps: string[] = [];
    for (const group of (data.analyzedInstructions ?? [])) {
      for (const step of (group.steps ?? [])) {
        if (step.step) steps.push(step.step);
      }
    }

    return { ingredients, steps };
  } catch {
    return null;
  }
}

// Supported Spoonacular diet strings
export const SPOON_DIETS: Record<string, string> = {
  "Vegan": "vegan",
  "Keto": "ketogenic",
  "Vegetarian": "vegetarian",
  "Pescetarian": "pescetarian",
  "Paleo": "paleo",
};

// Generate a day's meal plan. Tries /mealplanner/generate first; falls back to
// complexSearch (3 meals sized to hit the calorie target) if that endpoint fails.
export async function generateMealPlan(
  targetCalories: number,
  diet: string
): Promise<GeneratedPlan | null> {
  if (!KEY || !canRequest("spoonacular")) return null;
  recordRequest("spoonacular");

  // Primary: dedicated meal-planner endpoint
  try {
    const p = new URLSearchParams({
      timeFrame: "day",
      targetCalories: String(targetCalories),
      apiKey: KEY,
      ...(diet ? { diet } : {}),
    });
    const res = await fetch(`${BASE}/mealplanner/generate?${p}`);
    if (res.ok) {
      const data = await res.json();
      if (data.meals?.length) return data as GeneratedPlan;
    }
  } catch {}

  // Fallback: search for 3 recipes that match the diet and split the calorie target
  if (!canRequest("spoonacular")) return null;
  recordRequest("spoonacular");

  const perMeal = Math.round(targetCalories / 3);
  const tol = 0.45;
  const sp = new URLSearchParams({
    addRecipeNutrition: "true",
    number: "3",
    apiKey: KEY,
    minCalories: String(Math.round(perMeal * (1 - tol))),
    maxCalories: String(Math.round(perMeal * (1 + tol))),
    ...(diet ? { diet } : {}),
  });

  try {
    const res = await fetch(`${BASE}/recipes/complexSearch?${sp}`);
    if (!res.ok) return null;
    const data = await res.json();
    const results: any[] = data.results ?? [];
    if (!results.length) return null;

    const nutrients = results.reduce(
      (acc, r) => {
        const n: Array<{ name: string; amount: number }> = r.nutrition?.nutrients ?? [];
        const get = (name: string) => n.find((x) => x.name === name)?.amount ?? 0;
        return {
          calories:      acc.calories      + get("Calories"),
          protein:       acc.protein       + get("Protein"),
          fat:           acc.fat           + get("Fat"),
          carbohydrates: acc.carbohydrates + get("Carbohydrates"),
        };
      },
      { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }
    );

    return {
      meals: results.map((r) => ({
        title: r.title,
        readyInMinutes: r.readyInMinutes ?? 30,
      })),
      nutrients,
    };
  } catch {
    return null;
  }
}
