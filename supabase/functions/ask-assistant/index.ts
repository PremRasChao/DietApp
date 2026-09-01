// Server-side proxy for the nutrition assistant chat.
//
// This exists so the Mistral API key never reaches the client bundle (the
// old lib/ai/assistant.ts called Mistral directly with an
// EXPO_PUBLIC_MISTRAL_API_KEY, which Expo inlines into shipped JS — anyone
// could pull it out and burn the quota). Here the key is a Supabase secret
// only this function can read, the caller must be a real authenticated
// user, and requests are rate-limited server-side (not just in the app UI).
//
// Deploy:
//   supabase functions deploy ask-assistant
//   supabase secrets set MISTRAL_API_KEY=your-key-here
//
// Requires supabase/migrations/20260826_security_hardening.sql to be
// applied first (it defines the rate_limit_attempts table and
// check_rate_limit() function used below).

import { createClient } from "npm:@supabase/supabase-js@2";

const MODEL = "mistral-small-latest";
const ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const MAX_MESSAGES_PER_WINDOW = 20;
const WINDOW_SECONDS = 600; // 10 minutes

const SYSTEM_PROMPT =
  "You are Nutritionwize's friendly nutrition assistant. Give concise, practical, " +
  "evidence-based guidance on food, meals, macros, and healthy habits. Keep answers " +
  "short and encouraging. You are not a doctor — for medical concerns, advise the user " +
  "to consult their dietitian or physician.";

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

type ChatTurn = { role: "user" | "model"; text: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Verify the caller is a real signed-in user (rejects the dev-bypass fake
  // session too — it has no valid JWT, so it never reaches this function
  // successfully, which is fine: dev bypass never needed real chat access).
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData?.user) {
    return json({ error: "Not authenticated." }, 401);
  }
  const userId = userData.user.id;

  // Server-side rate limit, keyed by the real user id — not bypassable by
  // reloading the page or calling this function directly, unlike the
  // client-side chatRateLimit.ts guard.
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: allowed, error: rateError } = await adminClient.rpc("check_rate_limit", {
    p_bucket: "ask_assistant",
    p_identifier: userId,
    p_max: MAX_MESSAGES_PER_WINDOW,
    p_window_seconds: WINDOW_SECONDS,
  });
  if (rateError) {
    console.error("[ask-assistant] rate limit check failed", rateError);
    return json({ error: "Assistant temporarily unavailable. Try again shortly." }, 500);
  }
  if (!allowed) {
    return json({ error: "You've hit the message limit. Try again in a few minutes." }, 429);
  }

  const key = Deno.env.get("MISTRAL_API_KEY") ?? "";
  if (!key) {
    console.error("[ask-assistant] MISTRAL_API_KEY secret not set");
    return json({ error: "Assistant isn't configured yet. Contact support." }, 500);
  }

  let history: ChatTurn[];
  try {
    const body = await req.json();
    if (!Array.isArray(body.history)) throw new Error("history must be an array");
    history = body.history;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((t) => ({ role: t.role === "model" ? "assistant" : "user", content: t.text })),
  ];

  let mistralRes: Response;
  try {
    mistralRes = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 800 }),
    });
  } catch {
    return json({ error: "Network error reaching the assistant. Try again." }, 502);
  }

  if (!mistralRes.ok) {
    console.error("[ask-assistant] Mistral request failed", mistralRes.status);
    return json({ error: `Assistant request failed (${mistralRes.status}).` }, 502);
  }

  const data = await mistralRes.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content?.trim();
  if (!text) return json({ error: "The assistant didn't return a reply. Try rephrasing." }, 502);

  return json({ text });
});
