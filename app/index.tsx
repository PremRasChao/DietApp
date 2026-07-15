import { useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth/AuthContext";
import { colors } from "@/lib/tokens";

// Web OAuth returns to the app root with a `?code=...` (or `?error=...`) that
// the Supabase client exchanges for a session asynchronously. During that
// window `isLoggedIn` is briefly false — we must NOT bounce to marketing, or
// this screen unmounts before the session lands and the user is stranded.
function oauthCallbackState(): "code" | "error" | null {
  if (Platform.OS !== "web" || typeof window === "undefined") return null;
  const q = window.location.search + window.location.hash;
  if (/[?&#]error=/.test(q)) return "error";
  if (/[?&#]code=/.test(q)) return "code";
  return null;
}

// Pull the human-readable reason Supabase/Google sent back on a failed
// redirect, so the failure is visible instead of a silent bounce.
function reportOAuthError() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(
    window.location.search + "&" + window.location.hash.replace(/^#/, "")
  );
  const desc =
    params.get("error_description") || params.get("error") || "unknown error";
  console.error("[OAuth callback error]", desc, window.location.href);
  window.alert(`Sign in failed: ${decodeURIComponent(desc)}`);
}

// Root entry point — routes to the right section once auth resolves. Role is
// assigned server-side (dietitian allowlist), so there's no client-side role
// write here; the (app) shell reads role from the auth context.
export default function Root() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isLoggedIn) {
      router.replace("/(app)");
      return;
    }

    // Logged out. If we're mid-OAuth-callback, wait for the code exchange to
    // finish — the session will arrive via onAuthStateChange, isLoggedIn flips
    // true, and this effect re-runs to route into the app.
    const callback = oauthCallbackState();
    if (callback === "code") {
      // Keep the spinner up while the code exchange completes. Safety net: if
      // no session arrives (exchange failed silently), fall back to sign-in.
      const t = setTimeout(() => router.replace("/(auth)"), 6000);
      return () => clearTimeout(t);
    }
    // On an explicit OAuth error (or no callback at all), fall back to the
    // sign-in picker on error, otherwise the marketing home.
    if (callback === "error") {
      reportOAuthError();
      router.replace("/(auth)");
    } else {
      router.replace("/(marketing)");
    }
  }, [isLoggedIn, isLoading]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.linen }}>
      <ActivityIndicator size="large" color={colors.forest} />
    </View>
  );
}
