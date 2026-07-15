import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { DEV_BYPASS_AUTH, DEV_SESSION } from "@/lib/auth/devBypass";

export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(
    DEV_BYPASS_AUTH ? DEV_SESSION : undefined
  );

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading: session === undefined };
}
