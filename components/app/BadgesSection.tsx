import { ScrollView, View } from "react-native";
import {
  ArrowLeftRight,
  Calendar,
  Flame,
  Star,
  Target,
  Trophy,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/lib/tokens";
import { shadows } from "@/lib/tokens";
import type { Badge, BadgeIcon } from "@/lib/mockData";

const ICON_MAP: Record<BadgeIcon, LucideIcon> = {
  star:           Star,
  flame:          Flame,
  target:         Target,
  zap:            Zap,
  arrowLeftRight: ArrowLeftRight,
  trophy:         Trophy,
  calendar:       Calendar,
  video:          Video,
};

function BadgeChip({ badge }: { badge: Badge }) {
  const Icon = ICON_MAP[badge.icon];
  const earned = badge.earned;

  return (
    <View
      style={[
        {
          width: 80,
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 8,
          alignItems: "center",
          gap: 8,
          backgroundColor: earned ? colors.cream : colors.bone,
          borderWidth: 1,
          borderColor: earned ? colors.cream : colors.cream,
          opacity: earned ? 1 : 0.55,
        },
        earned ? shadows.sm : {},
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: earned
            ? "rgba(138, 174, 133, 0.22)"
            : "rgba(122, 101, 87, 0.10)",
        }}
      >
        <Icon
          size={18}
          color={earned ? colors.sage : colors.taupe}
          strokeWidth={1.8}
        />
      </View>

      <View style={{ alignItems: "center", gap: 2 }}>
        <ThemedText
          variant="label"
          color={earned ? "espresso" : "taupe"}
          style={{ textAlign: "center", lineHeight: 14 }}
        >
          {badge.title}
        </ThemedText>
        {earned && badge.earnedDate && (
          <ThemedText
            variant="label"
            color="taupe"
            style={{ fontSize: 9, textAlign: "center", lineHeight: 12 }}
          >
            {badge.earnedDate.replace(", 2026", "")}
          </ThemedText>
        )}
        {!earned && (
          <ThemedText
            variant="label"
            color="taupe"
            style={{ fontSize: 9, textAlign: "center", lineHeight: 12 }}
          >
            Locked
          </ThemedText>
        )}
      </View>
    </View>
  );
}

interface BadgesSectionProps {
  badges: Badge[];
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  const ordered = [...earned, ...locked];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingHorizontal: 2, paddingVertical: 4 }}
    >
      {ordered.map((badge) => (
        <BadgeChip key={badge.id} badge={badge} />
      ))}
    </ScrollView>
  );
}
