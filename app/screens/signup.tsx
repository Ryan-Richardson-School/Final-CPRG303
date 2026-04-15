import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable,ScrollView, KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "../../constants/theme";

export default function Signup() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);

  return (
    <ScrollView>

      <View style={styles.container}>
        <Text style={styles.title}>Brain Fuel</Text>
        <Text style={styles.subtitle}>Sign Up</Text>

        {/* White box container */}
        <View style={styles.formBox}>
          <TextInput
            placeholder="Username"
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            style={styles.button}
            onPress={() => router.push("/home")}
          >
            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          </Pressable>

          <Pressable
            style={styles.buttonA}
            onPress={() => router.push("/screens/login")}
          >
            <Text style={styles.buttonText}>Already have an account?</Text>
          </Pressable>



        </View>
    

       {/* <Text style={styles.login}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/screens/login")}>
          Login
        </Text>
      </Text>  */}
    </View>
</ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "flex-start",
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
    color:"#292828",
  },

  formBox: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  input: {
    backgroundColor:"#F2F2F2",
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
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

  login: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: COLORS.accent,
    fontWeight: "bold",
  },
});