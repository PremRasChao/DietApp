import { View } from "react-native";
import { Image } from "expo-image";
import { User, Video, CalendarDays } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";

interface AppointmentCardProps {
  dietitian: string;
  dietitianPhoto?: string | null;
  date: string;
  time: string;
  type: string;
  isWithin15Min: boolean;
}

export function AppointmentCard({
  dietitian,
  dietitianPhoto,
  date,
  time,
  type,
  isWithin15Min,
}: AppointmentCardProps) {
  return (
    <Card variant="default" className="p-5">
      <ThemedText variant="label" color="taupe" className="mb-3">
        Upcoming appointment
      </ThemedText>

      <View className="flex-row items-center gap-4 mb-4">
        {/* Avatar — photo or fallback icon */}
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: colors.cream,
            shadowColor: colors.espresso,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          {dietitianPhoto ? (
            <Image
              source={{ uri: dietitianPhoto }}
              style={{ width: 52, height: 52 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.cream,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={22} color={colors.taupe} strokeWidth={1.5} />
            </View>
          )}
        </View>

        <View className="flex-1">
          <ThemedText variant="subheading" color="espresso">{dietitian}</ThemedText>
          <View className="flex-row items-center gap-1.5 mt-1">
            <CalendarDays size={12} color={colors.taupe} strokeWidth={1.75} />
            <ThemedText variant="caption" color="taupe">{date} · {time}</ThemedText>
          </View>
          <View className="flex-row items-center gap-1.5 mt-0.5">
            <Video size={12} color={colors.taupe} strokeWidth={1.75} />
            <ThemedText variant="caption" color="taupe">{type}</ThemedText>
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button
          label={isWithin15Min ? "Join call" : "View details"}
          variant={isWithin15Min ? "primary" : "secondary"}
          size="sm"
        />
        <Button label="Reschedule" variant="ghost" size="sm" />
      </View>
    </Card>
  );
}
