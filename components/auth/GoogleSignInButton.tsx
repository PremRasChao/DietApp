import { Alert, StyleSheet } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase/client";

interface Props {
  onStart?: () => void;
  onFinish?: () => void;
  disabled?: boolean;
}

export function GoogleSignInButton({ onStart, onFinish, disabled }: Props) {
  async function handlePress() {
    onStart?.();
    try {
      // No-op on iOS; required on Android. Safe to call on both.
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      // User cancelled (or no id token) — nothing to do.
      if (!isSuccessResponse(response)) return;

      const idToken = response.data.idToken;
      if (!idToken) {
        Alert.alert("Sign in failed", "No ID token returned from Google.");
        return;
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) {
        Alert.alert("Sign in failed", error.message);
        return;
      }
      // Session lands via the existing onAuthStateChange listener (useSession).
    } catch (e) {
      if (isErrorWithCode(e)) {
        if (e.code === statusCodes.SIGN_IN_CANCELLED) return; // silent
        if (e.code === statusCodes.IN_PROGRESS) return; // already running — silent
        if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert("Google Play Services required", "Update or install Google Play Services and try again.");
          return;
        }
      }
      Alert.alert("Sign in failed", "Google sign-in error.");
    } finally {
      onFinish?.();
    }
  }

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      style={styles.button}
      onPress={handlePress}
      disabled={disabled}
    />
  );
}

const styles = StyleSheet.create({
  button: { width: "100%", height: 50 },
});
