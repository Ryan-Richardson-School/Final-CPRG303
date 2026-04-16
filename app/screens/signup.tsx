

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { COLORS, SIZES } from "../../constants/theme";

// ─────────────────────────────────────────────
// Validation Schema 
// ─────────────────────────────────────────────

const signUpSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function Signup() {
  const { signUp } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);

      await signUp(data.email, data.password);

      Alert.alert("Account Created", "You can now log in.");
router.replace("/screens/login");

    } catch (e) {
      setAuthError(
        e instanceof Error ? e.message : "Sign up failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // Success Screen 
  // ─────────────────────────────────────────────

  if (emailSent) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="mail-outline" size={56} color={COLORS.primary} />
        </View>

        <Text style={styles.successTitle}>Check your inbox</Text>

        <Text style={styles.successMessage}>
          We sent a confirmation link to your email. Tap the link to activate
          your account, then return and sign in.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/screens/login")}
        >
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </Pressable>
      </View>
    );
  }

  // ─────────────────────────────────────────────
  // Signup Form
  // ─────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={styles.title}>Brain Fuel</Text>
          <Text style={styles.subtitle}>Sign Up</Text>
        </View>

        {/* Error Banner */}
        {authError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color="#b91c1c" />
            <Text style={styles.errorBannerText}>{authError}</Text>
          </View>
        )}

        {/* Form Box */}
        <View style={styles.formBox}>
          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter email"
                placeholderTextColor="#999"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.fieldError}>{errors.email.message}</Text>
          )}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Min 8 chars, upper, lower, number, symbol"
                placeholderTextColor="#999"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.fieldError}>{errors.password.message}</Text>
          )}

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Re-enter password"
                placeholderTextColor="#999"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.fieldError}>
              {errors.confirmPassword.message}
            </Text>
          )}

          {/* Create Account Button */}
          <Pressable
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            )}
          </Pressable>


          {/* Login Link */}
          <Pressable
            style={styles.buttonA}
            onPress={() => router.push("/screens/login")}
          >
            <Text style={styles.buttonText}>Already have an account?</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─────────────────────────────────────────────
// Styles (Brain Fuel UI)
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
    color: "#292828",
  },
  formBox: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: SIZES.radius,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  fieldError: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonA: {
    backgroundColor: COLORS.category2,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: "#b91c1c",
    fontSize: 14,
    flex: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: COLORS.background,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e8f0fd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
});
