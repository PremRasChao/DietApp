import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/auth/useSession";
import { setPendingRole } from "@/lib/auth/pendingRole";
import { colors } from "@/lib/tokens";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.linen }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 56 }}>
        <Text
          style={{
            fontFamily: "Fraunces_700Bold",
            fontSize: 38,
            color: colors.ink,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Welcome
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            color: colors.stone,
            textAlign: "center",
            marginBottom: 52,
          }}
        >
          Tell us how you'll use Nutrition Wize
        </Text>

        <RoleCard
          icon="person-outline"
          iconBg={colors.sage + "25"}
          iconColor={colors.forest}
          title="I'm a Patient"
          description="Track your nutrition and work toward your health goals"
          onPress={() => handleRole("patient")}
        />

        <RoleCard
          icon="briefcase-outline"
          iconBg={colors.clay + "18"}
          iconColor={colors.clay}
          title="I'm a Dietitian"
          description="Access your professional dashboard and manage patients"
          onPress={() => handleRole("dietitian")}
        />
      </View>
    </SafeAreaView>
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#f0ede5" : colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
      })}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
        }}
      >
        <Ionicons name={icon as any} size={26} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 17,
            color: colors.ink,
            marginBottom: 3,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: colors.stone,
            lineHeight: 18,
          }}
        >
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.stone} style={{ marginLeft: 8 }} />
    </Pressable>
  );
}
