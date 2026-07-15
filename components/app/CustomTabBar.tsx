import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { appColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { key: string; icon: IoniconName; iconActive: IoniconName }[] = [
  { key: "index",   icon: "home-outline",        iconActive: "home" },
  { key: "plan",    icon: "restaurant-outline",   iconActive: "restaurant" },
  { key: "log",     icon: "add",                  iconActive: "add" },
  { key: "chat",    icon: "chatbubble-outline",   iconActive: "chatbubble" },
  { key: "profile", icon: "person-outline",       iconActive: "person" },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      position: "absolute",
      bottom: Math.max(insets.bottom, 12),
      left: 20, right: 20,
      backgroundColor: appColors.paper,
      borderRadius: 999,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 16,
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 9,
        paddingHorizontal: 8,
      }}>
        {TABS.map((tab, index) => {
          const focused = state.index === index;
          const isLog = tab.key === "log";

          return (
            <AnimatedPressable
              key={tab.key}
              onPress={() => navigation.navigate(tab.key)}
              scaleTo={isLog ? 0.92 : 0.85}
              hoverScale={isLog ? 1.22 : undefined}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              {isLog ? (
                <LinearGradient
                  colors={appGradient.shell}
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    alignItems: "center", justifyContent: "center",
                    transform: [{ translateY: -9 }],
                  }}
                >
                  <Ionicons name="add" size={20} color={appColors.paper} />
                </LinearGradient>
              ) : (
                <MotiView
                  animate={{ scale: focused ? 1.15 : 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 260 }}
                >
                  <Ionicons
                    name={focused ? tab.iconActive : tab.icon}
                    size={18}
                    color={focused ? appColors.text : "#8A8874"}
                  />
                </MotiView>
              )}
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}
