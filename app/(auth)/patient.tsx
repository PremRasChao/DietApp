import { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/auth/useSession";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { appColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export default function PatientLoginScreen() {
  const { session, loading } = useSession();
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Redirect href="/(app)" />;

  function handleSuccess() {
    // Role is assigned server-side (dietitian allowlist trigger on signup);
    // it is never read from or written to client-supplied user metadata.
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
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "#E3ECD9",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="restaurant-outline" size={24} color="#4A6B3D" />
        </View>

        <Text
          style={{
            fontFamily: "Fraunces_600SemiBold",
            fontSize: 26,
            color: appColors.onInk,
            marginBottom: 8,
          }}
        >
          Sign in as patient
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
          Track meals, log what you eat, and work toward your goals with your dietitian.
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
