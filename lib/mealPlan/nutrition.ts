import { FoodRow, Meal, Nutrition } from "@/lib/mealPlan/types";
import type { FoodResult } from "@/lib/food/openFoodFacts";

export const EMPTY_NUTRITION: Nutrition = {
  calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0,
};

function add(a: Nutrition, b: Nutrition): Nutrition {
  return {
    calories: a.calories + b.calories,
    proteinG: a.proteinG + b.proteinG,
    carbsG: a.carbsG + b.carbsG,
    fatG: a.fatG + b.fatG,
    fiberG: a.fiberG + b.fiberG,
  };
}

export function rowNutrition(r: FoodRow): Nutrition {
  return {
    calories: r.calories, proteinG: r.proteinG,
    carbsG: r.carbsG, fatG: r.fatG, fiberG: r.fiberG,
  };
}

export function mealNutrition(meal: Meal): Nutrition {
  return meal.foods.reduce((acc, r) => add(acc, rowNutrition(r)), { ...EMPTY_NUTRITION });
}

export function dayNutrition(meals: Meal[]): Nutrition {
  return meals.reduce((acc, m) => add(acc, mealNutrition(m)), { ...EMPTY_NUTRITION });
}

// Build a FoodRow from a food-database item scaled to a gram quantity.
// Fiber isn't in the common-foods dataset, so it defaults to 0 for now.
export function foodRowFromResult(
  food: FoodResult,
  quantityG: number,
  fiberPer100g = 0
): Omit<FoodRow, "id"> {
  const k = quantityG / 100;
  const round1 = (n: number) => Math.round(n * 10) / 10;
  return {
    foodName: food.name,
    quantityG,
    calories: Math.round(food.kcalPer100g * k),
    proteinG: round1(food.proteinPer100g * k),
    carbsG: round1(food.carbsPer100g * k),
    fatG: round1(food.fatPer100g * k),
    fiberG: round1(fiberPer100g * k),
  };
}

// Whole-numbers percentages of calories per macro (for library card summaries).
export function macroPercents(n: Nutrition): { protein: number; carbs: number; fat: number } {
  const s = macroCalorieSplit(n);
  return {
    protein: Math.round(s.protein * 100),
    carbs: Math.round(s.carbs * 100),
    fat: Math.round(s.fat * 100),
  };
}

// Share of total calories contributed by each macro (protein/carbs/fat = 4/4/9).
// Used to size the macro-distribution donut.
export function macroCalorieSplit(n: Nutrition): { protein: number; carbs: number; fat: number } {
  const p = n.proteinG * 4;
  const c = n.carbsG * 4;
  const f = n.fatG * 9;
  const total = p + c + f;
  if (total <= 0) return { protein: 0, carbs: 0, fat: 0 };
  return { protein: p / total, carbs: c / total, fat: f / total };
}
