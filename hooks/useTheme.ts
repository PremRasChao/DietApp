import { useColorScheme } from "react-native";
import { theme, colors } from "@/lib/tokens";

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const current = isDark ? theme.dark : theme.light;

  return {
    isDark,
    colors,
    theme: current,
    bg: current.bg,
    text: current.text,
    cta: current.cta,
  };
}
