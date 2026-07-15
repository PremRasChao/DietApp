import { Platform } from "react-native";
import * as XLSX from "xlsx";

// User-created recipes (manual add + Excel/CSV bulk upload).
// Web persists to localStorage (the practitioner demo); native keeps them
// in-memory for the session. Mirrors lib/mealPlan/persist.ts.

export type UserRecipe = {
  id: string; name: string; cuisine: string; tags: string[];
  kcal: number; protein_g: number; carbs_g: number; fat_g: number;
  prepTime: string;
  ingredients?: Array<{ amount: string; name: string }>;
  steps?: string[];
};

const KEY = "nutritionwize.userRecipes.v1";

let recipes: UserRecipe[] = [];
const listeners = new Set<() => void>();

function ls(): Storage | null {
  if (Platform.OS !== "web") return null;
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

function persist() {
  const store = ls();
  if (!store) return;
  try { store.setItem(KEY, JSON.stringify(recipes)); } catch { /* quota — non-fatal */ }
}

function load() {
  const store = ls();
  if (!store) return;
  try {
    const raw = store.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) recipes = parsed as UserRecipe[];
    }
  } catch { /* ignore */ }
}
load();

export function getUserRecipes(): UserRecipe[] {
  return recipes;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  persist();
  listeners.forEach((fn) => fn());
}

export function addUserRecipe(r: Omit<UserRecipe, "id">): UserRecipe {
  const created: UserRecipe = { ...r, id: `ur_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` };
  recipes = [created, ...recipes];
  emit();
  return created;
}

export function addUserRecipes(rows: Array<Omit<UserRecipe, "id">>): number {
  const created = rows.map((r, i) => ({
    ...r, id: `ur_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
  }));
  recipes = [...created, ...recipes];
  emit();
  return created.length;
}

export function removeUserRecipe(id: string) {
  recipes = recipes.filter((r) => r.id !== id);
  emit();
}

// ── Sheet parsing ──────────────────────────────────────────────────────────────
// Expected columns (header row, case-insensitive): name, cuisine, tags, kcal,
// protein_g, carbs_g, fat_g, prepTime. Only `name` is required.
// tags may be comma- or semicolon-separated. ingredients / steps optional,
// separated by "|".
export const SHEET_COLUMNS = [
  "name", "cuisine", "tags", "kcal", "protein_g", "carbs_g", "fat_g", "prepTime",
] as const;

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function list(v: unknown, sep = /[,;|]/): string[] {
  return String(v ?? "").split(sep).map((s) => s.trim()).filter(Boolean);
}

export function parseRecipeSheet(data: ArrayBuffer): Array<Omit<UserRecipe, "id">> {
  const wb = XLSX.read(data, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  return rows.map((raw) => {
    // Normalize keys to lowercase for tolerant column matching.
    const row: Record<string, unknown> = {};
    for (const k of Object.keys(raw)) row[k.trim().toLowerCase()] = raw[k];

    return {
      name: String(row["name"] ?? "").trim(),
      cuisine: String(row["cuisine"] ?? "International").trim() || "International",
      tags: list(row["tags"]),
      kcal: num(row["kcal"]),
      protein_g: num(row["protein_g"] ?? row["protein"]),
      carbs_g: num(row["carbs_g"] ?? row["carbs"]),
      fat_g: num(row["fat_g"] ?? row["fat"]),
      prepTime: String(row["preptime"] ?? row["prep time"] ?? "").trim() || "—",
      ingredients: list(row["ingredients"], /[|;]/).map((name) => ({ amount: "", name })),
      steps: list(row["steps"], /[|]/),
    };
  }).filter((r) => r.name.length > 0);
}
