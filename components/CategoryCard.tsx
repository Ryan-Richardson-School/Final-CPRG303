// quiz selector buttons
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, SHADOW, SIZES } from "../constants/theme";

type CategoryCardProps = {
  title: string;
  color: string;
  icon: string;
  onPress: () => void;
};

export default function CategoryCard({
  title,
  color,
  icon,
  onPress,
}: CategoryCardProps) {
  return (
    <Pressable
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    minHeight: 130,
    borderRadius: SIZES.cardRadius,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    ...SHADOW,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
    textAlign: "center",
  },
});