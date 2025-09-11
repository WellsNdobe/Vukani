// app/login.tsx
import { useAuth } from "@/context/authContext";
import { useThemeColors } from "@/hooks/useThemeColor";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const { colors } = useThemeColors("nude");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
    });

    const { token, result } = res.data;

    // Save token + user info locally
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(result));

    // ✅ If you have a global login() context:
    // login(result);

    // Navigate to main app
    router.replace("/(tabs)/Index");
  } catch (error: any) {
    alert(error.response?.data?.message || "Login failed");
  }
};

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    handleLogin();
  };

  // Complementary colors for the nude theme
  const complementaryColors = {
    inputBorder: "#d4b499", // lighter clay
    buttonPressed: "#b38a63", // darker clay
    placeholder: "#8c6b5a", // muted brown
    error: "#e76f51", // soft red for errors
    divider: "#d9c8b8", // light clay divider
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.innerContainer}>
        {/* App Logo/Name */}
        <Text style={[styles.title, { color: colors.text }]}>Vukani</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Connect and grow your career
        </Text>

        {/* Social Login Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: "#0077B5" }, // LinkedIn blue
            ]}
            onPress={() => handleSocialLogin("linkedin")}
          >
            <FontAwesome5 name="linkedin" size={20} color="white" />
            <Text style={styles.socialButtonText}>Continue with LinkedIn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: "#4285F4" }, // Google blue
            ]}
            onPress={() => handleSocialLogin("google")}
          >
            <FontAwesome5 name="google" size={20} color="white" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: complementaryColors.divider },
            ]}
          />
          <Text style={[styles.dividerText, { color: complementaryColors.placeholder }]}>
            or
          </Text>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: complementaryColors.divider },
            ]}
          />
        </View>

        {/* Email Login Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: isEmailFocused
                  ? colors.tint
                  : complementaryColors.inputBorder,
                color: colors.text,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={complementaryColors.placeholder}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: isPasswordFocused
                    ? colors.tint
                    : complementaryColors.inputBorder,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={complementaryColors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={complementaryColors.placeholder}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.tint }]}
            onPress={handleLogin}
          >
            <Text style={[styles.loginButtonText, { color: colors.background }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={{ color: complementaryColors.placeholder }}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/Auth/sign-up")}>
            <Text style={{ color: colors.tint, fontWeight: "600" }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  socialButtonsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  socialButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  formContainer: {
    gap: 20,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  loginButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
});