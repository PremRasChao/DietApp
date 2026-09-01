import { useRef, useState } from "react";
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { appColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { askAssistant, AssistantError, type ChatTurn } from "@/lib/ai/assistant";
import { canSendMessage, recordMessage, remainingMessages } from "@/lib/ai/chatRateLimit";

type Message = { id: string; role: "user" | "model"; text: string };

const SUGGESTIONS = [
  "High-protein breakfast ideas",
  "Is oatmeal good for weight loss?",
  "Swap for white rice",
  "Snacks under 200 calories",
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollDown = () => requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    if (!canSendMessage()) {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "model", text: `⚠️ You've hit the message limit (${remainingMessages()} left). Try again in a few minutes.` },
      ]);
      return;
    }

    const userMsg: Message = { id: uid(), role: "user", text: content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);
    scrollDown();

    try {
      recordMessage();
      const history: ChatTurn[] = next.map((m) => ({ role: m.role, text: m.text }));
      const reply = await askAssistant(history);
      setMessages((prev) => [...prev, { id: uid(), role: "model", text: reply }]);
    } catch (e) {
      const msg = e instanceof AssistantError ? e.message : "Something went wrong. Try again.";
      setMessages((prev) => [...prev, { id: uid(), role: "model", text: `⚠️ ${msg}` }]);
    } finally {
      setSending(false);
      scrollDown();
    }
  }

  const empty = messages.length === 0;

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <LinearGradient colors={appGradient.accent} style={{ width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="sparkles" size={19} color={appColors.inkText} />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 22, color: appColors.onInk }}>Nutrition assistant</Text>
            <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.onInkSoft, marginTop: 1 }}>
              Ask about meals, macros and healthy habits
            </Text>
          </View>
          {messages.length > 0 && (
            <AnimatedPressable onPress={() => setMessages([])} hitSlop={8} style={{ padding: 6 }}>
              <Ionicons name="create-outline" size={20} color={appColors.onInkSoft} />
            </AnimatedPressable>
          )}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={scrollDown}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 12, flexGrow: 1 }}
        >
          {empty ? (
            <EmptyState onPick={send} />
          ) : (
            messages.map((m) => <Bubble key={m.id} message={m} />)
          )}
          {sending && <TypingBubble />}
        </ScrollView>

        {/* Composer */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 96 }}>
          <View style={{
            flexDirection: "row", alignItems: "flex-end", gap: 8,
            backgroundColor: appColors.paper, borderRadius: 24,
            borderWidth: 1, borderColor: appColors.border,
            paddingLeft: 18, paddingRight: 6, paddingVertical: 6,
          }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Message the assistant…"
              placeholderTextColor={appColors.textSoft}
              multiline
              onSubmitEditing={() => send()}
              blurOnSubmit={false}
              style={{
                flex: 1, maxHeight: 120, paddingVertical: Platform.OS === "ios" ? 8 : 4,
                fontFamily: "PublicSans_400Regular", fontSize: 15, color: appColors.text,
              }}
            />
            <AnimatedPressable
              onPress={() => send()}
              disabled={!input.trim() || sending}
              scaleTo={0.9}
              style={{
                width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center",
                backgroundColor: input.trim() && !sending ? appColors.fat : appColors.paperDim,
              }}
            >
              {sending
                ? <ActivityIndicator size="small" color={appColors.fat} />
                : <Ionicons name="arrow-up" size={20} color={input.trim() ? appColors.inkText : appColors.textSoft} />}
            </AnimatedPressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 220 }}
      style={{ flexDirection: "row", justifyContent: isUser ? "flex-end" : "flex-start" }}
    >
      {!isUser && (
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: appColors.fat, alignItems: "center", justifyContent: "center", marginRight: 8, marginTop: 2 }}>
          <Ionicons name="sparkles" size={13} color={appColors.inkText} />
        </View>
      )}
      <View style={{
        maxWidth: "82%",
        backgroundColor: isUser ? appColors.fat : appColors.paper,
        borderWidth: isUser ? 0 : 1, borderColor: appColors.border,
        borderRadius: 18,
        borderBottomRightRadius: isUser ? 4 : 18,
        borderBottomLeftRadius: isUser ? 18 : 4,
        paddingHorizontal: 15, paddingVertical: 11,
      }}>
        <Text style={{
          fontFamily: "PublicSans_400Regular", fontSize: 15, lineHeight: 22,
          color: isUser ? appColors.inkText : appColors.text,
        }}>
          {message.text}
        </Text>
      </View>
    </MotiView>
  );
}

function TypingBubble() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: appColors.fat, alignItems: "center", justifyContent: "center", marginRight: 8 }}>
        <Ionicons name="sparkles" size={13} color={appColors.inkText} />
      </View>
      <View style={{ flexDirection: "row", gap: 4, backgroundColor: appColors.paper, borderWidth: 1, borderColor: appColors.border, borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 14 }}>
        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            from={{ opacity: 0.3, translateY: 0 }}
            animate={{ opacity: 1, translateY: -3 }}
            transition={{ type: "timing", duration: 500, loop: true, delay: i * 150 }}
            style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: appColors.textSoft }}
          />
        ))}
      </View>
    </View>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 18, paddingBottom: 40 }}>
      <LinearGradient colors={appGradient.accent} style={{ width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="sparkles" size={30} color={appColors.inkText} />
      </LinearGradient>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 20, color: appColors.onInk }}>How can I help?</Text>
        <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.onInkSoft, textAlign: "center", maxWidth: 260 }}>
          Ask me anything about nutrition, meals, or your goals.
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center", paddingHorizontal: 12 }}>
        {SUGGESTIONS.map((s) => (
          <AnimatedPressable
            key={s}
            onPress={() => onPick(s)}
            scaleTo={0.96}
            style={{ backgroundColor: appColors.paper, borderWidth: 1, borderColor: appColors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 }}
          >
            <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 13, color: appColors.text }}>{s}</Text>
          </AnimatedPressable>
        ))}
      </View>
    </View>
  );
}
