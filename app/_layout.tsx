// app/_layout.tsx
import { AuthProvider, useAuth } from "@/context/authContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

function AuthenticatedStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack>
      <Stack.Screen name="Auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="Auth/sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  return user ? <AuthenticatedStack /> : <UnauthenticatedStack />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
