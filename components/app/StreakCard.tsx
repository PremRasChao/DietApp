import { View } from "react-native";
import { MotiView } from "moti";
import { CalendarCheck, Flame } from "lucide-react-native";
import { useReducedMotion } from "react-native-reanimated";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";

interface StreakCardProps {
  logging:   { count: number; nextMilestone: number };
  adherence: { count: number; nextMilestone: number };
}

function ProgressDots({ count, milestone }: { count: number; milestone: number }) {
  const visible = Math.min(milestone, 7);
  const filled = count % milestone;
  return (
    <View className="flex-row gap-1">
      {Array.from({ length: visible }).map((_, i) => (
        <View
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: i < filled ? colors.tan : colors.cream }}
        />
      ))}
    </View>
  );
}

export function StreakCard({ logging, adherence }: StreakCardProps) {
  const reducedMotion = useReducedMotion();
  const loggingLeft   = logging.nextMilestone - logging.count;
  const adherenceLeft = adherence.nextMilestone - adherence.count;

  return (
    <Card variant="cream" className="p-4 gap-3">
      {/* Logging streak row */}
      <View className="flex-row items-center gap-3">
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: reducedMotion ? 1 : 1.07 }}
          transition={
            reducedMotion
              ? { type: "timing", duration: 0 }
              : { type: "timing", duration: 750, loop: true, repeatReverse: true }
          }
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(196, 160, 122, 0.18)" }}
          >
            <Flame size={20} color={colors.tan} strokeWidth={1.75} />
          </View>
        </MotiView>

        <View className="flex-1">
          <ThemedText variant="subheading" color="espresso">
            {logging.count} day streak
          </ThemedText>
          <ThemedText variant="caption" color="taupe" className="mt-0.5">
            {loggingLeft} more {loggingLeft === 1 ? "day" : "days"} to {logging.nextMilestone}-day milestone
          </ThemedText>
        </View>

        <ProgressDots count={logging.count} milestone={logging.nextMilestone} />
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: colors.bone, marginHorizontal: 2 }} />

      {/* Plan adherence streak row */}
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(138, 174, 133, 0.16)" }}
        >
          <CalendarCheck size={18} color={colors.sage} strokeWidth={1.75} />
        </View>

        <View className="flex-1">
          <ThemedText variant="caption" color="espresso">
            {adherence.count}-week plan streak
          </ThemedText>
          <ThemedText variant="label" color="taupe" className="mt-0.5">
            {adherenceLeft} more {adherenceLeft === 1 ? "week" : "weeks"} to {adherence.nextMilestone}-week milestone
          </ThemedText>
        </View>

        <ProgressDots count={adherence.count} milestone={adherence.nextMilestone} />
      </View>
    </Card>
  );
}
