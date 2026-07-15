import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs } from "expo-router";
import { CustomTabBar } from "@/components/app/CustomTabBar";
import { useAuth } from "@/lib/auth/AuthContext";
import { appColors, appGradient } from "@/lib/tokens";

export default function AppLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LinearGradient colors={appGradient.shell} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={appColors.fat} />
      </LinearGradient>
    );
  }

  if (!isLoggedIn) {
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
