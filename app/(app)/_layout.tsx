import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { name: string; title: string; icon: IoniconName; iconOutline: IoniconName }[] = [
  { name: "index",   title: "Home",    icon: "home",        iconOutline: "home-outline" },
  { name: "plan",    title: "Plan",    icon: "calendar",    iconOutline: "calendar-outline" },
  { name: "log",     title: "Log",     icon: "add-circle",  iconOutline: "add-circle-outline" },
  { name: "chat",    title: "Chat",    icon: "chatbubble",  iconOutline: "chatbubble-outline" },
  { name: "profile", title: "Profile", icon: "person",      iconOutline: "person-outline" },
];

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bone,
          borderTopColor: colors.cream,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.tan,
        tabBarInactiveTintColor: colors.taupe,
        tabBarLabelStyle: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
      }}
    >
      {TABS.map(({ name, title, icon, iconOutline }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? icon : iconOutline} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
