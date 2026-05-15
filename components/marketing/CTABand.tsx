import { View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";

export function CTABand() {
  return (
    <View className="py-20 px-6 bg-cream items-center">
      <ThemedText variant="display" color="espresso" className="text-center max-w-xl mb-3">
        Ready to transform your relationship with food?
      </ThemedText>
      <ThemedText variant="body" color="taupe" className="text-center max-w-lg mb-8">
        Join thousands of Canadians who've hit their health goals with personalised dietitian support.
      </ThemedText>
      <View className="flex-row gap-4">
        <Button label="Book a consultation" variant="dark" size="lg" />
        <Button label="Download the app" variant="ghost" size="lg" />
      </View>
    </View>
  );
}
