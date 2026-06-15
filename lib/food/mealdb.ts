import { canRequest, recordRequest } from "@/lib/rateLimit";

const BASE = "https://www.themealdb.com/api/json/v1/1";

export type MealDBRecipe = {
  id: string;
  name: string;
  cuisine: string;
  tags: string[];
  thumbnail: string | null;
  // No macro data available from TheMealDB
};

// Search recipes by name. Returns [] on rate limit or error.
export async function searchMealDB(query: string): Promise<MealDBRecipe[]> {
  if (!canRequest("mealdb")) return [];
  recordRequest("mealdb");

  try {
    const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.meals) return [];

    return (data.meals as any[]).map((m) => ({
      id: m.idMeal,
      name: m.strMeal,
      cuisine: m.strArea ?? "International",
      tags: [m.strCategory, m.strArea].filter(Boolean) as string[],
      thumbnail: m.strMealThumb ?? null,
    }));
  } catch {
    return [];
  }
}

export type MealDBDetails = {
  ingredients: Array<{ amount: string; name: string }>;
  steps: string[];
};

// Fetch full recipe details (ingredients + steps) by recipe name via TheMealDB.
// Returns null if not found or rate-limited.
export async function getRecipeDetailsByName(name: string): Promise<MealDBDetails | null> {
  if (!canRequest("mealdb")) return null;
  recordRequest("mealdb");

  try {
    const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.meals?.length) return null;

    const m = data.meals[0];

    const ingredients: Array<{ amount: string; name: string }> = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = (m[`strIngredient${i}`] ?? "").trim();
      const measure    = (m[`strMeasure${i}`]    ?? "").trim();
      if (ingredient) ingredients.push({ amount: measure, name: ingredient });
    }

    const raw: string = m.strInstructions ?? "";
    const steps = raw
      .split(/\r?\n+/)
      .map((s: string) => s.replace(/^STEP\s*\d+\.?\s*/i, "").trim())
      .filter((s: string) => s.length > 15);

    return { ingredients, steps: steps.length ? steps : [raw.trim()] };
  } catch {
    return null;
  }
}

// Get random recipes. Used for default recipe browsing.
export async function getRandomMeals(count = 6): Promise<MealDBRecipe[]> {
  if (!canRequest("mealdb")) return [];

  const calls = Array.from({ length: Math.min(count, 6) }, async () => {
    if (!canRequest("mealdb")) return null;
    recordRequest("mealdb");
    try {
      const res = await fetch(`${BASE}/random.php`);
      if (!res.ok) return null;
      const data = await res.json();
      const m = data.meals?.[0];
      if (!m) return null;
      return {
        id: m.idMeal,
        name: m.strMeal,
        cuisine: m.strArea ?? "International",
        tags: [m.strCategory, m.strArea].filter(Boolean) as string[],
        thumbnail: m.strMealThumb ?? null,
      } as MealDBRecipe;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(calls);
  return results.filter((r): r is MealDBRecipe => r !== null);
}
