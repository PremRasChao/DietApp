import { ScrollView, TextInput, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";

const prompts = [
  "What should I eat before a workout?",
  "Make lunch higher protein",
  "Help me plan snacks",
];

export default function ChatScreen() {
  return (
    <ScrollView
      className="flex-1 bg-bone"
      contentContainerStyle={{ padding: 20, paddingTop: 64, paddingBottom: 112 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <ThemedText variant="heading" color="espresso">AI chat</ThemedText>
        <ThemedText variant="body" color="taupe" className="mt-1">
          Ask for meal ideas, swaps, and simple nutrition explanations.
        </ThemedText>
      </View>

      <Card variant="dark" className="p-5 mb-5">
        <View className="flex-row items-center gap-2 mb-4">
          <Sparkles size={18} color={colors.sage} strokeWidth={1.8} />
          <ThemedText variant="subheading" color="bone">Nutrition assistant</ThemedText>
        </View>
        <View
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: "rgba(253, 250, 246, 0.08)" }}
        >
          <ThemedText variant="body" color="bone">
            Tell me what ingredients you have, your goal, or what you are craving. I can suggest a balanced next step.
          </ThemedText>
        </View>
        <View className="gap-2">
          {prompts.map((prompt) => (
            <View
              key={prompt}
              className="rounded-xl px-3 py-3"
              style={{ backgroundColor: "rgba(138, 174, 133, 0.14)" }}
            >
              <ThemedText variant="caption" color="bone">{prompt}</ThemedText>
            </View>
          ))}
        </View>
      </Card>

      <Card variant="default" className="p-4">
        <ThemedText variant="label" color="taupe" className="mb-3">Message</ThemedText>
        <View className="flex-row gap-2 items-center">
          <TextInput
            placeholder="Ask about today's meals"
            placeholderTextColor={colors.taupe}
            returnKeyType="send"
            style={{
              flex: 1,
              minHeight: 48,
              backgroundColor: colors.cream,
              borderRadius: 14,
              paddingHorizontal: 14,
              color: colors.espresso,
              fontFamily: "Inter_400Regular",
              fontSize: 14,
            }}
          />
          <Button label="Send" variant="primary" size="sm" />
        </View>
      </Card>
    </ScrollView>
  );
}
