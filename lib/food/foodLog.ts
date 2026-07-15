import { supabase } from "@/lib/supabase/client";
import { DEV_BYPASS_AUTH, DEV_USER_ID } from "@/lib/auth/devBypass";

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

async function getUserId(): Promise<string> {
  if (DEV_BYPASS_AUTH) return DEV_USER_ID;
  const { data } = await supabase.auth.getUser();
  if (!data.user?.id) throw new Error("Not authenticated");
  return data.user.id;
}

export async function logFood(input: LogFoodInput) {
  const user_id = await getUserId();
  const { error } = await supabase.from("food_logs").insert({ ...input, user_id });
  if (error) throw error;
}

export async function getTodayLogs(): Promise<FoodLogEntry[]> {
  const user_id = await getUserId();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", user_id)
    .gte("logged_at", today.toISOString())
    .order("logged_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function deleteLog(id: string) {
  const { error } = await supabase.from("food_logs").delete().eq("id", id);
  if (error) throw error;
}
