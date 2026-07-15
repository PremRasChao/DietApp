import { Session, User } from "@supabase/supabase-js";

// Temporary: real Google/Apple sign-in isn't wired up yet (missing OAuth client IDs).
// Flip to false once login works end-to-end.
export const DEV_BYPASS_AUTH = false;

// Flip to "dietitian" to preview the dietitian dashboard without a real sign-in.
export const DEV_ROLE: "patient" | "dietitian" = "patient";

export const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

const devUser: User = {
  id: DEV_USER_ID,
  app_metadata: {},
  user_metadata: { role: DEV_ROLE },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "dev@example.com",
} as User;

export const DEV_SESSION: Session = {
  access_token: "dev-bypass-token",
  refresh_token: "dev-bypass-refresh",
  expires_in: 60 * 60 * 24 * 365,
  expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
  token_type: "bearer",
  user: devUser,
};

// ── Temporary dietitian access ──────────────────────────────────────────────
// A stand-in dietitian "ID" that lets us walk through the dietitian experience
// before the real allowlist/RPC backend is wired up. Entering this in the
// Dietitian verification screen drops straight into the dietitian shell.
// Remove once real dietitian provisioning is live.
export const TEMP_DIETITIAN_ID = "DEMO-DIET";

const tempDietitianUser: User = {
  id: "00000000-0000-0000-0000-0000000000d1",
  app_metadata: {},
  user_metadata: { role: "dietitian", full_name: "Demo Dietitian" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "demo.dietitian@nutritionwize.app",
} as User;

export const TEMP_DIETITIAN_SESSION: Session = {
  access_token: "temp-dietitian-token",
  refresh_token: "temp-dietitian-refresh",
  expires_in: 60 * 60 * 24 * 365,
  expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
  token_type: "bearer",
  user: tempDietitianUser,
};
