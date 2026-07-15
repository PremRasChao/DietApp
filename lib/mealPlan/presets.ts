import { MealTypePreset } from "@/lib/mealPlan/types";

// Predefined meal types for the "Add new meal" flow (PRD §4).
// Default time is used at insertion and stays editable afterward.
export const MEAL_TYPE_PRESETS: MealTypePreset[] = [
  { id: "breakfast",       label: "Breakfast",          defaultTime: "08:00", sortOrder: 1 },
  { id: "brunch",          label: "Brunch",             defaultTime: "10:00", sortOrder: 2 },
  { id: "morning-snack",   label: "Morning snack",      defaultTime: "10:30", sortOrder: 3 },
  { id: "lunch",           label: "Lunch",              defaultTime: "12:30", sortOrder: 4 },
  { id: "afternoon-snack", label: "Afternoon snack",    defaultTime: "15:30", sortOrder: 5 },
  { id: "pre-workout",     label: "Pre-workout snack",  defaultTime: "16:30", sortOrder: 6 },
  { id: "post-workout",    label: "Post-workout snack", defaultTime: "18:00", sortOrder: 7 },
  { id: "dinner",          label: "Dinner",             defaultTime: "19:30", sortOrder: 8 },
  { id: "supper",          label: "Supper",             defaultTime: "21:00", sortOrder: 9 },
];

export function getPreset(id: string): MealTypePreset | undefined {
  return MEAL_TYPE_PRESETS.find((p) => p.id === id);
}
