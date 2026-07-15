import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import {
  DEV_BYPASS_AUTH,
  DEV_ROLE,
  DEV_SESSION,
  TEMP_DIETITIAN_SESSION,
} from "@/lib/auth/devBypass";

type Role = "patient" | "dietitian";

type AuthValue = {
  session: Session | null;
  role: Role | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  // Temporary dietitian access, until real dietitian provisioning is live.
  startTempDietitian: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

// Fetch the server-assigned role from profiles. Role is authoritative here —
// it's set by the handle_new_user trigger from the dietitian allowlist, never
// from client-supplied data.
async function fetchRole(userId: string): Promise<Role | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data.role === "dietitian" ? "dietitian" : "patient";
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(
    DEV_BYPASS_AUTH ? DEV_SESSION : undefined
  );
  const [role, setRole] = useState<Role | null>(DEV_BYPASS_AUTH ? DEV_ROLE : null);
  // Distinguishes "role not fetched yet" from "fetched, user has no profile row".
  const [roleResolved, setRoleResolved] = useState<boolean>(DEV_BYPASS_AUTH);
  // Temporary dietitian demo session (activated from the verification screen).
  const [tempDietitian, setTempDietitian] = useState(false);

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, next) => setSession(next)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;
    if (session === undefined) return; // still resolving session

    if (!session) {
      setRole(null);
      setRoleResolved(true);
      return;
    }

    let cancelled = false;
    setRoleResolved(false);
    fetchRole(session.user.id).then((r) => {
      if (cancelled) return;
      setRole(r);
      setRoleResolved(true);
    });
    return () => { cancelled = true; };
  }, [session]);

  async function signOut() {
    setTempDietitian(false);
    await supabase.auth.signOut();
  }

  // The temp dietitian session short-circuits the real auth state entirely.
  const value: AuthValue = tempDietitian
    ? {
        session: TEMP_DIETITIAN_SESSION,
        role: "dietitian",
        isLoggedIn: true,
        isLoading: false,
        startTempDietitian: () => setTempDietitian(true),
        signOut,
      }
    : {
        session: session ?? null,
        role,
        isLoggedIn: !!session,
        isLoading: session === undefined || !roleResolved,
        startTempDietitian: () => setTempDietitian(true),
        signOut,
      };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within a SessionProvider");
  return ctx;
}
