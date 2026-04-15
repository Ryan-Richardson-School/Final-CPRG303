import AsyncStorage from "@react-native-async-storage/async-storage";

const QUIZ_STATS_KEY = "brainFuelQuizStats";

// information storage so you can keep track of your progress
export type QuizStats = {
  totalCompleted: number;
  totalCorrect: number;
  totalAnswered: number;
  bestScores: Record<string, number>;
  streak: number;
  lastPlayedDate: string | null;
};

export const STORAGE_KEY = {
  PROFILE: "brainFuelProfile",
  PROFILE_PHOTO: "brainFuelProfilePhoto",
};


const defaultStats: QuizStats = {
  totalCompleted: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  bestScores: {},
  streak: 0,
  lastPlayedDate: null,
};

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}

export async function getQuizStats(): Promise<QuizStats> {
  try {
    const savedStats = await AsyncStorage.getItem(QUIZ_STATS_KEY);

    if (!savedStats) {
      return defaultStats;
    }

    const parsedStats = JSON.parse(savedStats) as QuizStats;

    return {
      totalCompleted: parsedStats.totalCompleted ?? 0,
      totalCorrect: parsedStats.totalCorrect ?? 0,
      totalAnswered: parsedStats.totalAnswered ?? 0,
      bestScores: parsedStats.bestScores ?? {},
      streak: parsedStats.streak ?? 0,
      lastPlayedDate: parsedStats.lastPlayedDate ?? null,
    };
  } catch (error) {
    console.error("Error reading quiz stats:", error);
    return defaultStats;
  }
}

export async function saveQuizResult(
  category: string,
  correctAnswers: number,
  answeredQuestions: number
): Promise<void> {
  try {
    const currentStats = await getQuizStats();
    const currentBest = currentStats.bestScores[category] ?? 0;

    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    let newStreak = currentStats.streak;

    if (currentStats.lastPlayedDate === today) {
      // same day → no change
    } else if (currentStats.lastPlayedDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    const updatedStats: QuizStats = {
      totalCompleted: currentStats.totalCompleted + 1,
      totalCorrect: currentStats.totalCorrect + correctAnswers,
      totalAnswered: currentStats.totalAnswered + answeredQuestions,
      bestScores: {
        ...currentStats.bestScores,
        [category]:
          correctAnswers > currentBest ? correctAnswers : currentBest,
      },
      streak: newStreak,
      lastPlayedDate: today,
    };

    await AsyncStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(updatedStats));
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
}

export async function resetQuizStats(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUIZ_STATS_KEY);
  } catch (error) {
    console.error("Error resetting quiz stats:", error);
  }
}

export async function get<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error("Storage GET error:", error);
    return null;
  }
}

export async function set(key: string, value: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Storage SET error:", error);
  }
}
