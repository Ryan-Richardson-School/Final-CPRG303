// import { useState } from "react";
// import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from "react-native";
// import Checkbox from "expo-checkbox";
// import { useRouter } from "expo-router";
// import { COLORS, SIZES } from "../../constants/theme";
// import { z } from "zod";

// const loginSchema = z.object({
//   email: z.string().trim().email("Please enter a valid email address."),
//   password: z.string().min(8, "Password must be at least 8 characters."),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export default function Login() {
//   const router = useRouter();
//   const [remember, setRemember] = useState(false);

//   return (
//     <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Brain Fuel</Text>
//         <Text style={styles.subtitle}>Login</Text>

//         <View style={styles.form}>
//           <TextInput
//             placeholder="Enter email or username"
//             style={styles.input}
//           />

//           <TextInput
//             placeholder="Enter password"
//             secureTextEntry
//             style={styles.input}
//           />

//           <View style={styles.row}>
//             <View style={styles.checkboxRow}>
//               <Checkbox
//                 value={remember}
//                 onValueChange={setRemember}
//                 color={remember ? COLORS.primary : undefined}
//               />
//               <Text style={styles.rememberText}>Remember me</Text>
//             </View>

//             <Text style={styles.link}>Forgot Password?</Text>
//           </View>

//           <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/home")}>
//             <Text style={styles.buttonText}>LOGIN</Text>
//           </Pressable>

//           <Pressable style={styles.buttonA} onPress={() => router.push("/screens/signup")}>
//             <Text style={styles.buttonText}>Don’t have an account?</Text>
//           </Pressable>

//         </View>

//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 36,
//     textAlign: "center",
//     fontWeight: "bold",
//     marginBottom: 50,
//   },
//   subtitle: {
//     fontSize: 24,
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   form: {
//     backgroundColor: COLORS.white,
//     padding: 20,
//     borderRadius: SIZES.radius,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   input: {
//     backgroundColor: "#F2F2F2",
//     borderRadius: SIZES.radius,
//     padding: 15,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   rememberText: {
//     marginLeft: 8,
//   },
//   button: {
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     borderRadius: SIZES.radius,
//     alignItems: "center",
//     marginTop: 10,
//   },

//    buttonA: {
//     backgroundColor: COLORS.category2,
//     padding: 15,
//     borderRadius: SIZES.radius,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   signup: {
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 16,
//   },
//   link: {
//     color: COLORS.accent,
//     fontWeight: "bold",
//   },
// });

// app/screens/login.tsx
// Brain Fuel — Login Screen (Updated to Week 12 Supabase Auth Format)

import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Checkbox from "expo-checkbox";
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

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginForm = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function Login() {
  const { signIn } = useAuth();
  const [remember, setRemember] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);
      await signIn(data.email, data.password);
      // AuthContext will redirect automatically
    } catch (e) {
      setAuthError(
        e instanceof Error ? e.message : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* ── Header ── */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text style={styles.title}>Brain Fuel</Text>
          <Text style={styles.subtitle}>Login</Text>
        </View>

        {/* ── Auth Error Banner ── */}
        {authError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color="#b91c1c" />
            <Text style={styles.errorBannerText}>{authError}</Text>
          </View>
        )}

        {/* ── Form Container ── */}
        <View style={styles.form}>
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
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
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
                placeholder="Enter password"
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

          {/* Remember + Forgot */}
          <View style={styles.row}>
            <View style={styles.checkboxRow}>
              <Checkbox
                value={remember}
                onValueChange={setRemember}
                color={remember ? COLORS.primary : undefined}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>

            <Text style={styles.link}>Forgot Password?</Text>
          </View>

          {/* Login Button */}
          <Pressable
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={() => router.push("/(tabs)/home")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>LOGIN</Text>
            )}
          </Pressable>

          {/* Signup Link */}
          <Pressable
            style={styles.buttonA}
            onPress={() => router.push("/screens/signup")}
          >
            <Text style={styles.buttonText}>Don’t have an account?</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 6,
    color: COLORS.accent,
  },
  form: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    elevation: 3,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 8,
  },
  link: {
    color: COLORS.accent,
    fontWeight: "bold",
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
});
