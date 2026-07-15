import { ScrollView, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  mockUser, mockAppointment, CALORIE_GOAL,
  mockDietitian, mockDietitianStats, mockWorkHours, mockDietitianSchedule, mockDietitianClients,
  type DietitianClient,
} from "@/lib/mockData";
import { getTodayLogs } from "@/lib/food/foodLog";
import { appColors, appGradient } from "@/lib/tokens";
import { useSession } from "@/lib/auth/useSession";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { MacroDial } from "@/components/app/MacroDial";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

// ── Patient home ──────────────────────────────────────────────────────────────
function PatientHome() {
  const [kcal, setKcal]       = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs]     = useState(0);
  const [fat, setFat]         = useState(0);

  useFocusEffect(
    useCallback(() => {
      getTodayLogs().then((logs) => {
        setKcal(logs.reduce((s, e) => s + e.kcal, 0));
        setProtein(Math.round(logs.reduce((s, e) => s + e.protein_g, 0) * 10) / 10);
        setCarbs(Math.round(logs.reduce((s, e) => s + e.carbs_g, 0) * 10) / 10);
        setFat(Math.round(logs.reduce((s, e) => s + e.fat_g, 0) * 10) / 10);
      }).catch(() => {});
    }, [])
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{
        paddingTop: 60, paddingBottom: 22,
        flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <View>
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 13, color: appColors.onInkSoft }}>
            {getGreeting()}
          </Text>
          <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 26, color: appColors.onInk, marginTop: 2 }}>
            {mockUser.firstName}
          </Text>
        </View>
        <View style={{
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: appColors.inkRaised,
          alignItems: "center", justifyContent: "center",
        }}>
          <Ionicons name="notifications-outline" size={15} color={appColors.carb} />
        </View>
      </View>

      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <MacroDial kcal={kcal} goal={CALORIE_GOAL} protein={protein} carbs={carbs} fat={fat} />
      </View>

      <AnimatedPressable style={{
        backgroundColor: appColors.paper, borderRadius: 16,
        paddingVertical: 13, paddingHorizontal: 14,
        flexDirection: "row", alignItems: "center", gap: 12,
      }}>
        <View style={{ alignItems: "center", minWidth: 38 }}>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 10, color: "#8A8874", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString("en-CA", { weekday: "short" })}
          </Text>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 16, color: appColors.text }}>
            {new Date().getDate()}
          </Text>
        </View>
        <View style={{ width: 1, height: 26, backgroundColor: appColors.border }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text }}>
            Next session
          </Text>
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 11, color: appColors.textSoft, marginTop: 1 }}>
            with {mockAppointment.dietitianName}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#8A8874" />
      </AnimatedPressable>
    </ScrollView>
  );
}

// ── Dietitian home ────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<DietitianClient["status"], { bg: string; fg: string }> = {
  "On track":   { bg: "#E3ECD9", fg: "#4A6B3D" },
  "New":        { bg: "#F5E2D6", fg: "#A9532C" },
  "Review due": { bg: "#F7DEDE", fg: "#A9382C" },
};

function StatChip({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <View style={{
      flex: 1, minWidth: 130, backgroundColor: appColors.inkRaised, borderRadius: 14, padding: 12,
      borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    }}>
      <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: appColors.onInkSoft }}>{label}</Text>
      <Text style={{
        fontFamily: "PublicSans_600SemiBold", fontSize: 18, marginTop: 2,
        color: highlight ? appColors.carb : appColors.onInk,
      }}>
        {value}
      </Text>
    </View>
  );
}

function DietitianHome() {
  const { isMd } = useBreakpoint();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{
        paddingTop: 60, paddingBottom: 22,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      }}>
        <View>
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.onInkSoft }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </Text>
          <Text style={{ fontFamily: "Fraunces_600SemiBold", fontSize: 24, color: appColors.onInk, marginTop: 2 }}>
            {getGreeting()} {mockDietitian.firstName}
          </Text>
        </View>
        <View style={{
          width: 34, height: 34, borderRadius: 17,
          backgroundColor: appColors.inkRaised,
          borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.onInk }}>
            {mockDietitian.initials}
          </Text>
        </View>
      </View>

      {/* Stat cards */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        <StatChip label="Today" value={`${mockDietitianStats.sessionsToday} sessions`} />
        <StatChip label="Active clients" value={mockDietitianStats.activeClients} />
        <StatChip label="This week" value={`${mockDietitianStats.bookedThisWeek} booked`} />
        <StatChip label="Plans due review" value={mockDietitianStats.plansDueReview} highlight />
      </View>

      {/* Work hours */}
      <View style={{
        backgroundColor: appColors.inkRaised, borderRadius: 16, padding: 16, marginBottom: 20,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      }}>
        <View>
          <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: appColors.onInkSoft, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Work hours today
          </Text>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 15, color: appColors.onInk, marginTop: 3 }}>
            {mockWorkHours.today.start} – {mockWorkHours.today.end}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {mockWorkHours.week.map((d) => (
            <View key={d.day} style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 9, color: appColors.onInkSoft }}>{d.day[0]}</Text>
              <View style={{
                width: 5, height: 5, borderRadius: 2.5, marginTop: 3,
                backgroundColor: d.hours === "Off" ? "#3A5570" : appColors.fat,
              }} />
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: isMd ? "row" : "column", gap: 16 }}>
        {/* Today's schedule */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: appColors.onInkSoft, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Today's schedule
          </Text>
          <View style={{ backgroundColor: appColors.paper, borderRadius: 16, overflow: "hidden" }}>
            {mockDietitianSchedule.map((appt, i) => (
              <View key={appt.id} style={{
                flexDirection: "row", alignItems: "center", gap: 11, padding: 13,
                borderBottomWidth: i < mockDietitianSchedule.length - 1 ? 0.5 : 0,
                borderBottomColor: appColors.divider,
              }}>
                <View style={{ minWidth: 44 }}>
                  <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text }}>{appt.time}</Text>
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 9, color: "#8A8874" }}>{appt.period}</Text>
                </View>
                <View style={{
                  width: 3, height: 28, borderRadius: 2,
                  backgroundColor: appt.accent === "fat" ? appColors.fat : appColors.protein,
                }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 12, color: appColors.text }}>{appt.clientName}</Text>
                  <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: "#8A8874", marginTop: 1 }}>
                    {appt.type} · {appt.durationMin} min
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Clients */}
        <View style={{ flex: isMd ? 1.3 : 1 }}>
          <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: appColors.onInkSoft, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Your clients
          </Text>
          <View style={{ gap: 8 }}>
            {mockDietitianClients.map((client) => {
              const status = STATUS_STYLE[client.status];
              const avatarBg = status.bg;
              return (
                <AnimatedPressable key={client.id} style={{
                  backgroundColor: appColors.paper, borderRadius: 14, padding: 12,
                  flexDirection: "row", alignItems: "center", gap: 11,
                }}>
                  <View style={{
                    width: 34, height: 34, borderRadius: 17, backgroundColor: avatarBg,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 11, color: status.fg }}>
                      {client.initials}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "PublicSans_600SemiBold", fontSize: 12, color: appColors.text }}>{client.name}</Text>
                    <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 10, color: "#8A8874", marginTop: 1 }}>
                      {client.planName}{client.weekTotal > 0 ? ` · wk ${client.weekOf} of ${client.weekTotal}` : ""}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: status.bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontFamily: "PublicSans_500Medium", fontSize: 9, color: status.fg }}>{client.status}</Text>
                  </View>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ────────────────────────────────────────────────────────────────────────────
export default function AppHome() {
  const { session } = useSession();
  const isDietitian = session?.user?.user_metadata?.role === "dietitian";

  return (
    <LinearGradient colors={appGradient.shell} style={{ flex: 1 }}>
      {isDietitian ? <DietitianHome /> : <PatientHome />}
    </LinearGradient>
  );
}
