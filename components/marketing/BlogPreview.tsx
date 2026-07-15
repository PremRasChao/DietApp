import { Image, Linking, Pressable, View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { mockBlogPosts } from "@/lib/mockData";
import { nutritionwizeLinks } from "@/lib/marketingLinks";

export function BlogPreview() {
  const { isMd } = useBreakpoint();

  return (
    <View className="py-16 px-6 bg-bone">
      <View className="max-w-screen-xl mx-auto w-full">
        <View className="flex-row items-center justify-between mb-8">
          <ThemedText variant="heading" color="espresso">From our blog</ThemedText>
          <Button label="View all" variant="ghost" size="sm" onPress={() => Linking.openURL(nutritionwizeLinks.blog)} />
        </View>

        <View className={isMd ? "flex-row gap-6" : "flex-col gap-4"}>
          {mockBlogPosts.map((post) => (
            <Pressable
              key={post.id}
              onPress={() => Linking.openURL(post.url)}
              className={isMd ? "flex-1" : "w-full"}
            >
              <Card variant="default" className="w-full overflow-hidden p-0">
                <Image source={{ uri: post.thumbnail }} className="w-full h-40 bg-cream" resizeMode="cover" />
                <View className="p-4">
                  <View className="self-start px-2 py-1 bg-tan rounded-full mb-2">
                    <ThemedText variant="label" color="espresso">{post.category}</ThemedText>
                  </View>
                  <ThemedText variant="subheading" color="espresso" numberOfLines={2}>
                    {post.title}
                  </ThemedText>
                  <ThemedText variant="caption" color="taupe" className="mt-1">
                    {post.date}
                  </ThemedText>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
