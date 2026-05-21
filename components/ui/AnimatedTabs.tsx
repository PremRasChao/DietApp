"use client";
import { useState } from "react";
import { View, Text, Pressable, ScrollView, ImageStyle } from "react-native";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { colors } from "@/lib/tokens";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs?: Tab[];
  defaultTab?: string;
}

// ── Default demo tabs (food-theme, matches app palette) ─────────────────────
const IMG_STYLE: ImageStyle = {
  width: "100%", height: 160, borderRadius: 14,
};

const DEFAULT_TABS: Tab[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    content: (
      <View style={{ gap: 12 }}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80" }}
          style={IMG_STYLE}
          contentFit="cover"
        />
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: "#F5EDDE" }}>
          Morning fuel
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(245,237,222,0.7)", lineHeight: 20 }}>
          Start your day with protein-rich meals that keep you energised until lunch.
        </Text>
      </View>
    ),
  },
  {
    id: "lunch",
    label: "Lunch",
    content: (
      <View style={{ gap: 12 }}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80" }}
          style={IMG_STYLE}
          contentFit="cover"
        />
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: "#F5EDDE" }}>
          Midday reset
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(245,237,222,0.7)", lineHeight: 20 }}>
          Balance macros with a colourful, nutrient-dense plate to power your afternoon.
        </Text>
      </View>
    ),
  },
  {
    id: "dinner",
    label: "Dinner",
    content: (
      <View style={{ gap: 12 }}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80" }}
          style={IMG_STYLE}
          contentFit="cover"
        />
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: "#F5EDDE" }}>
          Evening wind-down
        </Text>
        <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(245,237,222,0.7)", lineHeight: 20 }}>
          Lean proteins and warm vegetables to nourish recovery overnight.
        </Text>
      </View>
    ),
  },
];

export function AnimatedTabs({ tabs = DEFAULT_TABS, defaultTab }: AnimatedTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  if (!tabs.length) return null;

  const activeContent = tabs.find((t) => t.id === active)?.content;

  return (
    <View style={{ width: "100%", gap: 8 }}>
      {/* Tab strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 6,
          padding: 6,
          backgroundColor: "rgba(44,31,20,0.55)",
          borderRadius: 16,
        }}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActive(tab.id)}
            style={{ position: "relative", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
          >
            <MotiView
              animate={{ opacity: active === tab.id ? 1 : 0 }}
              transition={{ type: "timing", duration: 200 }}
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: 12,
                backgroundColor: "rgba(44,31,20,0.8)",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 4,
              }}
            />
            <Text style={{
              fontFamily: active === tab.id ? "Inter_600SemiBold" : "Inter_400Regular",
              fontSize: 14,
              color: active === tab.id ? colors.tan : "rgba(245,237,222,0.65)",
              position: "relative",
            }}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content panel */}
      <View style={{
        backgroundColor: "rgba(44,31,20,0.6)",
        borderRadius: 20,
        padding: 18,
        minHeight: 280,
        overflow: "hidden",
      }}>
        <MotiView
          key={active}
          from={{ opacity: 0, scale: 0.96, translateY: 8 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18, stiffness: 180 }}
        >
          {activeContent}
        </MotiView>
      </View>
    </View>
  );
}
