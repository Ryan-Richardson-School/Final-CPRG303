import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, SHADOW } from "../constants/theme";
import * as storage from "../utils/storage";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleResetStats = async () => {
    Alert.alert(
      "Reset Quiz Stats",
      "Are you sure you want to reset all quiz progress?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await storage.resetQuizStats();
            Alert.alert("Success", "Your quiz stats have been reset.");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Settings</Text>

      {/* PROFILE SECTION */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={32} color={COLORS.primaryDark} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>Your Profile</Text>
            <Text style={styles.profileSub}>Manage your account settings</Text>
          </View>
        </View>
      </View>

      {/* TOGGLES */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? COLORS.primary : "#ccc"}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? COLORS.primary : "#ccc"}
          />
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.card}>
        <Pressable style={styles.actionRow} onPress={handleResetStats}>
          <Text style={styles.actionText}>Reset Quiz Stats</Text>
          <Ionicons name="refresh-outline" size={20} color={COLORS.primaryDark} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.actionRow}>
          <Text style={styles.actionText}>About BrainFuel</Text>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primaryDark} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.actionRow}>
          <Text style={styles.actionText}>Help & Support</Text>
          <Ionicons name="help-circle-outline" size={20} color={COLORS.primaryDark} />
        </Pressable>
      </View>

      {/* APP INFO */}
      <Text style={styles.version}>BrainFuel v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
  },
  h1: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginBottom: 20,
  },

  // CARD
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    ...SHADOW,
  },

  // PROFILE SECTION
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  profileSub: {
    fontSize: 13,
    color: COLORS.primaryDark + "80",
  },

  // TOGGLES
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.card,
    marginVertical: 12,
  },

  // ACTION ROWS
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },

  version: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    color: COLORS.primaryDark + "80",
  },
});
