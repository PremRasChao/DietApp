import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/auth/useSession";
import { supabase } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { colors } from "@/lib/tokens";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.linen }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        {/* Back */}
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 8, marginBottom: 32, alignSelf: "flex-start", padding: 4 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.ink} />
        </Pressable>

        {/* Verified badge */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: colors.forest + "12",
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 14,
            marginBottom: 28,
            alignSelf: "flex-start",
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color={colors.forest} />
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 13,
              color: colors.forest,
            }}
          >
            Dietitian ID verified
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 30,
            color: colors.ink,
            marginBottom: 8,
          }}
        >
          Sign in as Dietitian
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            color: colors.stone,
            marginBottom: 40,
            lineHeight: 22,
          }}
        >
          Access your professional dashboard, patient tools, and appointment management.
        </Text>

        {loading || busy ? (
          <ActivityIndicator size="large" color={colors.forest} style={{ marginBottom: 16 }} />
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
            fontFamily: "Inter_400Regular",
            fontSize: 12,
            color: colors.stone,
            textAlign: "center",
            marginTop: 24,
            lineHeight: 18,
          }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}
