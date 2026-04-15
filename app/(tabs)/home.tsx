import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import CategoryCard from "../../components/CategoryCard";
import StatCard from "../../components/StatCard";
import { COLORS, SHADOW, SIZES } from "../../constants/theme";
import * as storage from "../../utils/storage"
import { getQuizStats, QuizStats, resetQuizStats } from "../../utils/storage";


//default 
const categories = [
  { title: "Canada", color: COLORS.category1, icon: "🍁" },
  { title: "Geography", color: COLORS.category2, icon: "🌍" },
  { title: "General Knowledge", color: COLORS.category3, icon: "🧠" },
  { title: "Dinosaurs", color: COLORS.category4, icon: "🦖" },
  { title: "Sharks", color: COLORS.category5, icon: "🦈" },
  { title: "Japan", color: COLORS.category6, icon: "🗾" },
];

const defaultStats: QuizStats = {
  totalCompleted: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  bestScores: {},
  streak: 0,
  lastPlayedDate: null,
};

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<QuizStats>(defaultStats);

  const [userName, setUserName] = useState("User"); 
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  //reload
  const loadStats = useCallback(async () => {
    const savedStats = await getQuizStats();
    setStats(savedStats);

    const profile = await storage.get<any>(storage.STORAGE_KEY.PROFILE);
    if (profile?.firstName) {
      setUserName(profile.firstName);
    }
  }, []);



  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  // nav to category
  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/screens/quiz",
      params: { category },
    });
  };

  //the actual reset function
  const handleResetStats = () => {
    Alert.alert(
      "Reset Stats",
      "Are you sure you want to clear all quiz stats?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetQuizStats();
            setStats(defaultStats);
          },
        },
      ]
    );
  };

  //math for accuracy
  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🧠</Text>
        </View>

        <View style={styles.welcomeTextWrap}>
          <Text style={styles.smallText}>Welcome back to Brain Fuel</Text>
          <Text style={styles.nameText}>{userName}!</Text>
          <Text style={styles.smallText}>Let&apos;s test your knowledge</Text>
        </View>
      </View>
    
    {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsHeaderRow}>
          <Text style={styles.sectionTitle}>Your Stats</Text>

          <Pressable style={styles.resetButton} onPress={handleResetStats}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="Completed"
            value={String(stats.totalCompleted)}
            icon="✅"
          />
          <StatCard label="Accuracy" value={`${accuracy}%`} icon="🎯" />
          <StatCard label="Streak" value={`${stats.streak}🔥`} icon="🔥" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Choose a Category</Text>

      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            color={category.color}
            icon={category.icon}
            onPress={() => handleCategoryPress(category.title)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    minHeight: "100%",
  },
  welcomeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 12,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOW,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
  },
  welcomeTextWrap: {
    flex: 1,
  },
  smallText: {
    fontSize: 14,
    color: COLORS.primaryDark,
  },
  nameText: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginVertical: 2,
  },
  statsSection: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    ...SHADOW,
  },
  statsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginBottom: 14,
  },
  resetButton: {
    backgroundColor: "#FFD6D6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#A61B1B",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 24,
  },
});