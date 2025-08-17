// app/_layout.tsx
import { AuthProvider } from "@/context/authContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot /> 
        </GestureHandlerRootView>
      </ThemeProvider>
    </AuthProvider>
    </SafeAreaView >
  );
}
