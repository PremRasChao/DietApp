import { useSyncExternalStore } from "react";
import { FoodRow, Meal, Template } from "@/lib/mealPlan/types";
import { MEAL_TYPE_PRESETS, getPreset } from "@/lib/mealPlan/presets";
import { foodRowFromResult } from "@/lib/mealPlan/nutrition";
import { COMMON_FOODS } from "@/lib/food/commonFoods";
import { loadTemplates, saveTemplates } from "@/lib/mealPlan/persist";

// ── Store ────────────────────────────────────────────────────────────────────
// Templates plan a single repeating "Every day" meal list. Edits mutate here
// and notify subscribers so the library and editor screens stay in sync.

let templates: Template[] = [];
const listeners = new Set<() => void>();

function emit() {
  templates = [...templates]; // new identity for useSyncExternalStore
  saveTemplates(templates);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// Meals are always kept sorted by time so the day reads as a timeline.
export function sortMeals(meals: Meal[]): Meal[] {
  return [...meals].sort((a, b) => a.time.localeCompare(b.time));
}

// ── Seed data ────────────────────────────────────────────────────────────────
function food(id: string, grams: number): Omit<FoodRow, "id"> {
  const f = COMMON_FOODS.find((x) => x.id === id) ?? COMMON_FOODS[0];
  return foodRowFromResult(f, grams);
}

function meal(presetId: string, foods: Omit<FoodRow, "id">[], notes = ""): Meal {
  const p = getPreset(presetId)!;
  return {
    id: uid("meal"),
    presetId,
    title: p.label,
    time: p.defaultTime,
    notes,
    foods: foods.map((f) => ({ ...f, id: uid("food") })),
  };
}

function seedTemplate(name: string, source: string, meals: Meal[]): Template {
  const now = Date.now();
  return { id: uid("tpl"), name, source, meals: sortMeals(meals), createdAt: now, updatedAt: now };
}

function seed() {
  if (templates.length) return;

  const saved = loadTemplates();
  if (saved !== null) {
    templates = saved;
    return;
  }

  templates = [
    seedTemplate("High-Protein Weight Loss", "My templates", [
      meal("breakfast", [food("l-yogurt", 170), food("l-oats", 40), food("l-banana", 118)], "Greek yogurt parfait with oats."),
      meal("lunch", [food("l-chicken-breast", 140), food("l-quinoa", 100), food("l-chickpeas", 80)]),
      meal("afternoon-snack", [food("l-almonds", 20)]),
      meal("dinner", [food("l-salmon", 150), food("l-rice-brown", 150)]),
    ]),
    seedTemplate("Balanced Mediterranean", "My templates", [
      meal("breakfast", [food("l-egg-whole", 100), food("l-bread-whole", 56)]),
      meal("lunch", [food("l-tuna-can", 85), food("l-pasta", 150)]),
      meal("dinner", [food("l-tofu", 150), food("l-rice-white", 150)]),
    ]),
    seedTemplate("1200 kcal Ketogenic meal plan", "System templates", [
      meal("breakfast", [food("l-egg-whole", 100), food("l-almonds", 20)]),
      meal("lunch", [food("l-chicken-breast", 120), food("l-tofu", 100)]),
      meal("dinner", [food("l-salmon", 150)]),
    ]),
  ];
  saveTemplates(templates);
}
seed();

// ── Reads ────────────────────────────────────────────────────────────────────
export function useTemplates(): Template[] {
  return useSyncExternalStore(subscribe, () => templates, () => templates);
}

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function useTemplate(id: string): Template | undefined {
  useSyncExternalStore(subscribe, () => templates, () => templates);
  return getTemplate(id);
}

// ── Writes ───────────────────────────────────────────────────────────────────
export function createTemplate(name = "Meal plan template"): Template {
  const now = Date.now();
  const t: Template = { id: uid("tpl"), name, source: "My templates", meals: [], createdAt: now, updatedAt: now };
  templates = [t, ...templates];
  emit();
  return t;
}

export function duplicateTemplate(id: string): Template | undefined {
  const src = getTemplate(id);
  if (!src) return;
  const now = Date.now();
  const copy: Template = {
    ...src,
    id: uid("tpl"),
    name: `${src.name} (copy)`,
    source: "My templates",
    createdAt: now,
    updatedAt: now,
    meals: src.meals.map((m) => ({
      ...m, id: uid("meal"),
      foods: m.foods.map((f) => ({ ...f, id: uid("food") })),
    })),
  };
  templates = [copy, ...templates];
  emit();
  return copy;
}

export function deleteTemplate(id: string) {
  templates = templates.filter((t) => t.id !== id);
  emit();
}

function update(id: string, fn: (t: Template) => void) {
  const t = getTemplate(id);
  if (!t) return;
  fn(t);
  t.updatedAt = Date.now();
  emit();
}

export function renameTemplate(id: string, name: string) {
  update(id, (t) => { t.name = name; });
}

export function addMeal(templateId: string, presetId: string) {
  update(templateId, (t) => {
    const p = getPreset(presetId);
    if (!p) return;
    const m: Meal = { id: uid("meal"), presetId, title: p.label, time: p.defaultTime, notes: "", foods: [] };
    t.meals = sortMeals([...t.meals, m]);
  });
}

export function deleteMeal(templateId: string, mealId: string) {
  update(templateId, (t) => { t.meals = t.meals.filter((m) => m.id !== mealId); });
}

function editMeal(templateId: string, mealId: string, fn: (m: Meal) => void) {
  update(templateId, (t) => {
    const m = t.meals.find((x) => x.id === mealId);
    if (!m) return;
    fn(m);
    t.meals = sortMeals(t.meals); // re-order in case time changed
  });
}

export function setMealTime(templateId: string, mealId: string, time: string) {
  editMeal(templateId, mealId, (m) => { m.time = time; });
}

export function setMealNotes(templateId: string, mealId: string, notes: string) {
  editMeal(templateId, mealId, (m) => { m.notes = notes; });
}

export function addFood(templateId: string, mealId: string, row: Omit<FoodRow, "id">) {
  editMeal(templateId, mealId, (m) => { m.foods = [...m.foods, { ...row, id: uid("food") }]; });
}

export function deleteFood(templateId: string, mealId: string, foodId: string) {
  editMeal(templateId, mealId, (m) => { m.foods = m.foods.filter((f) => f.id !== foodId); });
}

export { MEAL_TYPE_PRESETS };
