import * as Haptics from "expo-haptics";
// we listed a vibration function on click so here it is
export async function playCorrectFeedback(): Promise<void> {
  try {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  } catch (error) {
    console.error("Error playing correct feedback:", error);
  }
}

export async function playIncorrectFeedback(): Promise<void> {
  try {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    );
  } catch (error) {
    console.error("Error playing incorrect feedback:", error);
  }
}