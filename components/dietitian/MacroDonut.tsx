import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { appColors } from "@/lib/tokens";
import type { Nutrition } from "@/lib/mealPlan/types";
import { macroCalorieSplit } from "@/lib/mealPlan/nutrition";

// Macro colours reused across the builder (protein / carbs / fat).
export const MACRO_COLORS = {
  protein: appColors.protein, // clay
  carbs:   appColors.carb,    // sage
  fat:     appColors.fat,     // forest
} as const;

type Props = {
  nutrition: Nutrition;
  size?: number;
  stroke?: number;
  centerLabel?: string;
  centerSub?: string;
};

// A donut split into protein/carbs/fat arcs by calorie contribution.
export function MacroDonut({ nutrition, size = 160, stroke = 18, centerLabel, centerSub }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const split = macroCalorieSplit(nutrition);
  const segments = [
    { key: "protein", frac: split.protein, color: MACRO_COLORS.protein },
    { key: "carbs",   frac: split.carbs,   color: MACRO_COLORS.carbs },
    { key: "fat",     frac: split.fat,     color: MACRO_COLORS.fat },
  ];
  const hasData = split.protein + split.carbs + split.fat > 0;

  let offset = 0;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          {/* Track */}
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={appColors.paperDim} strokeWidth={stroke} fill="none" />
          {hasData && segments.map((s) => {
            const len = s.frac * c;
            const el = (
              <Circle
                key={s.key}
                cx={size / 2} cy={size / 2} r={r}
                stroke={s.color} strokeWidth={stroke} fill="none"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
        </G>
      </Svg>
      {(centerLabel || centerSub) && (
        <View style={{ position: "absolute", alignItems: "center" }}>
          {centerLabel != null && (
            <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: size * 0.16, color: appColors.text }}>
              {centerLabel}
            </Text>
          )}
          {centerSub != null && (
            <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: size * 0.075, color: appColors.textSoft, marginTop: 2 }}>
              {centerSub}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
