// In-memory rate limiter for dietitian code verification attempts.
// Resets on app restart (acceptable for a code-entry gate, not a password).
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

let count = 0;
let windowStart = Date.now();

function maybeReset() {
  if (Date.now() - windowStart > WINDOW_MS) {
    count = 0;
    windowStart = Date.now();
  }
}

export function canAttempt(): boolean {
  maybeReset();
  return count < MAX_ATTEMPTS;
}

export function recordAttempt() {
  maybeReset();
  count++;
}

export function remaining(): number {
  maybeReset();
  return Math.max(0, MAX_ATTEMPTS - count);
}

export function isLocked(): boolean {
  maybeReset();
  return count >= MAX_ATTEMPTS;
}
