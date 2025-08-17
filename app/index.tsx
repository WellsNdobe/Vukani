// app/index.tsx
import { useAuth } from "@/context/authContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user } = useAuth();

  // While auth is still loading, show spinner
  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on auth state
  if (!user) {
    return <Redirect href="/Auth/login" />;
  }

  return <Redirect href="/(tabs)/Index" />;
}
