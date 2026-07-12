import { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useSession } from "@/lib/auth/useSession";
import { colors } from "@/lib/tokens";

export default function LoginScreen() {
  const { session, loading } = useSession();
  const [busy, setBusy] = useState(false);

  // Once signed in, hand off to the app — same session state any auth uses.
  if (!loading && session) return <Redirect href="/(app)" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 32, gap: 16 }}>
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 34,
            color: colors.ink,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            color: colors.stone,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Sign in to continue
        </Text>

        <AppleSignInButton
          disabled={busy}
          onStart={() => setBusy(true)}
          onFinish={() => setBusy(false)}
        />
        <GoogleSignInButton
          disabled={busy}
          onStart={() => setBusy(true)}
          onFinish={() => setBusy(false)}
        />
      </View>
    </SafeAreaView>
  );
}
