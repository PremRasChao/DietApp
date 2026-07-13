import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase/client";
import { canAttempt, isLocked, recordAttempt, remaining } from "@/lib/auth/dietitianRateLimit";
import { colors } from "@/lib/tokens";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.linen }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
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
              backgroundColor: colors.clay + "18",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={32} color={colors.clay} />
          </View>

          <Text
            style={{
              fontFamily: "Fraunces_700Bold",
              fontSize: 28,
              color: colors.ink,
              marginBottom: 8,
            }}
          >
            Dietitian Verification
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              color: colors.stone,
              marginBottom: 36,
              lineHeight: 22,
            }}
          >
            Enter the unique ID provided to you by Nutrition Wize to verify your credentials.
          </Text>

          {/* Input */}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 13,
              color: colors.ink,
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
            placeholderTextColor={colors.stone}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!loading && !isLocked()}
            style={{
              height: 52,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: error ? colors.clay : "#d0cbc4",
              backgroundColor: colors.white,
              paddingHorizontal: 16,
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: colors.ink,
              marginBottom: 8,
            }}
          />

          {/* Error */}
          {error && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 16,
              }}
            >
              <Ionicons name="alert-circle-outline" size={16} color={colors.clay} />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: colors.clay,
                  flex: 1,
                }}
              >
                {error}
              </Text>
            </View>
          )}

          <View style={{ height: error ? 8 : 24 }} />

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading || isLocked() || !code.trim()}
            style={({ pressed }) => ({
              height: 52,
              borderRadius: 12,
              backgroundColor:
                loading || isLocked() || !code.trim()
                  ? colors.stone + "60"
                  : pressed
                  ? "#1e3328"
                  : colors.forest,
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Verify ID
              </Text>
            )}
          </Pressable>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 12,
              color: colors.stone,
              textAlign: "center",
              marginTop: 20,
              lineHeight: 18,
            }}
          >
            Don't have an ID? Contact your Nutrition Wize administrator.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
