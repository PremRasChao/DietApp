import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/app/CustomTabBar";

export default function AppLayout() {
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
