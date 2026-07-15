// In-memory request counter — resets on app restart.
// Enforces plan limits to prevent unexpected API charges.

type Service = "spoonacular" | "usda" | "mealdb";
type Period = "day" | "month";

const LIMITS: Record<Service, { period: Period; max: number }> = {
  spoonacular: { period: "month", max: 3000 }, // paid tier: 3,000 req/month
  usda:        { period: "day",   max: 500 },  // free tier: 3,600 req/hr — capped at 500/day
  mealdb:      { period: "day",   max: 200 },  // free with no hard limit — soft cap to stay polite
};

const counts: Record<Service, { key: string; count: number }> = {
  spoonacular: { key: "", count: 0 },
  usda:        { key: "", count: 0 },
  mealdb:      { key: "", count: 0 },
};

function periodKey(period: Period): string {
  const iso = new Date().toISOString();
  return period === "month" ? iso.slice(0, 7) : iso.slice(0, 10);
}

function reset(service: Service): void {
  const key = periodKey(LIMITS[service].period);
  if (counts[service].key !== key) counts[service] = { key, count: 0 };
}

export function canRequest(service: Service): boolean {
  reset(service);
  return counts[service].count < LIMITS[service].max;
}

export function recordRequest(service: Service): void {
  reset(service);
  counts[service].count += 1;
}

export function remaining(service: Service): number {
  reset(service);
  return Math.max(0, LIMITS[service].max - counts[service].count);
}
