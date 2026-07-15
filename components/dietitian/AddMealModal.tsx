import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appColors } from "@/lib/tokens";
import { MEAL_TYPE_PRESETS } from "@/lib/mealPlan/presets";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (presetId: string) => void;
};

// Overlay meal-type picker (PRD §4). 3-column grid of plain option buttons.
export function AddMealModal({ visible, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(28,25,23,0.45)", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 640, backgroundColor: appColors.paper, borderRadius: 20, padding: 24 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <Text style={{ fontFamily: "PublicSans_700Bold", fontSize: 20, color: appColors.text }}>Add new meal</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={appColors.textSoft} />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {MEAL_TYPE_PRESETS.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => { onSelect(p.id); onClose(); }}
                style={({ pressed }) => ({
                  // 3 columns: subtract the two 12px gaps, divide by 3.
                  width: "31.5%", flexGrow: 1,
                  borderWidth: 1, borderColor: appColors.border, borderRadius: 12,
                  paddingVertical: 16, paddingHorizontal: 16,
                  backgroundColor: pressed ? appColors.paperDim : appColors.paper,
                })}
              >
                <Text style={{ fontFamily: "PublicSans_400Regular", fontSize: 15, color: appColors.text }}>{p.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
