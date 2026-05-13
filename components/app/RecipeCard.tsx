import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";

type Recipe = {
  title: string;
  description: string;
  kcal: number;
  prepTime: string;
  tags: string[];
  thumbnail: string | null;
};

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <Card variant="default" className="overflow-hidden p-0">
      {/* Thumbnail */}
      <View className="w-full h-40 bg-cream items-center justify-center">
        <ThemedText variant="caption" color="taupe">Recipe image</ThemedText>
      </View>
      <View className="p-4">
        <ThemedText variant="label" color="taupe" className="mb-1">Recipe of the day</ThemedText>
        <ThemedText variant="subheading" color="espresso">{recipe.title}</ThemedText>
        <ThemedText variant="body" color="taupe" className="mt-1 mb-3">{recipe.description}</ThemedText>

        <View className="flex-row gap-2 flex-wrap mb-4">
          {recipe.tags.map((tag) => (
            <View key={tag} className="px-2 py-1 bg-tan rounded-full">
              <ThemedText variant="label" color="espresso">{tag}</ThemedText>
            </View>
          ))}
          <View className="px-2 py-1 bg-cream rounded-full">
            <ThemedText variant="label" color="taupe">{recipe.kcal} kcal</ThemedText>
          </View>
          <View className="px-2 py-1 bg-cream rounded-full">
            <ThemedText variant="label" color="taupe">⏱ {recipe.prepTime}</ThemedText>
          </View>
        </View>

        <Button label="Add to plan" variant="primary" size="sm" fullWidth onPress={onPress} />
      </View>
    </Card>
  );
}
