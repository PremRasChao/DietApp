import { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth/AuthContext";
import { DEV_BYPASS_AUTH } from "@/lib/auth/devBypass";
import { appColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export default function ProfileScreen() {
  const { session, role, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const email = session?.user?.email ?? "—";
  const roleLabel = role === "dietitian" ? "Dietitian" : "Patient";

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
    // onAuthStateChange clears the session; (app) then redirects to (auth).
    // Nudge the router in case we're already on a leaf screen.
    router.replace("/(auth)");
  }

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
          <Text
            style={{
              fontFamily: "Fraunces_600SemiBold",
              fontSize: 28,
              color: appColors.onInk,
              marginBottom: 24,
            }}
          >
            Me
          </Text>

          <View
            style={{
              backgroundColor: appColors.paper,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: appColors.fat,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name="person" size={22} color={appColors.inkText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "PublicSans_600SemiBold",
                  fontSize: 15,
                  color: appColors.text,
                  marginBottom: 2,
                }}
              >
                {email}
              </Text>
              <Text
                style={{
                  fontFamily: "PublicSans_400Regular",
                  fontSize: 12,
                  color: appColors.textSoft,
                }}
              >
                {roleLabel}
              </Text>
            </View>
          </View>

          <AnimatedPressable
            onPress={handleSignOut}
            disabled={busy}
            style={{
              backgroundColor: appColors.paper,
              borderRadius: 16,
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? (
              <ActivityIndicator color={appColors.danger} />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={18} color={appColors.danger} />
                <Text
                  style={{
                    fontFamily: "PublicSans_600SemiBold",
                    fontSize: 15,
                    color: appColors.danger,
                    marginLeft: 8,
                  }}
                >
                  Sign out
                </Text>
              </>
            )}
          </AnimatedPressable>

          {DEV_BYPASS_AUTH && (
            <Text
              style={{
                fontFamily: "PublicSans_400Regular",
                fontSize: 11,
                color: appColors.onInkSoft,
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Dev bypass is on — sign-out won't clear the fake session. Set
              DEV_BYPASS_AUTH = false to test real login.
            </Text>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
