// Server-side proxy for third-party food/recipe APIs (Spoonacular, USDA).
//
// Same reason as ask-assistant: EXPO_PUBLIC_SPOONACULAR_KEY and
// EXPO_PUBLIC_USDA_KEY were shipped in the client bundle, extractable via
// dev tools, letting anyone burn your Spoonacular quota (a paid tier) by
// calling the upstream API directly with the lifted key. This function
// holds both keys server-side, requires a real authenticated user, and
// rate-limits per user. It's a thin passthrough — it returns the exact
// upstream JSON unmodified so the existing client-side parsing in
// lib/food/spoonacular.ts and lib/food/openFoodFacts.ts doesn't change.
//
// Deploy:
//   supabase functions deploy food-proxy
//   supabase secrets set SPOONACULAR_KEY=your-key-here
//   (USDA_KEY is optional — falls back to USDA's public DEMO_KEY, same as
//   the client did before)
//
// Requires supabase/migrations/20260826_security_hardening.sql to be
// applied first (defines check_rate_limit()).

import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_REQUESTS_PER_WINDOW = 60;
const WINDOW_SECONDS = 600; // 10 minutes

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// Only these upstream paths are reachable through this proxy — prevents the
// `path` field from being used to reach arbitrary Spoonacular endpoints.
const SPOONACULAR_PATHS = [
  "/recipes/complexSearch",
  "/recipes/findByNutrients",
  "/mealplanner/generate",
];
const SPOONACULAR_RECIPE_INFO = /^\/recipes\/\d+\/information$/;

function isAllowedSpoonacularPath(path: string): boolean {
  return SPOONACULAR_PATHS.includes(path) || SPOONACULAR_RECIPE_INFO.test(path);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData?.user) {
    return json({ error: "Not authenticated." }, 401);
  }
  const userId = userData.user.id;

  let body: { provider?: string; path?: string; params?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  const { provider, path, params } = body;
  if (provider !== "spoonacular" && provider !== "usda") {
    return json({ error: "Unknown provider." }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: allowed, error: rateError } = await adminClient.rpc("check_rate_limit", {
    p_bucket: `food:${provider}`,
    p_identifier: userId,
    p_max: MAX_REQUESTS_PER_WINDOW,
    p_window_seconds: WINDOW_SECONDS,
  });
  if (rateError) {
    console.error("[food-proxy] rate limit check failed", rateError);
    return json({ error: "Temporarily unavailable. Try again shortly." }, 500);
  }
  if (!allowed) {
    return json({ error: "Rate limit reached. Try again in a few minutes." }, 429);
  }

  let upstreamUrl: string;
  if (provider === "spoonacular") {
    if (typeof path !== "string" || !isAllowedSpoonacularPath(path)) {
      return json({ error: "Unknown or disallowed path." }, 400);
    }
    const key = Deno.env.get("SPOONACULAR_KEY") ?? "";
    if (!key) return json({ error: "Spoonacular isn't configured yet." }, 500);
    const qp = new URLSearchParams({ ...(params ?? {}), apiKey: key });
    upstreamUrl = `https://api.spoonacular.com${path}?${qp}`;
  } else {
    const key = Deno.env.get("USDA_KEY") ?? "DEMO_KEY";
    const qp = new URLSearchParams({ ...(params ?? {}), api_key: key });
    upstreamUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?${qp}`;
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl);
  } catch {
    return json({ error: "Network error reaching the upstream API." }, 502);
  }

  const data = await upstreamRes.json().catch(() => null);
  return json(data, upstreamRes.status);
});
