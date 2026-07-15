// Data model for the practitioner meal plan builder (see PRD).
// V1 is in-memory only — persistence is a second-pass concern.

export type FoodRow = {
  id: string;
  foodName: string;
  quantityG: number;      // grams
  calories: number;       // absolute totals for this row (already scaled by quantity)
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

export type Meal = {
  id: string;
  presetId: string;       // MealTypePreset.id this meal was created from
  title: string;
  time: string;           // "HH:MM" 24h, editable
  notes: string;
  foods: FoodRow[];
};

// A template holds one "Every day" meal list (see reference UI — the builder
// plans a single repeating day, not seven independent days).
export type Template = {
  id: string;
  name: string;
  source: string;         // "My templates" | "System templates"
  meals: Meal[];
  createdAt: number;
  updatedAt: number;
};

export type MealTypePreset = {
  id: string;
  label: string;
  defaultTime: string;    // "HH:MM"
  sortOrder: number;
};

// Computed nutrition totals for a meal, day, or template.
export type Nutrition = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};
