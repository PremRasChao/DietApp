import { useWindowDimensions } from "react-native";

// Breakpoints align with Tailwind defaults: sm=640, md=768, lg=1024, xl=1280
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoint() {
  const { width } = useWindowDimensions();

  const is = (bp: Breakpoint): boolean => width >= BREAKPOINTS[bp];

  return {
    width,
    isSm: is("sm"),
    isMd: is("md"),
    isLg: is("lg"),
    isXl: is("xl"),
    is,
  };
}
