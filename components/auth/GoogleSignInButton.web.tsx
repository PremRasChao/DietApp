import { Pressable, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "@/lib/supabase/client";
import { getPendingRole } from "@/lib/auth/pendingRole";

interface Props {
  onStart?: () => void;
  onFinish?: () => void;
  // Note: onSuccess is not called on web — the browser redirects away during OAuth.
  // After redirect, app/index.tsx handles role assignment.
  onSuccess?: () => void | Promise<void>;
  disabled?: boolean;
}

export function GoogleSignInButton({ onStart, onFinish, disabled }: Props) {
  async function handlePress() {
    onStart?.();
    try {
      // Persist role to sessionStorage before the browser redirects away
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("__pendingRole", getPendingRole());
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Return to root so app/index.tsx can handle role assignment after OAuth
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) Alert.alert("Sign in failed", error.message);
      // Browser navigates away; onSuccess / onFinish never fire after this
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Google sign-in error.");
      onFinish?.();
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dadce0",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { backgroundColor: "#f8f8f8" },
  disabled: { opacity: 0.5 },
  text: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#3c4043" },
});
