import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { colors } from "@/lib/tokens";

const TIPS = [
  "Try adding a handful of leafy greens to your next meal — they're low calorie and nutrient-dense.",
  "Drinking water before meals can help with portion control.",
  "Protein at breakfast helps stabilise blood sugar through the morning.",
];

export function AIAssistantCard() {
  const [input, setInput] = useState("");
  const [tip, setTip] = useState(0);
  const [replied, setReplied] = useState(false);

  function handleSend() {
    if (!input.trim()) return;
    setInput("");
    setReplied(true);
    setTip((t) => (t + 1) % TIPS.length);
  }

  return (
    <View
      style={{
        backgroundColor: colors.cream,
        borderRadius: 24,
        padding: 24,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: colors.tan,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 17 }}>✨</Text>
        </View>
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 18,
            color: colors.espresso,
          }}
        >
          AI Nutrition Assistant
        </Text>
      </View>

      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 13,
          color: colors.taupe,
          marginBottom: 20,
        }}
      >
        Ask me anything about your meals today
      </Text>

      {replied && (
        <View
          style={{
            backgroundColor: colors.bone,
            borderRadius: 16,
            padding: 14,
            marginBottom: 16,
            borderLeftWidth: 3,
            borderLeftColor: colors.tan,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: colors.espresso,
              lineHeight: 22,
            }}
          >
            {TIPS[tip]}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask a question…"
          placeholderTextColor={colors.taupe}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          style={{
            flex: 1,
            backgroundColor: colors.bone,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 13,
            color: colors.espresso,
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            borderWidth: 1,
            borderColor: "rgba(44,31,20,0.15)",
          }}
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => ({
            backgroundColor: colors.espresso,
            borderRadius: 14,
            paddingHorizontal: 20,
            paddingVertical: 13,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: colors.bone,
            }}
          >
            Send
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
