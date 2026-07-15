import { createContext, useCallback, useContext, useRef, type ReactNode } from "react";
import { View, type LayoutChangeEvent, type ScrollView } from "react-native";

type Ctx = {
  scrollRef: React.RefObject<ScrollView | null>;
  register: (id: string, y: number) => void;
  scrollTo: (id: string) => void;
};

const MarketingScrollContext = createContext<Ctx | null>(null);

export function MarketingScrollProvider({
  scrollRef,
  children,
}: {
  scrollRef: React.RefObject<ScrollView | null>;
  children: ReactNode;
}) {
  const positions = useRef<Record<string, number>>({});

  const register = useCallback((id: string, y: number) => {
    positions.current[id] = y;
  }, []);

  const scrollTo = useCallback(
    (id: string) => {
      const y = positions.current[id];
      if (y != null) scrollRef.current?.scrollTo({ y, animated: true });
    },
    [scrollRef],
  );

  return (
    <MarketingScrollContext.Provider value={{ scrollRef, register, scrollTo }}>
      {children}
    </MarketingScrollContext.Provider>
  );
}

export function useMarketingScroll() {
  const ctx = useContext(MarketingScrollContext);
  if (!ctx) throw new Error("useMarketingScroll must be used within MarketingScrollProvider");
  return ctx;
}

/** Wraps a landing-page section so the nav can scroll to it by id. */
export function Section({ id, children }: { id: string; children: ReactNode }) {
  const { register } = useMarketingScroll();
  const onLayout = useCallback(
    (e: LayoutChangeEvent) => register(id, e.nativeEvent.layout.y),
    [id, register],
  );
  return <View onLayout={onLayout}>{children}</View>;
}
