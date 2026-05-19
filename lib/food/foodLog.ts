import { supabase } from "@/lib/supabase/client";

// Placeholder until real auth is wired up
const PLACEHOLDER_USER_ID = "00000000-0000-0000-0000-000000000001";

export type FoodLogEntry = {
  id: string;
  food_name: string;
  brand: string | null;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  serving_g: number;
  meal_type: string | null;
  logged_at: string;
};

export type LogFoodInput = Omit<FoodLogEntry, "id" | "logged_at">;

export async function logFood(input: LogFoodInput) {
  const { error } = await supabase.from("food_logs").insert({
    ...input,
    user_id: PLACEHOLDER_USER_ID,
  });
  if (error) throw error;
}

export async function getTodayLogs(): Promise<FoodLogEntry[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", PLACEHOLDER_USER_ID)
    .gte("logged_at", today.toISOString())
    .order("logged_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function deleteLog(id: string) {
  const { error } = await supabase.from("food_logs").delete().eq("id", id);
  if (error) throw error;
}
