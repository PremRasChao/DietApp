// In-memory daily request counter — resets on app restart.
// Enforces free-tier limits to prevent unexpected API charges.

type Service = "spoonacular" | "usda" | "mealdb";

const DAILY_LIMITS: Record<Service, number> = {
  spoonacular: 100, // free tier: 150 pts/day — capped at 100 for safety
  usda:        500, // free tier: 3,600 req/hr — capped at 500/day
  mealdb:      200, // free with no hard limit — soft cap to stay polite
};

const counts: Record<Service, { date: string; count: number }> = {
  spoonacular: { date: "", count: 0 },
  usda:        { date: "", count: 0 },
  mealdb:      { date: "", count: 0 },
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function reset(service: Service): void {
  const t = today();
  if (counts[service].date !== t) counts[service] = { date: t, count: 0 };
}

export function canRequest(service: Service): boolean {
  reset(service);
  return counts[service].count < DAILY_LIMITS[service];
}

export function recordRequest(service: Service): void {
  reset(service);
  counts[service].count += 1;
}

export function remaining(service: Service): number {
  reset(service);
  return Math.max(0, DAILY_LIMITS[service] - counts[service].count);
}
