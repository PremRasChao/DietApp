import { canRequest, recordRequest } from "@/lib/rateLimit";
import { supabase } from "@/lib/supabase/client";

const cache = new Map<string, FoodResult[]>();

export type FoodResult = {
  id: string;
  name: string;
  brand: string | null;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  servingG: number; // typical serving size for reference (grams)
};

type UsdaNutrient = { nutrientId: number; value: number };

function getNutrient(nutrients: UsdaNutrient[], id: number): number {
  return nutrients.find((n) => n.nutrientId === id)?.value ?? 0;
}

function formatName(raw: string): string {
  return raw
    .split(",")
    .map((part) => {
      const t = part.trim();
      return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
    })
    .join(", ");
}

export async function searchFood(query: string): Promise<FoodResult[]> {
  if (!query.trim()) return [];
  const key = query.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key)!;
  if (!canRequest("usda")) throw new Error("USDA daily request limit reached (500/day)");
  recordRequest("usda");

  // Requests go through the food-proxy Supabase Edge Function, which holds
  // the USDA key server-side — see supabase/functions/food-proxy.
  const { data, error } = await supabase.functions.invoke("food-proxy", {
    body: {
      provider: "usda",
      params: {
        query,
        pageSize: "25",
        dataType: "Foundation,SR Legacy,Survey (FNDDS),Branded",
      },
    },
  });
  if (error) throw new Error("Food search failed");

  const results: FoodResult[] = (data.foods ?? [])
    .filter((f: any) => {
      const nutrients: UsdaNutrient[] = f.foodNutrients ?? [];
      const kcal = getNutrient(nutrients, 1008);
      // Filter out results with 0 calories or suspiciously high values (>900 kcal/100g)
      return f.description && kcal > 0 && kcal <= 900;
    })
    .map((f: any) => {
      const nutrients: UsdaNutrient[] = f.foodNutrients ?? [];
      // USDA search endpoint normalizes all values to per 100g
      const kcal    = Math.round(getNutrient(nutrients, 1008));
      const protein = Math.round(getNutrient(nutrients, 1003) * 10) / 10;
      const carbs   = Math.round(getNutrient(nutrients, 1005) * 10) / 10;
      const fat     = Math.round(getNutrient(nutrients, 1004) * 10) / 10;

      // Use declared serving size if available and reasonable (5g–1000g), else default 100g
      const rawServing = f.servingSize ? Number(f.servingSize) : 100;
      const serving = rawServing >= 5 && rawServing <= 1000 ? Math.round(rawServing) : 100;

      return {
        id: String(f.fdcId ?? Math.random()),
        name: formatName(f.description),
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
