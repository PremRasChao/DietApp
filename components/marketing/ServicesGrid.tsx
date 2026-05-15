import { View, Text } from "react-native";
import { mockServices } from "@/lib/mockData";
import { Card } from "@/components/ui/Card";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function ServicesGrid() {
  const { isMd } = useBreakpoint();

  return (
    <View className="bg-bone px-6 py-16">
      <View className="max-w-screen-lg mx-auto w-full">
        <Text
          className="text-espresso text-3xl mb-2 text-center"
          style={{ fontFamily: "Fraunces_700Bold" }}
        >
          Our Services
        </Text>
        <Text
          className="text-taupe text-base text-center mb-10"
          style={{ fontFamily: "Inter_400Regular" }}
        >
          Specialised care for every nutrition goal
        </Text>

        <View className={isMd ? "flex-row flex-wrap gap-4" : "flex-col gap-4"}>
          {mockServices.map((service) => (
            <View
              key={service.id}
              className={isMd ? "flex-1 min-w-[30%]" : "w-full"}
            >
              <Card className="h-full">
                <Text className="text-3xl mb-3">{service.icon}</Text>
                <Text
                  className="text-espresso text-lg mb-2"
                  style={{ fontFamily: "Fraunces_700Bold" }}
                >
                  {service.title}
                </Text>
                <Text
                  className="text-taupe text-sm leading-relaxed"
                  style={{ fontFamily: "Inter_400Regular" }}
                >
                  {service.description}
                </Text>
              </Card>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
