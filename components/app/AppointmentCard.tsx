import { View, Text } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/tokens";

interface AppointmentCardProps {
  dietitian: string;
  date: string;
  time: string;
  type: string;
  isWithin15Min: boolean;
}

export function AppointmentCard({
  dietitian,
  date,
  time,
  type,
  isWithin15Min,
}: AppointmentCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.bone,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.cream,
        overflow: "hidden",
      }}
    >
      {/* Tan accent top strip */}
      <View style={{ height: 4, backgroundColor: colors.tan }} />

      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            fontSize: 10,
            color: colors.taupe,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Upcoming appointment
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.cream,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Fraunces_700Bold",
                fontSize: 17,
                color: colors.espresso,
                marginBottom: 4,
              }}
            >
              {dietitian}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: colors.taupe,
                marginBottom: 6,
              }}
            >
              {date} · {time}
            </Text>
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 10,
                paddingVertical: 4,
                backgroundColor: isWithin15Min ? colors.tan : colors.cream,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 11,
                  color: isWithin15Min ? colors.espresso : colors.taupe,
                }}
              >
                {type}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button
            label={isWithin15Min ? "Join call" : "View details"}
            variant={isWithin15Min ? "primary" : "secondary"}
            size="sm"
          />
          <Button label="Reschedule" variant="ghost" size="sm" />
        </View>
      </View>
    </View>
  );
}
