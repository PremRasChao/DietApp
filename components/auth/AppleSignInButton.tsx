import { Alert, Platform, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase/client";

interface Props {
  onStart?: () => void;
  onFinish?: () => void;
  disabled?: boolean;
}

// Per PRD 6.4 Option A: Apple sign-in is iOS-only; render nothing elsewhere.
export function AppleSignInButton({ onStart, onFinish, disabled }: Props) {
  if (Platform.OS !== "ios") return null;

  async function handlePress() {
    if (disabled) return;
    onStart?.();
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        Alert.alert("Sign in failed", "No identity token returned from Apple.");
        return;
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      if (error) {
        Alert.alert("Sign in failed", error.message);
        return;
      }

      // Apple only sends the full name on the FIRST authorization — persist it
      // now or it's gone forever. Guard so a later name-less sign-in never
      // overwrites the stored name with null.
      const { fullName } = credential;
      if (fullName && (fullName.givenName || fullName.familyName)) {
        const given = fullName.givenName ?? "";
        const family = fullName.familyName ?? "";
        await supabase.auth.updateUser({
          data: {
            full_name: `${given} ${family}`.trim(),
            given_name: given,
            family_name: family,
          },
        });
      }
      // Session lands via the existing onAuthStateChange listener (useSession).
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") return; // user backed out — silent
      Alert.alert("Sign in failed", e?.message ?? "Apple sign-in error.");
    } finally {
      onFinish?.();
    }
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={12}
      style={styles.button}
      onPress={handlePress}
    />
  );
}

const styles = StyleSheet.create({
  button: { width: "100%", height: 50 },
});
