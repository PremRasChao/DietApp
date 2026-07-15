import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/auth/useSession";
import { setPendingRole } from "@/lib/auth/pendingRole";
import { appColors, appGradient } from "@/lib/tokens";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

export default function RoleSelectionScreen() {
  const { session, loading } = useSession();

  if (!loading && session) return <Redirect href="/(app)" />;

  function handleRole(role: "patient" | "dietitian") {
    setPendingRole(role);
    if (role === "patient") {
      router.push("/(auth)/patient" as any);
    } else {
      router.push("/(auth)/dietitian-code" as any);
    }
  }

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 56 }}>
        <Text
          style={{
            fontFamily: "Fraunces_600SemiBold",
            fontSize: 32,
            color: appColors.onInk,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            fontFamily: "PublicSans_400Regular",
            fontSize: 15,
            color: appColors.onInkSoft,
            textAlign: "center",
            marginBottom: 44,
          }}
        >
          Tell us how you'll use Nutritionwize
        </Text>

        <RoleCard
          icon="restaurant-outline"
          iconBg="#E3ECD9"
          iconColor="#4A6B3D"
          title="I'm a patient"
          description="Track meals and work toward your goals"
          onPress={() => handleRole("patient")}
        />

        <RoleCard
          icon="clipboard-outline"
          iconBg="#F5E2D6"
          iconColor="#A9532C"
          title="I'm a dietitian"
          description="Manage your patients' plans and progress"
          onPress={() => handleRole("dietitian")}
        />
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function RoleCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  onPress,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <AnimatedPressable
      onPress={onPress}
      style={{
        backgroundColor: appColors.paper,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "PublicSans_600SemiBold",
            fontSize: 15,
            color: appColors.text,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "PublicSans_400Regular",
            fontSize: 12,
            color: appColors.textSoft,
            lineHeight: 17,
          }}
        >
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#8A8874" />
    </AnimatedPressable>
  );
}
