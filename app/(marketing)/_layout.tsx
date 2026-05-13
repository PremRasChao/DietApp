import { ScrollView, View } from "react-native";
import { Slot } from "expo-router";
import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { AIChatWidget } from "@/components/marketing/AIChatWidget";

export default function MarketingLayout() {
  return (
    <View className="flex-1 bg-bone">
      <NavBar />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Slot />
        <Footer />
      </ScrollView>
      <AIChatWidget />
    </View>
  );
}
