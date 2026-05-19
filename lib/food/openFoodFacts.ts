// Uses USDA FoodData Central — fast, relevance-sorted, 300k+ foods
const USDA_KEY = process.env.EXPO_PUBLIC_USDA_KEY ?? "DEMO_KEY";

const cache = new Map<string, FoodResult[]>();

export type FoodResult = {
  id: string;
  name: string;
  brand: string | null;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  servingG: number;
};

type UsdaNutrient = { nutrientId: number; value: number };

function getNutrient(nutrients: UsdaNutrient[], id: number): number {
  return nutrients.find((n) => n.nutrientId === id)?.value ?? 0;
}

export async function searchFood(query: string): Promise<FoodResult[]> {
  if (!query.trim()) return [];
  const key = query.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  const url =
    `https://api.nal.usda.gov/fdc/v1/foods/search` +
    `?query=${encodeURIComponent(query)}` +
    `&pageSize=25` +
    `&dataType=Foundation,SR%20Legacy,Survey%20(FNDDS),Branded` +
    `&api_key=${USDA_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Food search failed");
  const data = await res.json();

  const results = (data.foods ?? [])
    .filter((f: any) => f.description && getNutrient(f.foodNutrients ?? [], 1008) > 0)
    .map((f: any) => {
      const nutrients: UsdaNutrient[] = f.foodNutrients ?? [];
      // USDA values are per 100g for Foundation/SR Legacy, per serving for Branded
      const kcal   = Math.round(getNutrient(nutrients, 1008));
      const protein = Math.round(getNutrient(nutrients, 1003) * 10) / 10;
      const carbs   = Math.round(getNutrient(nutrients, 1005) * 10) / 10;
      const fat     = Math.round(getNutrient(nutrients, 1004) * 10) / 10;
      const serving = f.servingSize ? Math.round(f.servingSize) : 100;

      return {
        id: String(f.fdcId ?? Math.random()),
        name: f.description
          .split(",")
          .map((w: string) => w.trim().charAt(0).toUpperCase() + w.trim().slice(1).toLowerCase())
          .join(", "),
        brand: f.brandName?.trim() || f.brandOwner?.trim() || null,
        kcalPer100g: kcal,
        proteinPer100g: protein,
        carbsPer100g: carbs,
        fatPer100g: fat,
        servingG: serving,
      };
    });
  cache.set(key, results);
  return results;
}
