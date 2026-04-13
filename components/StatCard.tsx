// ui for the stats on the homescreen
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SHADOW } from "../constants/theme";

type StatCardProps = {
  label: string;
  value: string;
  icon: string;
};

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "30.5%",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    ...SHADOW,
  },
  icon: {
    fontSize: 18,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: COLORS.primaryDark,
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
});