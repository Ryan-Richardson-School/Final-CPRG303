import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

// information storage so you can keep track of your progress
export type QuizStats = {
  totalCompleted: number;
  totalCorrect: number;
  totalAnswered: number;
  bestScores: Record<string, number>;
  streak: number;
  lastPlayedDate: string | null;
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

async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

function getUserScopedKey(baseKey: string, userId: string): string {
  return `${baseKey}:${userId}`;
}

export const STORAGE_KEY = {
  PROFILE: "brainFuelProfile",
  PROFILE_PHOTO: "brainFuelProfilePhoto",
  QUIZ_STATS: "brainFuelQuizStats",
};

export async function getQuizStats(): Promise<QuizStats> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return defaultStats;
    }

    const savedStats = await AsyncStorage.getItem(
      getUserScopedKey(STORAGE_KEY.QUIZ_STATS, userId)
    );

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
    const userId = await getCurrentUserId();

    if (!userId) {
      console.error("No logged in user found. Stats were not saved.");
      return;
    }

    const currentStats = await getQuizStats();
    const currentBest = currentStats.bestScores[category] ?? 0;

    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    let newStreak = currentStats.streak;

    if (currentStats.lastPlayedDate === today) {
      // same day, streak stays the same
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

    await AsyncStorage.setItem(
      getUserScopedKey(STORAGE_KEY.QUIZ_STATS, userId),
      JSON.stringify(updatedStats)
    );
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
}

export async function resetQuizStats(): Promise<void> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return;
    }

    await AsyncStorage.removeItem(
      getUserScopedKey(STORAGE_KEY.QUIZ_STATS, userId)
    );
  } catch (error) {
    console.error("Error resetting quiz stats:", error);
  }
}

export async function get<T>(key: string): Promise<T | null> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return null;
    }

    const value = await AsyncStorage.getItem(getUserScopedKey(key, userId));
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error("Storage GET error:", error);
    return null;
  }
}

export async function set(key: string, value: any): Promise<void> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return;
    }

    await AsyncStorage.setItem(
      getUserScopedKey(key, userId),
      JSON.stringify(value)
    );
  } catch (error) {
    console.error("Storage SET error:", error);
  }
}