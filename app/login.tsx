//okay I just kinda tired by best to replicate our login from figma feel free to update this as you go

import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "../constants/theme";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brain Fuel</Text>
      <Text style={styles.subtitle}>Login</Text>

      <TextInput
        placeholder="Enter email or username"
        style={styles.input}
      />

      <TextInput
        placeholder="Enter password"
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.row}>
        <Text>Remember me</Text>
        <Text style={styles.link}>Forgot Password?</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </Pressable>

      <Text style={styles.signup}>
        Don’t have an account?{" "}
        <Text style={styles.link}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  signup: {
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: COLORS.accent,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});