import "../global.css";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Fraunces_300Light,
  Fraunces_700Bold,
  Fraunces_700Bold_Italic,
} from "@expo-google-fonts/fraunces";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Fraunces_300Light,
    Fraunces_700Bold,
    Fraunces_700Bold_Italic,
  });

  // Render immediately — fonts enhance but don't block
  return (
    <View style={{ flex: 1, backgroundColor: "#FAF8F5" }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(marketing)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </View>
  );
}
