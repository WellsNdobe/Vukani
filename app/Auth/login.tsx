// app/login.tsx
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login({ id: "1", name: "Demo User" }); // Replace with real auth
    router.replace("/(tabs)/Index");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Log In</Text>
      {/* Replace with a real form later */}
      <Button title="Log In" onPress={handleLogin} />
      <Button title="Go to Sign Up" onPress={() => router.push("/Auth/sign-up")} />
    </View>
  );
}
