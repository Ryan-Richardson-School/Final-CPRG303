import {useRouter} from "expo-router"
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
import { COLORS, SIZES, SHADOW } from "../../constants/theme";
import * as storage from "../../utils/storage";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const handleResetStats = async () => {
    const confirmReset = confirm("Are you sure you want to reset all quiz progress?");
    if (!confirmReset) return;

    await storage.resetQuizStats();
    const check = await storage.getQuizStats();
    console.log("STATS AFTER RESET:", check);

    alert("Your quiz stats have been reset.");

  };
//logout
  const handleLogout = async () => {
    router.replace("/screens/login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Settings</Text>

      {/* PROFILE SECTION */}
      <View style={styles.card}>
        <Pressable
          style={styles.row}
          onPress={() =>
            //alert("Here you can manage your profile, email, and preferences.")
            router.push("/screens/profile")}
            >
            
          <Ionicons name="person-circle-outline" size={32} color={COLORS.primaryDark} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileName}>Your Profile</Text>
            <Text style={styles.profileSub}>Manage your account settings</Text>
          </View>
        </Pressable>
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
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.card}>
        <Pressable style={styles.actionRow} onPress={handleResetStats}>
          <Text style={styles.actionText}>Reset Quiz Stats</Text>
          <Ionicons name="refresh-outline" size={20} color={COLORS.primaryDark} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={styles.actionRow}
          onPress={() =>
            alert("BrainFuel is a quiz app designed to help you learn.")
          }
        >
          <Text style={styles.actionText}>About BrainFuel</Text>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primaryDark} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          style={styles.actionRow}
          onPress={() => Linking.openURL("mailto:support@brainfuel.app")}
        >
          <Text style={styles.actionText}>Help & Support</Text>
          <Ionicons name="help-circle-outline" size={20} color={COLORS.primaryDark} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.actionRow} onPress={handleLogout}>
          <Text style={[styles.actionText, { color: "#FF3B30" }]}>Logout</Text>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
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
