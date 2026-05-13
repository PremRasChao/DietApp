import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

function makeStorage() {
  if (Platform.OS !== "web") {
    return {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) =>
        SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };
  }
  // Web: localStorage is only available in the browser, not during SSR
  return {
    getItem: (key: string) => {
      if (typeof localStorage === "undefined") return Promise.resolve(null);
      return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key: string, value: string) => {
      if (typeof localStorage === "undefined") return Promise.resolve();
      return Promise.resolve(localStorage.setItem(key, value));
    },
    removeItem: (key: string) => {
      if (typeof localStorage === "undefined") return Promise.resolve();
      return Promise.resolve(localStorage.removeItem(key));
    },
  };
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: makeStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
