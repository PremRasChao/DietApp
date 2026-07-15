// Nutrition-assistant client backed by Mistral AI's chat completions API.
//
// SECURITY: the key comes from EXPO_PUBLIC_MISTRAL_API_KEY, which Expo inlines
// into the client bundle — so it is *not* secret in a shipped app. Fine for a
// demo; for production, proxy the call through a backend that holds the key
// server-side. Keep the key out of source control (gitignored .env) — never log it.

const KEY = process.env.EXPO_PUBLIC_MISTRAL_API_KEY ?? "";
const MODEL = "mistral-small-latest";
const ENDPOINT = "https://api.mistral.ai/v1/chat/completions";

export const assistantConfigured = KEY.length > 0;

export type ChatRole = "user" | "model";
export type ChatTurn = { role: ChatRole; text: string };

const SYSTEM_PROMPT =
  "You are Nutritionwize's friendly nutrition assistant. Give concise, practical, " +
  "evidence-based guidance on food, meals, macros, and healthy habits. Keep answers " +
  "short and encouraging. You are not a doctor — for medical concerns, advise the user " +
  "to consult their dietitian or physician.";

export class AssistantError extends Error {}

// Send the conversation history and return the assistant's reply text.
export async function askAssistant(history: ChatTurn[]): Promise<string> {
  if (!assistantConfigured) {
    throw new AssistantError("Missing EXPO_PUBLIC_MISTRAL_API_KEY — add it to your .env.");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((t) => ({ role: t.role === "model" ? "assistant" : "user", content: t.text })),
  ];

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 800 }),
    });
  } catch {
    throw new AssistantError("Network error — check your connection and try again.");
  }

  if (!res.ok) {
    // Don't leak the raw body (it can echo request details).
    if (res.status === 401) throw new AssistantError("The Mistral API key was rejected. Check EXPO_PUBLIC_MISTRAL_API_KEY.");
    if (res.status === 429) throw new AssistantError("Rate limit reached — give it a moment and try again.");
    throw new AssistantError(`Assistant request failed (${res.status}).`);
  }

  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new AssistantError("The assistant didn't return a reply. Try rephrasing.");
  return text;
}
