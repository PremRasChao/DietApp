import { ScrollView, View, Text, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { mockUser, mockAppointment, mockStreak, mockWeeklyProgress, CALORIE_GOAL } from "@/lib/mockData";
import { getTodayLogs } from "@/lib/food/foodLog";
import { colors, macroColors } from "@/lib/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

// ── KPI stat card — matches screenshots exactly ───────────────────────────────
function StatCard({
  icon, iconBg, iconColor, value, unit, label, sub,
}: {
  icon: IoniconName; iconBg: string; iconColor: string;
  value: string | number; unit: string; label: string; sub: string;
}) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    }}>
      <View style={{
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: iconBg,
        alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
        <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 32, color: colors.ink, lineHeight: 34 }}>
          {value}
        </Text>
        {unit ? (
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone }}>{unit}</Text>
        ) : null}
      </View>
      <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.ink, marginBottom: 3 }}>
        {label}
      </Text>
      <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone }}>
        {sub}
      </Text>
    </View>
  );
}

// ── Calorie ring + macro bars — matches screenshot 2 ─────────────────────────
const RING = 140;
const STROKE = 10;
const R = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

function CalorieGoalCard({
  kcal, goal, protein, carbs, fat,
  proteinGoal, carbsGoal, fatGoal,
}: {
  kcal: number; goal: number; protein: number; carbs: number; fat: number;
  proteinGoal: number; carbsGoal: number; fatGoal: number;
}) {
  const pct = Math.min(kcal / goal, 1);
  const remaining = Math.max(goal - kcal, 0);

  return (
    <View style={{
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <View>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 17, color: colors.ink }}>Calorie goal</Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone, marginTop: 2 }}>
            {remaining} kcal left to reach today's target
          </Text>
        </View>
        <View style={{
          paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
          backgroundColor: `${colors.sage}1A`,
        }}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 12, color: colors.sage }}>
            {Math.round((1 - pct) * 100)}% left
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 28 }}>
        {/* Ring */}
        <View style={{ width: RING, height: RING }}>
          <Svg width={RING} height={RING}>
            <Circle cx={RING / 2} cy={RING / 2} r={R} stroke="#E8E4DC" strokeWidth={STROKE} fill="none" />
            <Circle
              cx={RING / 2} cy={RING / 2} r={R}
              stroke={colors.forest} strokeWidth={STROKE} fill="none"
              strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)}
              strokeLinecap="round"
              transform={`rotate(-90, ${RING / 2}, ${RING / 2})`}
            />
          </Svg>
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 30, color: colors.ink, lineHeight: 32 }}>
              {kcal.toLocaleString()}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: colors.stone, marginTop: 2 }}>
              of {goal.toLocaleString()} kcal
            </Text>
          </View>
        </View>

        {/* Macro bars */}
        <View style={{ flex: 1, gap: 14 }}>
          {[
            { label: "Protein", value: protein, goal: proteinGoal, color: macroColors.protein },
            { label: "Carbs",   value: carbs,   goal: carbsGoal,   color: macroColors.carbs },
            { label: "Fat",     value: fat,      goal: fatGoal,     color: macroColors.fat },
          ].map(({ label, value, goal: g, color }) => (
            <View key={label}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
                  <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.ink }}>{label}</Text>
                </View>
                <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: colors.stone }}>
                  {Math.round(value)} / {g} g
                </Text>
              </View>
              <View style={{ height: 6, backgroundColor: "#E8E4DC", borderRadius: 3 }}>
                <View style={{ width: `${Math.min(value / g, 1) * 100}%`, height: 6, backgroundColor: color, borderRadius: 3 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
export default function AppHome() {
  const router = useRouter();
  const [kcal, setKcal]         = useState(0);
  const [protein, setProtein]   = useState(0);
  const [carbs, setCarbs]       = useState(0);
  const [fat, setFat]           = useState(0);

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

  const remaining = Math.max(CALORIE_GOAL - kcal, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.linen }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={{
          paddingTop: 60, paddingBottom: 8,
          flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between",
        }}>
          <View>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: colors.stone }}>
              {getGreeting()}
            </Text>
            <Text style={{ fontFamily: "Fraunces_700Bold", fontSize: 38, color: colors.ink, lineHeight: 42 }}>
              {mockUser.firstName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={26} color={colors.ink} />
              <View style={{
                position: "absolute", top: -2, right: -2,
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: colors.clay, borderWidth: 1.5, borderColor: colors.linen,
              }} />
            </View>
            <View style={{
              width: 38, height: 38, borderRadius: 10,
              backgroundColor: colors.forest,
              alignItems: "center", justifyContent: "center",
            }}>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.white }}>
                {mockUser.firstName.charAt(0)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── My stats ── */}
        <View style={{ marginTop: 28 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 17, color: colors.ink }}>My stats</Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: colors.stone }}>Today</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
            <StatCard
              icon="flame-outline" iconBg={`${colors.clay}1A`} iconColor={colors.clay}
              value={kcal.toLocaleString()} unit="kcal"
              label="Calories today"
              sub={`${remaining} left of ${CALORIE_GOAL.toLocaleString()} goal`}
            />
            <StatCard
              icon="trending-up-outline" iconBg={`${colors.sage}1A`} iconColor={colors.sage}
              value={mockStreak.count} unit="days"
              label="Day streak"
              sub="Your personal best 🔥"
            />
          </View>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <StatCard
              icon="barbell-outline" iconBg={`${colors.sage}1A`} iconColor={colors.sage}
              value={Math.round(protein)} unit="g"
              label="Protein today"
              sub="of 120 g goal"
            />
            <StatCard
              icon="calendar-outline" iconBg={`${colors.stone}1A`} iconColor={colors.stone}
              value="Fri" unit="May 16"
              label="Next session"
              sub={mockAppointment.dietitianName}
            />
          </View>
        </View>

        {/* ── Calorie goal ring card ── */}
        <View style={{ marginTop: 20 }}>
          <CalorieGoalCard
            kcal={kcal} goal={CALORIE_GOAL}
            protein={protein} carbs={carbs} fat={fat}
            proteinGoal={120} carbsGoal={220} fatGoal={65}
          />
        </View>

        {/* ── Upcoming session ── */}
        <View style={{
          marginTop: 20,
          backgroundColor: colors.white,
          borderRadius: 20,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 2,
        }}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 11, color: colors.stone, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 16 }}>
            Upcoming session
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: colors.forest,
              alignItems: "center", justifyContent: "center",
            }}>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.white }}>SC</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 16, color: colors.ink }}>
                {mockAppointment.dietitianName}
              </Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 }}>
                <Text style={{ color: colors.stone }}>Nutrition check-in · Video call · </Text>
                <Text style={{ color: colors.clay }}>
                  {mockAppointment.date} · {mockAppointment.time}
                </Text>
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Pressable
              style={({ pressed }) => ({
                flex: 1, paddingVertical: 12, borderRadius: 12,
                borderWidth: 1, borderColor: "#E0DBD2",
                alignItems: "center", opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: colors.stone }}>Reschedule</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => ({
                flex: 2, paddingVertical: 12, borderRadius: 12,
                backgroundColor: colors.forest,
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ fontFamily: "Inter_700Bold", fontSize: 14, color: colors.white }}>View details</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </Pressable>
          </View>
        </View>

        {/* ── Weekly activity ── */}
        <View style={{
          marginTop: 20,
          backgroundColor: colors.white,
          borderRadius: 20,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 2,
        }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 17, color: colors.ink }}>Weekly activity</Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: colors.stone }}>Last 7 days</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 56 }}>
            {mockWeeklyProgress.map(({ day, kcal: k }) => {
              const h = Math.max(8, (k / 2400) * 56);
              const today = new Date().toLocaleDateString("en-CA", { weekday: "short" }).slice(0, 3);
              const isToday = day === today;
              return (
                <View key={day} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                  <View style={{
                    width: "100%", height: h, borderRadius: 6,
                    backgroundColor: isToday ? colors.forest : "#E0DBD2",
                  }} />
                  <Text style={{
                    fontFamily: isToday ? "Inter_700Bold" : "Inter_400Regular",
                    fontSize: 11, color: isToday ? colors.forest : colors.stone,
                  }}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
