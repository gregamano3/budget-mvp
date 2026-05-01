/**
 * Sign Up Screen — Create new account.
 */

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { Colors, Typography, Spacing, BorderRadius, Elevation } from "../../constants/theme";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const signup = useAuthStore((s) => s.signup);
  const router = useRouter();

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "transparent", width: 0 };
    if (password.length < 6) return { label: "Weak", color: Colors.error, width: 0.25 };
    if (password.length < 10) return { label: "Fair", color: Colors.tertiary, width: 0.5 };
    if (/[A-Z]/.test(password) && /\d/.test(password))
      return { label: "Strong", color: Colors.secondary, width: 1 };
    return { label: "Good", color: Colors.tertiaryFixedDim, width: 0.75 };
  };

  const strength = getPasswordStrength();

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert("Terms Required", "Please agree to the Terms & Conditions.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await signup(fullName, email, password);
      if (success) {
        router.replace("/(tabs)");
      }
    } catch {
      Alert.alert("Error", "Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (
    icon: string,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    fieldKey: string,
    options?: { secure?: boolean; keyboard?: any }
  ) => (
    <View
      style={[
        styles.inputContainer,
        focusedField === fieldKey && styles.inputContainerFocused,
      ]}
    >
      <MaterialIcons
        name={icon as any}
        size={20}
        color={focusedField === fieldKey ? Colors.primary : Colors.outline}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.outline}
        value={value}
        onChangeText={onChange}
        secureTextEntry={options?.secure && !showPassword}
        keyboardType={options?.keyboard}
        autoCapitalize={options?.keyboard === "email-address" ? "none" : "words"}
        onFocus={() => setFocusedField(fieldKey)}
        onBlur={() => setFocusedField(null)}
      />
      {options?.secure && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={20}
            color={Colors.outline}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="person-add" size={36} color={Colors.onPrimary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join SmartInventory today</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            {renderInput("person", "John Doe", fullName, setFullName, "fullName")}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            {renderInput("email", "you@example.com", email, setEmail, "email", {
              keyboard: "email-address",
            })}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            {renderInput("lock", "Min. 8 characters", password, setPassword, "password", {
              secure: true,
            })}
            {/* Password Strength Bar */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarBg}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${strength.width * 100}%`,
                        backgroundColor: strength.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            {renderInput("lock-outline", "Re-enter password", confirmPassword, setConfirmPassword, "confirm", {
              secure: true,
            })}
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && (
                <MaterialIcons name="check" size={14} color={Colors.onPrimary} />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.termsLink}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            <Text style={styles.signupButtonText}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: { alignItems: "center", marginBottom: 28 },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    ...Elevation.level2,
  },
  title: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: 4 },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "40",
  },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputContainerFocused: {
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, ...Typography.bodyLg, color: Colors.onSurface },
  eyeButton: { padding: Spacing.xs },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  strengthBarBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant + "40",
    overflow: "hidden",
  },
  strengthBarFill: { height: "100%", borderRadius: 2 },
  strengthLabel: { ...Typography.labelSm, width: 45 },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, flex: 1 },
  termsLink: { color: Colors.primary, fontWeight: "600" },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    ...Elevation.level1,
  },
  buttonDisabled: { opacity: 0.7 },
  signupButtonText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: Spacing.lg },
  loginText: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  loginLink: { ...Typography.bodyMd, color: Colors.primary, fontWeight: "700" },
});
