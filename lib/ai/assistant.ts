// Nutrition-assistant client — calls the ask-assistant Supabase Edge
// Function, which holds the Mistral API key server-side and rate-limits
// per authenticated user. The key never reaches the client bundle.
// See supabase/functions/ask-assistant/index.ts.

import { supabase } from "@/lib/supabase/client";

export type ChatRole = "user" | "model";
export type ChatTurn = { role: ChatRole; text: string };

export class AssistantError extends Error {}

// Send the conversation history and return the assistant's reply text.
export async function askAssistant(history: ChatTurn[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ask-assistant", {
    body: { history },
  });

  if (error) {
    // FunctionsHttpError carries the response status; unwrap the server's
    // { error } body when available for a more useful message.
    const context = (error as { context?: Response }).context;
    if (context) {
      try {
        const body = await context.json();
        if (typeof body?.error === "string") throw new AssistantError(body.error);
      } catch {
        // fall through to generic message below
      }
    }
    throw new AssistantError("Assistant request failed. Please try again.");
  }

  const text: string | undefined = data?.text;
  if (!text) throw new AssistantError("The assistant didn't return a reply. Try rephrasing.");
  return text;
}
