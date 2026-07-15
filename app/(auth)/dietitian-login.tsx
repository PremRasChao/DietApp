import { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/auth/useSession";
import { supabase } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { appColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export default function DietitianLoginScreen() {
  const { session, loading } = useSession();
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Redirect href="/(app)" />;

  async function handleSuccess() {
    try {
      await supabase.auth.updateUser({ data: { role: "dietitian" } });
    } catch {
      // Role update failed — non-blocking
    }
    router.replace("/(app)");
  }

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={{ marginTop: 8, marginBottom: 32, alignSelf: "flex-start", padding: 4 }}
        >
          <Ionicons name="arrow-back" size={22} color={appColors.onInk} />
        </AnimatedPressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: appColors.inkRaised,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 14,
            marginBottom: 28,
            alignSelf: "flex-start",
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color={appColors.fat} />
          <Text
            style={{
              fontFamily: "PublicSans_600SemiBold",
              fontSize: 13,
              color: appColors.fat,
            }}
          >
            Dietitian ID verified
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Fraunces_600SemiBold",
            fontSize: 26,
            color: appColors.onInk,
            marginBottom: 8,
          }}
        >
          Sign in as dietitian
        </Text>
        <Text
          style={{
            fontFamily: "PublicSans_400Regular",
            fontSize: 14,
            color: appColors.onInkSoft,
            marginBottom: 36,
            lineHeight: 21,
          }}
        >
          Access your professional dashboard, patient tools, and appointment management.
        </Text>

        {loading || busy ? (
          <ActivityIndicator size="large" color={appColors.fat} style={{ marginBottom: 16 }} />
        ) : (
          <>
            <AppleSignInButton
              disabled={busy}
              onStart={() => setBusy(true)}
              onFinish={() => setBusy(false)}
              onSuccess={handleSuccess}
            />
            <View style={{ height: 12 }} />
            <GoogleSignInButton
              disabled={busy}
              onStart={() => setBusy(true)}
              onFinish={() => setBusy(false)}
              onSuccess={handleSuccess}
            />
          </>
        )}

        <Text
          style={{
            fontFamily: "PublicSans_400Regular",
            fontSize: 11,
            color: appColors.onInkSoft,
            textAlign: "center",
            marginTop: 24,
            lineHeight: 17,
          }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
