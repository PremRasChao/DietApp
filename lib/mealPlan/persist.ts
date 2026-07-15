import { Platform } from "react-native";
import type { Template } from "@/lib/mealPlan/types";

// Local persistence for meal plan templates.
// Web uses localStorage (covers the practitioner demo). Native has no
// dependency-free store large enough here, so it falls back to in-memory —
// swap this seam for a Supabase-backed store once real dietitian auth exists.

const KEY = "nutritionwize.mealPlanTemplates.v1";

function ls(): Storage | null {
  if (Platform.OS !== "web") return null;
  if (typeof localStorage === "undefined") return null; // SSR / static render
  return localStorage;
}

export function loadTemplates(): Template[] | null {
  const store = ls();
  if (!store) return null;
  try {
    const raw = store.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Template[]) : null;
  } catch {
    return null;
  }
}

export function saveTemplates(templates: Template[]) {
  const store = ls();
  if (!store) return;
  try {
    store.setItem(KEY, JSON.stringify(templates));
  } catch {
    // Quota or serialization error — non-fatal for the builder.
  }
}
