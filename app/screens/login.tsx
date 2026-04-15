import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "../../constants/theme";

export default function Login() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Brain Fuel</Text>
        <Text style={styles.subtitle}>Login</Text>

        <View style={styles.form}>
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

          <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/home")}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </Pressable>

          <Pressable style={styles.buttonA} onPress={() => router.push("/screens/signup")}>
            <Text style={styles.buttonText}>Don’t have an account?</Text>
          </Pressable>

          {/* <Text style={styles.buttonA}>
          Don’t have an account?{" "}
          <Text style={styles.link} onPress={() => router.push("/screens/signup")}>
            Sign up
          </Text> */}

        </View>
      
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 130,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
  },

   buttonA: {
    backgroundColor: COLORS.category2,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  signup: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: COLORS.accent,
    fontWeight: "bold",
  },
});