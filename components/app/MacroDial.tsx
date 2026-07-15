import { useEffect, useState } from "react";
import { View, Text, AccessibilityInfo } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { appColors } from "@/lib/tokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 90;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICK_COUNT = 48;

function TickRing() {
  const ticks = [];
  for (let i = 0; i < TICK_COUNT; i++) {
    const angle = (i / TICK_COUNT) * 360;
    const major = i % 4 === 0;
    ticks.push(
      <Line
        key={i}
        x1={CENTER} y1={major ? 14 : 18}
        x2={CENTER} y2={24}
        stroke={appColors.onInk}
        strokeWidth={major ? 2 : 1}
        opacity={major ? 0.5 : 0.25}
        transform={`rotate(${angle} ${CENTER} ${CENTER})`}
      />
    );
  }
  return <>{ticks}</>;
}

function Chip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center", gap: 6,
      backgroundColor: appColors.inkRaised,
      paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999,
    }}>
      <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: color }} />
      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.onInkSoft }}>
        {label}
      </Text>
      <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.onInk }}>
        {value}g
      </Text>
    </View>
  );
}

export function MacroDial({
  kcal, goal, protein, carbs, fat,
}: {
  kcal: number; goal: number; protein: number; carbs: number; fat: number;
}) {
  const pct = Math.min(goal > 0 ? kcal / goal : 0, 1);
  const sweep = useSharedValue(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      sweep.value = pct;
      return;
    }
    sweep.value = withTiming(pct, {
      duration: 1100,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [pct, reduceMotion]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - sweep.value),
  }));

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <TickRing />
          <Circle
            cx={CENTER} cy={CENTER} r={RADIUS} fill="none"
            stroke={appColors.inkRaised} strokeWidth={STROKE}
          />
          <AnimatedCircle
            cx={CENTER} cy={CENTER} r={RADIUS} fill="none"
            stroke={appColors.fat} strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        </Svg>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 32, color: appColors.onInk }}>
            {kcal.toLocaleString()}
          </Text>
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.onInkSoft, marginTop: 2 }}>
            of {goal.toLocaleString()} kcal
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 18 }}>
        <Chip label="P" value={Math.round(protein)} color={appColors.protein} />
        <Chip label="C" value={Math.round(carbs)} color={appColors.carb} />
        <Chip label="F" value={Math.round(fat)} color={appColors.fat} />
      </View>
    </View>
  );
}
