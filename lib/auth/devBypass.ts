import { Session, User } from "@supabase/supabase-js";

// Temporary: real Google/Apple sign-in isn't wired up yet (missing OAuth client IDs).
// Flip to false once login works end-to-end.
export const DEV_BYPASS_AUTH = true;

// Flip to "dietitian" to preview the dietitian dashboard without a real sign-in.
export const DEV_ROLE: "patient" | "dietitian" = "dietitian";

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
