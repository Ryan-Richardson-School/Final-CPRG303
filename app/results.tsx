import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, SHADOW, SIZES } from "../constants/theme";

export default function Results() {
  const router = useRouter();
  const { category, score, answered } = useLocalSearchParams();

  const categoryName =
    typeof category === "string" ? category : "Unknown Category";

  const scoreValue =
    typeof score === "string" ? Number(score) : 0;

  const answeredValue =
    typeof answered === "string" ? Number(answered) : 0;

  const percentage =
    answeredValue > 0
      ? Math.round((scoreValue / answeredValue) * 100)
      : 0;

  const getMessage = () => {
    if (percentage >= 90) return "You’re cracked 🧠🔥";
    if (percentage >= 75) return "Elite performance 💪";
    if (percentage >= 60) return "Solid work 👍";
    if (percentage >= 40) return "Getting there 👀";
    return "Keep grinding 🧩";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quiz Results</Text>

      <View style={styles.card}>
        <Text style={styles.categoryText}>{categoryName}</Text>

        <Text style={styles.scoreText}>
          Score: {scoreValue} / {answeredValue}
        </Text>

        <Text style={styles.percentText}>{percentage}%</Text>

        <Text style={styles.messageText}>{getMessage()}</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.replace({
              pathname: "/quiz",
              params: { category: categoryName },
            })
          }
        >
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primaryDark,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    ...SHADOW,
  },
  categoryText: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primaryDark,
    textAlign: "center",
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  percentText: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.accent,
    textAlign: "center",
    marginBottom: 16,
  },
  messageText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: COLORS.primaryDark,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  secondaryButton: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
});