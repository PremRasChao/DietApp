import { Platform, View, Text } from "react-native";

/**
 * AIChatWidget — web-only floating chat widget.
 *
 * On native (iOS / Android) this renders nothing.
 * On web it renders an embedded chat iframe or stub UI.
 *
 * Template tokens for copy: [Dietitian name], [Neighborhood]
 */
export default function AIChatWidget() {
  // Guard: this widget is intentionally web-only.
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <View
      className="fixed bottom-6 right-6 bg-espresso rounded-2xl shadow-lg p-4 w-80"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — 'fixed' position is web-only and not in RN ViewStyle
      style={{ position: "fixed" }}
    >
      <Text className="text-bone font-display text-base mb-1">
        Chat with [Dietitian name]
      </Text>
      <Text className="text-cream text-xs mb-3">
        Your local nutrition expert in [Neighborhood]
      </Text>
      {/* Swap for a real chat SDK embed on production */}
      <View className="bg-taupe rounded-xl p-3">
        <Text className="text-bone text-sm">How can I help you today?</Text>
      </View>
    </View>
  );
}
