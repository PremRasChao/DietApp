import { useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "@/lib/auth/useSession";
import { supabase } from "@/lib/supabase/client";
import { colors } from "@/lib/tokens";

// Root entry point — handles web OAuth callback role assignment then routes to
// the right section of the app. Native goes straight to (marketing) or (app).
export default function Root() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (session) {
      // Web: pick up the role saved to sessionStorage before the OAuth redirect
      const pendingRole =
        Platform.OS === "web" && typeof sessionStorage !== "undefined"
          ? sessionStorage.getItem("__pendingRole")
          : null;

      if (pendingRole === "patient" || pendingRole === "dietitian") {
        sessionStorage.removeItem("__pendingRole");
        supabase.auth.updateUser({ data: { role: pendingRole } }).finally(() => {
          router.replace("/(app)");
        });
      } else {
        router.replace("/(app)");
      }
    } else {
      router.replace("/(marketing)");
    }
  }, [session, loading]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.linen }}>
      <ActivityIndicator size="large" color={colors.forest} />
    </View>
  );
}
