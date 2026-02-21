// app/sign-up.tsx
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
import { apiClient } from "@/constants/apiClient";

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useThemeColors("nude");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

const handleSignUp = async () => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await apiClient.post("/auth/register", {
      name,
      email,
      password,
      // no role sent → backend defaults to "user"
    });

    alert("Account created successfully!");
    router.replace("/Auth/login");
  } catch (error: any) {
    alert(error.response?.data?.message || "Registration failed");
  }
};

  const handleSocialSignUp = (provider: string) => {
    console.log(`Signing up with ${provider}`);
    router.replace("/Auth/login");
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
          Start your professional journey
        </Text>

        {/* Social Sign Up Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: "#0077B5" }, // LinkedIn blue
            ]}
            onPress={() => handleSocialSignUp("linkedin")}
          >
            <FontAwesome5 name="linkedin" size={20} color="white" />
            <Text style={styles.socialButtonText}>Sign up with LinkedIn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: "#4285F4" }, // Google blue
            ]}
            onPress={() => handleSocialSignUp("google")}
          >
            <FontAwesome5 name="google" size={20} color="white" />
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
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

        {/* Sign Up Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: isNameFocused
                  ? colors.tint
                  : complementaryColors.inputBorder,
                color: colors.text,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="Full Name"
            placeholderTextColor={complementaryColors.placeholder}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
            autoCapitalize="words"
          />

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

          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: isConfirmFocused
                    ? colors.tint
                    : complementaryColors.inputBorder,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Confirm Password"
              placeholderTextColor={complementaryColors.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setIsConfirmFocused(true)}
              onBlur={() => setIsConfirmFocused(false)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialCommunityIcons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={complementaryColors.placeholder}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, { backgroundColor: colors.tint }]}
            onPress={handleSignUp}
          >
            <Text style={[styles.signupButtonText, { color: colors.background }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text style={[styles.termsText, { color: complementaryColors.placeholder }]}>
          By signing up, you agree to our 
          <Text style={{ color: colors.tint }}> Terms of Service</Text> and 
          <Text style={{ color: colors.tint }}> Privacy Policy</Text>
        </Text>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={{ color: complementaryColors.placeholder }}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/Auth/login")}>
            <Text style={{ color: colors.tint, fontWeight: "600" }}>Log in</Text>
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
    gap: 16,
    marginBottom: 16,
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
  signupButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
});