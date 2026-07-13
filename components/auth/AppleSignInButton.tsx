import { Alert, Platform, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase/client";

interface Props {
  onStart?: () => void;
  onFinish?: () => void;
  onSuccess?: () => void | Promise<void>;
  disabled?: boolean;
}

// Apple sign-in is iOS-only; renders nothing on Android or web.
export function AppleSignInButton({ onStart, onFinish, onSuccess, disabled }: Props) {
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

      // Apple only sends full name on the first authorization — persist it now.
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

      await onSuccess?.();
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") return;
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
