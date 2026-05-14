import { View } from "react-native";
import { Tabs } from "expo-router";
import { Home, Calendar, CirclePlus, MessageCircle, User } from "lucide-react-native";
import { colors } from "@/lib/tokens";

type LucideIcon = React.ComponentType<{ color: string; size: number }>;

const TABS: { name: string; title: string; Icon: LucideIcon }[] = [
  { name: "index",   title: "Home",    Icon: Home },
  { name: "plan",    title: "Plan",    Icon: Calendar },
  { name: "log",     title: "Log",     Icon: CirclePlus },
  { name: "chat",    title: "Chat",    Icon: MessageCircle },
  { name: "profile", title: "Profile", Icon: User },
];

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bone,
          borderTopColor: colors.cream,
          borderTopWidth: 0.5,
          shadowColor: colors.espresso,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.tan,
        tabBarInactiveTintColor: colors.taupe,
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      {TABS.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 5,
                  borderRadius: 20,
                  backgroundColor: focused
                    ? "rgba(196, 160, 122, 0.14)"
                    : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon color={color} size={size - 1} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
