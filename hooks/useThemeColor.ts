// hooks/useThemeColors.ts
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "nude";

export function useThemeColors(preferred?: ThemeMode) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null
  const [customScheme, setCustomScheme] = useState<ThemeMode | null>(null);

  // Decide which theme to use
  const theme: ThemeMode = customScheme || preferred || (systemScheme === "dark" ? "dark" : "light");

  return {
    colors: Colors[theme],
    setTheme: setCustomScheme, // allows you to toggle manually
    theme,
  };
}
