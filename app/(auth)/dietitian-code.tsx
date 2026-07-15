import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase/client";
import { canAttempt, isLocked, recordAttempt, remaining } from "@/lib/auth/dietitianRateLimit";
import { appColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export default function DietitianCodeScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmed = code.trim();

    if (!trimmed) {
      setError("Please enter your dietitian ID.");
      return;
    }
    if (trimmed.length < 4 || trimmed.length > 32) {
      setError("Dietitian ID must be between 4 and 32 characters.");
      return;
    }
    // Only allow alphanumeric + hyphens
    if (!/^[a-zA-Z0-9\-]+$/.test(trimmed)) {
      setError("Dietitian ID can only contain letters, numbers, and hyphens.");
      return;
    }

    if (isLocked()) {
      setError("Too many failed attempts. Please try again in 15 minutes.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc("verify_dietitian_code", {
        p_code: trimmed.toLowerCase(),
      });

      if (rpcError) {
        // RPC doesn't exist yet — tell the user to contact support
        setError("Verification service unavailable. Please contact support.");
        return;
      }

      recordAttempt();

      if (data === true) {
        router.push("/(auth)/dietitian-login" as any);
      } else {
        const left = remaining();
        setError(
          left > 0
            ? `Invalid dietitian ID. ${left} attempt${left !== 1 ? "s" : ""} remaining.`
            : "Too many failed attempts. Please try again in 15 minutes."
        );
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
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
              backgroundColor: "#F5E2D6",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#A9532C" />
          </View>

          <Text
            style={{
              fontFamily: "Fraunces_600SemiBold",
              fontSize: 24,
              color: appColors.onInk,
              marginBottom: 8,
            }}
          >
            Dietitian verification
          </Text>
          <Text
            style={{
              fontFamily: "PublicSans_400Regular",
              fontSize: 14,
              color: appColors.onInkSoft,
              marginBottom: 32,
              lineHeight: 21,
            }}
          >
            Enter the unique ID provided to you by Nutrition Wize to verify your credentials.
          </Text>

          <Text
            style={{
              fontFamily: "PublicSans_600SemiBold",
              fontSize: 12,
              color: appColors.onInkSoft,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Dietitian ID
          </Text>
          <TextInput
            value={code}
            onChangeText={(v) => {
              setCode(v);
              setError(null);
            }}
            placeholder="e.g. DT-12345"
            placeholderTextColor={appColors.textSoft}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!loading && !isLocked()}
            style={{
              height: 52,
              borderRadius: 14,
              borderWidth: error ? 1.5 : 0,
              borderColor: appColors.danger,
              backgroundColor: appColors.paper,
              paddingHorizontal: 16,
              fontFamily: "PublicSans_400Regular",
              fontSize: 16,
              color: appColors.text,
              marginBottom: 8,
            }}
          />

          {error && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 16,
              }}
            >
              <Ionicons name="alert-circle-outline" size={16} color={appColors.danger} />
              <Text
                style={{
                  fontFamily: "PublicSans_400Regular",
                  fontSize: 13,
                  color: appColors.danger,
                  flex: 1,
                }}
              >
                {error}
              </Text>
            </View>
          )}

          <View style={{ height: error ? 8 : 24 }} />

          <AnimatedPressable
            onPress={handleSubmit}
            disabled={loading || isLocked() || !code.trim()}
            style={{
              height: 52,
              borderRadius: 14,
              backgroundColor:
                loading || isLocked() || !code.trim() ? appColors.inkRaised : appColors.fat,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color={appColors.onInk} />
            ) : (
              <Text
                style={{
                  fontFamily: "PublicSans_600SemiBold",
                  fontSize: 15,
                  color: appColors.inkText,
                }}
              >
                Verify ID
              </Text>
            )}
          </AnimatedPressable>

          <Text
            style={{
              fontFamily: "PublicSans_400Regular",
              fontSize: 11,
              color: appColors.onInkSoft,
              textAlign: "center",
              marginTop: 20,
              lineHeight: 17,
            }}
          >
            Don't have an ID? Contact your Nutrition Wize administrator.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
