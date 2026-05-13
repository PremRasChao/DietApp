import { ScrollView } from "react-native";
import { Button } from "@/components/ui/Button";

const ACTIONS = ["Log food", "Find a swap", "Ask AI", "Log weight"];

export function QuickActionsRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingVertical: 2 }}
    >
      {ACTIONS.map((action) => (
        <Button key={action} label={action} variant="secondary" size="sm" />
      ))}
    </ScrollView>
  );
}
