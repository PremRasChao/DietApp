import { View, ActivityIndicator } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { CustomTabBar } from "@/components/app/CustomTabBar";
import { useSession } from "@/lib/auth/useSession";
import { colors } from "@/lib/tokens";

export default function AppLayout() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.linen }}>
        <ActivityIndicator size="large" color={colors.forest} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"   options={{ title: "Home" }} />
      <Tabs.Screen name="plan"    options={{ title: "Meals" }} />
      <Tabs.Screen name="log"     options={{ title: "Log" }} />
      <Tabs.Screen name="chat"    options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Me" }} />
    </Tabs>
  );
}
