import { View, Text, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/lib/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { key: string; label: string; icon: IoniconName; iconActive: IoniconName }[] = [
  { key: "index",   label: "Home",  icon: "home-outline",       iconActive: "home" },
  { key: "plan",    label: "Meals", icon: "restaurant-outline",  iconActive: "restaurant" },
  { key: "log",     label: "Log",   icon: "add-outline",        iconActive: "add" },
  { key: "chat",    label: "Chat",  icon: "chatbubble-outline",  iconActive: "chatbubble" },
  { key: "profile", label: "Me",    icon: "person-outline",     iconActive: "person" },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      position: "absolute",
      bottom: 0, left: 0, right: 0,
      paddingBottom: insets.bottom,
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderTopColor: "#EDEAE3",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 16,
    }}>
      <View style={{
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 4,
        paddingHorizontal: 8,
      }}>
        {TABS.map((tab, index) => {
          const focused = state.index === index;
          const isLog = tab.key === "log";

          return (
            <Pressable
              key={tab.key}
              onPress={() => navigation.navigate(tab.key)}
              style={({ pressed }) => ({
                flex: 1, alignItems: "center", justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              {isLog ? (
                // Centre log button — large forest green circle
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: colors.forest,
                  alignItems: "center", justifyContent: "center",
                  marginTop: -20,
                  shadowColor: colors.forest,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 8,
                }}>
                  <Ionicons name="add" size={28} color={colors.white} />
                </View>
              ) : (
                <View style={{ alignItems: "center", gap: 3 }}>
                  <View style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: focused ? `${colors.forest}1A` : "transparent",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Ionicons
                      name={focused ? tab.iconActive : tab.icon}
                      size={22}
                      color={focused ? colors.forest : colors.stone}
                    />
                  </View>
                  <Text style={{
                    fontFamily: focused ? "Inter_600SemiBold" : "Inter_400Regular",
                    fontSize: 10,
                    color: focused ? colors.forest : colors.stone,
                    letterSpacing: 0.2,
                  }}>
                    {tab.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
