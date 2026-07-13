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

export default function PatientLoginScreen() {
  const { session, loading } = useSession();
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Redirect href="/(app)" />;

  async function handleSuccess() {
    try {
      await supabase.auth.updateUser({ data: { role: "patient" } });
    } catch {
      // Role update failed — non-blocking, app still works without it
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

        {/* Icon */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.sage + "25",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="person-outline" size={32} color={colors.forest} />
        </View>

        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 30,
            color: colors.ink,
            marginBottom: 8,
          }}
        >
          Sign in as Patient
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
          Track your nutrition, log meals, and work toward your goals.
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
