import { View } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useReducedMotion,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { Flame } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE   = 76;
const STROKE_W    = 7;
const RADIUS      = (RING_SIZE - STROKE_W) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ progress }: { progress: number }) {
  const reducedMotion = useReducedMotion();
  const animated = useSharedValue(0);

  useEffect(() => {
    animated.value = withTiming(progress, {
      duration: reducedMotion ? 0 : 900,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - animated.value),
  }));

  return (
    <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: "-90deg" }] }}>
      {/* Track */}
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={colors.cream}
        strokeWidth={STROKE_W}
        fill="none"
      />
      {/* Fill */}
      <AnimatedCircle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={colors.sage}
        strokeWidth={STROKE_W}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        animatedProps={animatedProps}
      />
    </Svg>
  );
}

function MacroDot({ hit, label }: { hit: boolean; label: string }) {
  return (
    <View style={{ alignItems: "center", gap: 3 }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: hit ? colors.sage : colors.cream,
          borderWidth: hit ? 0 : 1,
          borderColor: colors.taupe,
        }}
      />
      <ThemedText variant="label" color="taupe" style={{ fontSize: 9 }}>
        {label}
      </ThemedText>
    </View>
  );
}

interface WeeklySummaryCardProps {
  weekLabel:         string;
  daysLogged:        number;
  totalDays:         number;
  calorieGoalDays:   number;
  calorieGoalTarget: number;
  macrosHit:         { protein: boolean; carbs: boolean; fat: boolean };
  streakMaintained:  boolean;
}

export function WeeklySummaryCard({
  weekLabel,
  daysLogged,
  totalDays,
  calorieGoalDays,
  calorieGoalTarget,
  macrosHit,
  streakMaintained,
}: WeeklySummaryCardProps) {
  const ringProgress = daysLogged / totalDays;

  return (
    <Card variant="dark" className="p-5">
      {/* Header */}
      <View className="flex-row items-baseline justify-between mb-4">
        <ThemedText variant="subheading" color="bone">Weekly summary</ThemedText>
        <ThemedText variant="label" color="taupe">{weekLabel}</ThemedText>
      </View>

      {/* Body row */}
      <View className="flex-row items-center gap-5">
        {/* Ring + day label */}
        <View style={{ alignItems: "center", gap: 6 }}>
          <View style={{ position: "relative", width: RING_SIZE, height: RING_SIZE }}>
            <ProgressRing progress={ringProgress} />
            <View
              style={{
                position: "absolute",
                inset: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText variant="subheading" color="bone">
                {daysLogged}/{totalDays}
              </ThemedText>
            </View>
          </View>
          <ThemedText variant="label" color="taupe">days logged</ThemedText>
        </View>

        {/* Stats column */}
        <View style={{ flex: 1, gap: 10 }}>
          {/* Calorie goal stat */}
          <View>
            <ThemedText variant="caption" color="bone">
              {calorieGoalDays} of {calorieGoalTarget} calorie goals hit
            </ThemedText>
            <View
              style={{
                height: 4,
                backgroundColor: "rgba(237, 229, 216, 0.14)",
                borderRadius: 4,
                marginTop: 6,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${(calorieGoalDays / calorieGoalTarget) * 100}%`,
                  height: 4,
                  backgroundColor: colors.tan,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>

          {/* Macros row */}
          <View>
            <ThemedText variant="label" color="taupe" className="mb-2">
              Macros hit
            </ThemedText>
            <View className="flex-row gap-4">
              <MacroDot hit={macrosHit.protein} label="Protein" />
              <MacroDot hit={macrosHit.carbs}   label="Carbs"   />
              <MacroDot hit={macrosHit.fat}      label="Fat"     />
            </View>
          </View>

          {/* Streak status */}
          {streakMaintained && (
            <View
              className="flex-row items-center gap-1.5 self-start rounded-full px-3 py-1"
              style={{ backgroundColor: "rgba(196, 160, 122, 0.18)" }}
            >
              <Flame size={11} color={colors.tan} strokeWidth={1.8} />
              <ThemedText variant="label" color="tan" style={{ fontSize: 11 }}>
                Streak maintained
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}
