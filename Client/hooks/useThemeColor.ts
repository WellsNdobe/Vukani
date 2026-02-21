import { Colors, ThemeName } from "@/constants/Colors";
import { useState } from "react";
import { useColorScheme } from "react-native";

export function useThemeColors(preferred?: ThemeName) {
  const systemScheme = useColorScheme();
  const [customScheme, setCustomScheme] = useState<ThemeName | null>(null);

  const theme: ThemeName =
    customScheme || preferred || (systemScheme === "dark" ? "dark" : "light");

  return {
    colors: Colors[theme],
    setTheme: setCustomScheme,
    theme,
  };
}
