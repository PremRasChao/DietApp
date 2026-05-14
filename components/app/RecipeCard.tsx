import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { Clock, Tag } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";

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

const IMAGE_HEIGHT = 220;

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const [imgWidth, setImgWidth] = useState(0);

  return (
    <Card variant="default" className="overflow-hidden p-0">
      {/* Hero image area */}
      <View
        style={{ height: IMAGE_HEIGHT, backgroundColor: colors.cream }}
        onLayout={(e) => setImgWidth(e.nativeEvent.layout.width)}
      >
        {recipe.thumbnail ? (
          <Image
            source={{ uri: recipe.thumbnail }}
            style={{ width: "100%", height: IMAGE_HEIGHT }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ThemedText variant="caption" color="taupe">Recipe image</ThemedText>
          </View>
        )}

        {/* SVG gradient overlay — fades bottom of image to espresso */}
        {recipe.thumbnail && imgWidth > 0 && (
          <Svg
            width={imgWidth}
            height={IMAGE_HEIGHT}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Defs>
              <LinearGradient id="recipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="30%" stopColor="transparent" stopOpacity="0" />
                <Stop offset="100%" stopColor={colors.espresso} stopOpacity="0.72" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={imgWidth} height={IMAGE_HEIGHT} fill="url(#recipeGrad)" />
          </Svg>
        )}

        {/* "Recipe of the day" badge — top-left */}
        <View
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            backgroundColor: "rgba(253, 250, 246, 0.92)",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
          }}
        >
          <ThemedText variant="label" color="tan">Recipe of the day</ThemedText>
        </View>

        {/* Title overlaid on the gradient — bottom-left */}
        {recipe.thumbnail && (
          <View
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              right: 14,
            }}
          >
            <ThemedText variant="subheading" color="bone">{recipe.title}</ThemedText>
          </View>
        )}
      </View>

      {/* Card body */}
      <View className="p-4 pt-3">
        {/* Only show title in body if there's no image overlay */}
        {!recipe.thumbnail && (
          <ThemedText variant="subheading" color="espresso" className="mb-1">
            {recipe.title}
          </ThemedText>
        )}

        <ThemedText variant="body" color="taupe" className="mb-3" numberOfLines={2}>
          {recipe.description}
        </ThemedText>

        {/* Tags row */}
        <View className="flex-row gap-2 flex-wrap mb-4">
          {recipe.tags.map((tag) => (
            <View
              key={tag}
              className="flex-row items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(196, 160, 122, 0.18)" }}
            >
              <Tag size={10} color={colors.tan} strokeWidth={2} />
              <ThemedText variant="label" color="tan">{tag}</ThemedText>
            </View>
          ))}

          <View className="px-2.5 py-1 bg-cream rounded-full">
            <ThemedText variant="label" color="taupe">{recipe.kcal} kcal</ThemedText>
          </View>

          <View className="flex-row items-center gap-1 px-2.5 py-1 bg-cream rounded-full">
            <Clock size={10} color={colors.taupe} strokeWidth={2} />
            <ThemedText variant="label" color="taupe">{recipe.prepTime}</ThemedText>
          </View>
        </View>

        <Button label="Add to plan" variant="primary" size="sm" fullWidth onPress={onPress} />
      </View>
    </Card>
  );
}
