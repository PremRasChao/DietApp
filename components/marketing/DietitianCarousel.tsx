import { FlatList, Linking, View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockDietitians } from "@/lib/mockData";
import { nutritionwizeLinks } from "@/lib/marketingLinks";

type Dietitian = (typeof mockDietitians)[number];

function DietitianCard({ item }: { item: Dietitian }) {
  return (
    <Card variant="default" className="w-64 mr-4 p-5">
      <View className="w-16 h-16 rounded-full bg-cream items-center justify-center mb-3">
        <ThemedText variant="heading" color="taupe">RD</ThemedText>
      </View>
      <ThemedText variant="subheading" color="espresso">{item.name}</ThemedText>
      <ThemedText variant="caption" color="taupe" className="mt-1">
        {item.specializations.join(" · ")}
      </ThemedText>
      <ThemedText variant="caption" color="taupe" className="mt-1">
        {item.languages.join(", ")}
      </ThemedText>
      <View className="mt-4">
        <Button
          label={`Book with ${item.name}`}
          variant="secondary"
          size="sm"
          onPress={() => Linking.openURL(nutritionwizeLinks.consultation)}
          fullWidth
        />
      </View>
    </Card>
  );
}

export function DietitianCarousel() {
  return (
    <View className="py-16 bg-bone">
      <View className="px-6 mb-8">
        <ThemedText variant="heading" color="espresso">Meet our dietitians</ThemedText>
        <ThemedText variant="body" color="taupe" className="mt-2">
          Led by Manmeet Behl, RD, CDE, NM, our Registered Dietitians offer clinical, community, and group counselling experience across Ontario.
        </ThemedText>
      </View>
      <FlatList
        data={mockDietitians}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DietitianCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 4 }}
      />
    </View>
  );
}
