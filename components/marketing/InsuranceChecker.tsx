import { useState } from "react";
import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { mockInsuranceProviders } from "@/lib/mockData";

export function InsuranceChecker() {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState(false);

  function handleCheck() {
    if (selected) setResult(true);
  }

  return (
    <View className="py-16 px-6 bg-bone">
      <View className="max-w-xl mx-auto w-full">
        <ThemedText variant="heading" color="espresso" className="mb-2">
          Check your insurance coverage
        </ThemedText>
        <ThemedText variant="body" color="taupe" className="mb-8">
          Most extended health plans cover registered dietitian visits. See yours in seconds.
        </ThemedText>

        <ThemedText variant="label" color="espresso" className="mb-3">
          Select your provider
        </ThemedText>
        <View className="flex-row flex-wrap gap-3 mb-8">
          {mockInsuranceProviders.map((provider) => (
            <Pressable
              key={provider}
              onPress={() => { setSelected(provider); setResult(false); }}
              className={`px-4 py-2 rounded-full border ${
                selected === provider
                  ? "bg-tan border-tan"
                  : "bg-bone border-cream"
              }`}
            >
              <ThemedText
                variant="caption"
                color={selected === provider ? "espresso" : "taupe"}
              >
                {provider}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <Button
          label="Check my coverage"
          variant="primary"
          onPress={handleCheck}
          disabled={!selected}
          fullWidth
        />

        {result && selected && (
          <View className="mt-6 p-4 bg-cream rounded-2xl">
            <ThemedText variant="body" color="espresso">
              Great news — <ThemedText variant="body" color="espresso" className="font-semibold">{selected}</ThemedText> typically covers registered dietitian visits.
            </ThemedText>
            <ThemedText variant="caption" color="taupe" className="mt-2">
              Coverage details vary by plan. Book a consultation and we'll verify your benefits.
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}
