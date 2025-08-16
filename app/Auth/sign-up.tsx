// app/sign-up.tsx
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

  const handleSignUp = () => {
    // TODO: Call backend to create account
    router.replace("/Auth/sign-up");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Sign Up</Text>
      {/* Replace with a real form later */}
      <Button title="Create Account" onPress={handleSignUp} />
      <Button title="Back to Log In" onPress={() => router.replace("/Auth/login")} />
    </View>
  );
}
