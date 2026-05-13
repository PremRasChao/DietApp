import { View, ScrollView } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { Card } from "@/components/ui/Card";
import { mockTestimonials } from "@/lib/mockData";

export function TestimonialsRow() {
  return (
    <View className="py-16 bg-cream">
      <View className="px-6 mb-8">
        <ThemedText variant="heading" color="espresso">What our clients say</ThemedText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 4 }}
      >
        {mockTestimonials.map((t) => (
          <Card key={t.id} variant="default" className="w-72 mr-4 p-6">
            <ThemedText variant="body" color="espresso" className="italic leading-relaxed mb-4">
              "{t.quote}"
            </ThemedText>
            <View className="flex-row gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <ThemedText key={i} variant="caption" color="tan">★</ThemedText>
              ))}
            </View>
            <ThemedText variant="label" color="espresso">{t.attribution}</ThemedText>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
