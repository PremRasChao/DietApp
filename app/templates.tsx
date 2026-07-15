import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth/AuthContext";
import { appColors } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { TemplateLibrary } from "@/components/dietitian/TemplateLibrary";

export default function TemplateLibraryScreen() {
  const { role } = useAuth();

  // Dietitian-only feature.
  if (role !== "dietitian") return <Redirect href="/(app)" />;

  return (
    <View style={{ flex: 1, backgroundColor: appColors.ink }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Top tab row */}
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <AnimatedPressable onPress={() => router.replace("/(app)")} style={{ padding: 4, marginLeft: -4, marginRight: 4 }}>
              <Ionicons name="arrow-back" size={22} color={appColors.text} />
            </AnimatedPressable>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 24, borderBottomWidth: 1, borderBottomColor: appColors.border }}>
            <TopTab icon="documents" label="Meal plan templates" active />
            <TopTab icon="clipboard-outline" label="Recommendations / Foods to avoid" />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <TemplateLibrary />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function TopTab({ icon, label, active }: { icon: any; label: string; active?: boolean }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center", gap: 8,
      paddingBottom: 12, marginBottom: -1,
      borderBottomWidth: 2, borderBottomColor: active ? appColors.text : "transparent",
    }}>
      <Ionicons name={icon} size={17} color={active ? appColors.text : appColors.textSoft} />
      <Text style={{
        fontFamily: active ? "PublicSans_700Bold" : "PublicSans_400Regular",
        fontSize: 15, color: active ? appColors.text : appColors.textSoft,
      }}>
        {label}
      </Text>
    </View>
  );
}
