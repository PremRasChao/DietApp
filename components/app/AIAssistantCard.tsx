import { useState } from "react";
import { View, TextInput } from "react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
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
    <Card variant="dark" className="p-5">
      <ThemedText variant="subheading" color="bone">AI Nutrition Assistant</ThemedText>
      <ThemedText variant="caption" color="taupe" className="mt-1 mb-4">
        How can I help with your meals today?
      </ThemedText>

      {replied && (
        <View className="bg-espresso border border-taupe rounded-xl p-3 mb-4">
          <ThemedText variant="body" color="bone">{TIPS[tip]}</ThemedText>
        </View>
      )}

      <View className="flex-row gap-2 items-center">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask a question…"
          placeholderTextColor={colors.taupe}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            color: colors.bone,
            fontFamily: "Inter_400Regular",
            fontSize: 14,
          }}
        />
        <Button label="Send" variant="primary" size="sm" onPress={handleSend} />
      </View>
    </Card>
  );
}
