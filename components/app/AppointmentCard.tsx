import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";

interface AppointmentCardProps {
  dietitian: string;
  date: string;
  time: string;
  type: string;
  isWithin15Min: boolean;
}

export function AppointmentCard({ dietitian, date, time, type, isWithin15Min }: AppointmentCardProps) {
  return (
    <Card variant="default" className="p-5">
      <ThemedText variant="label" color="taupe" className="mb-3">Upcoming appointment</ThemedText>
      <View className="flex-row items-center gap-4 mb-4">
        <View className="w-12 h-12 rounded-full bg-cream items-center justify-center">
          <ThemedText variant="subheading" color="taupe">👤</ThemedText>
        </View>
        <View className="flex-1">
          <ThemedText variant="subheading" color="espresso">{dietitian}</ThemedText>
          <ThemedText variant="caption" color="taupe">{date} · {time}</ThemedText>
          <ThemedText variant="caption" color="taupe">{type}</ThemedText>
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
