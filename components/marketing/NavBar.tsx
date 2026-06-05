import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { colors } from "@/lib/tokens";

const NAV_LINKS = ["About", "Services", "Dietitians", "Blog", "Shop"];

export function NavBar() {
  const { isMd } = useBreakpoint();

  return (
    <View
      style={{
        backgroundColor: colors.bone,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream,
        shadowColor: colors.espresso,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        zIndex: 50,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: isMd ? 48 : 20,
          paddingVertical: 18,
          maxWidth: 1280,
          alignSelf: "center",
          width: "100%",
        }}
      >
        {/* Logo mark + wordmark */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 36, height: 36, borderRadius: 11,
              backgroundColor: colors.espresso,
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 18, color: colors.tan }}>N</Text>
          </View>
          <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 20, color: colors.espresso }}>
            Nutrition Wize
          </Text>
        </View>

        {/* Desktop nav */}
        {isMd && (
          <View style={{ flex: 2, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <Pressable
                key={link}
                style={({ pressed }) => ({
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
                  backgroundColor: pressed ? colors.cream : "transparent",
                })}
              >
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.espresso }}>
                  {link}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* CTAs */}
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
          {isMd && (
            <Pressable
              style={({ pressed }) => ({
                paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10,
                borderWidth: 1, borderColor: colors.cream, opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: colors.taupe }}>
                Check insurance
              </Text>
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 6,
              paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12,
              backgroundColor: colors.espresso, opacity: pressed ? 0.85 : 1,
              shadowColor: colors.espresso,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
            })}
          >
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.bone }}>
              Book now
            </Text>
            <Ionicons name="arrow-forward" size={14} color={colors.tan} />
          </Pressable>
          {!isMd && (
            <Pressable style={{ padding: 8 }}>
              <Ionicons name="menu-outline" size={24} color={colors.espresso} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
