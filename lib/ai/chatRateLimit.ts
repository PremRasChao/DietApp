// In-memory rate limiter for assistant chat messages.
//
// This only slows down accidental abuse from the app's own UI — it resets on
// reload and is trivially bypassed by calling askAssistant() directly from
// devtools with the bundle's inlined API key. It is NOT a substitute for
// real protection: the actual fix is proxying askAssistant() through a
// backend (e.g. a Supabase Edge Function) that holds the Mistral key server
// -side and rate-limits per authenticated user. Keep this as a UX guardrail
// only.
const MAX_MESSAGES = 15;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

let count = 0;
let windowStart = Date.now();

function maybeReset() {
  if (Date.now() - windowStart > WINDOW_MS) {
    count = 0;
    windowStart = Date.now();
  }
}

export function canSendMessage(): boolean {
  maybeReset();
  return count < MAX_MESSAGES;
}

export function recordMessage() {
  maybeReset();
  count++;
}

export function remainingMessages(): number {
  maybeReset();
  return Math.max(0, MAX_MESSAGES - count);
}
