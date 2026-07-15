import { useState } from "react";
import { Platform, View, Pressable, TextInput, ScrollView, Modal } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";

type Message = { id: string; role: "user" | "assistant"; text: string };

const CANNED = "I'm here to help with your nutrition questions. This feature is coming soon!";

export function AIChatWidget() {
  // Web-only — return nothing on native
  if (Platform.OS !== "web") return null;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", text: "Hi! How can I help with your nutrition today?" },
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "a", role: "assistant", text: CANNED },
      ]);
    }, 800);
  }

  return (
    <>
      {/* FAB */}
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.espresso,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.espresso,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
          zIndex: 100,
        }}
      >
        <ThemedText variant="label" color="bone">AI</ThemedText>
      </Pressable>

      {/* Chat panel */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(44,31,20,0.4)" }}
          onPress={() => setOpen(false)}
        >
          <View
            style={{
              position: "absolute",
              bottom: 96,
              right: 24,
              width: 340,
              maxHeight: 480,
              backgroundColor: colors.bone,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <View style={{ backgroundColor: colors.espresso, padding: 16 }}>
              <ThemedText variant="subheading" color="bone">Nutritionwize AI</ThemedText>
              <ThemedText variant="caption" color="taupe">Ask me anything about nutrition</ThemedText>
            </View>

            {/* Messages */}
            <ScrollView style={{ flex: 1, padding: 12 }} contentContainerStyle={{ gap: 8 }}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.role === "user" ? colors.tan : colors.cream,
                    borderRadius: 12,
                    padding: 10,
                    maxWidth: "80%",
                  }}
                >
                  <ThemedText variant="body" color="espresso">{msg.text}</ThemedText>
                </View>
              ))}
            </ScrollView>

            {/* Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: colors.cream,
                padding: 8,
                gap: 8,
              }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask a question…"
                placeholderTextColor={colors.taupe}
                style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: colors.cream,
                  borderRadius: 20,
                  color: colors.espresso,
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                }}
                onSubmitEditing={send}
                returnKeyType="send"
              />
              <Pressable
                onPress={send}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.espresso,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText variant="caption" color="bone">→</ThemedText>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
