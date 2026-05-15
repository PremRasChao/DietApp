import { View, Text, Pressable } from "react-native";
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

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.bone,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.cream,
        overflow: "hidden",
      }}
    >
      {/* Thumbnail placeholder with editorial text */}
      <View
        style={{
          width: "100%",
          height: 160,
          backgroundColor: colors.cream,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Text style={{ fontSize: 48 }}>🥗</Text>
        {/* Eyebrow label overlaid */}
        <View
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            backgroundColor: colors.cream,
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 10,
              color: colors.espresso,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Recipe of the day
          </Text>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 20,
            color: colors.espresso,
            marginBottom: 6,
          }}
        >
          {recipe.title}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: colors.taupe,
            lineHeight: 22,
            marginBottom: 16,
          }}
        >
          {recipe.description}
        </Text>

        {/* Tags */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {recipe.tags.map((tag) => (
            <View
              key={tag}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 5,
                backgroundColor: "rgba(200,168,130,0.2)",
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  color: colors.espresso,
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              backgroundColor: colors.cream,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.taupe,
              }}
            >
              {recipe.kcal} kcal
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 5,
              backgroundColor: colors.cream,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: colors.taupe,
              }}
            >
              ⏱ {recipe.prepTime}
            </Text>
          </View>
        </View>

        <Button
          label="Add to plan"
          variant="primary"
          size="sm"
          fullWidth
          onPress={onPress}
        />
      </View>
    </View>
  );
}
