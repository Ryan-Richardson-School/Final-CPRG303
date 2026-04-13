import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getQuestionsByCategory, Question } from "../data/questions";
import { COLORS, SHADOW, SIZES } from "../constants/theme";
import { saveQuizResult } from "../utils/storage";
import {
  playCorrectFeedback,
  playIncorrectFeedback,
} from "../utils/vibration";

const QUIZ_LENGTH = 10;

// a shuffle so you dont always get the same questions
function shuffleArray<T>(arr: T[]) {
  const newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[randomIndex]] = [newArr[randomIndex], newArr[i]];
  }

  return newArr;
}

export default function Quiz() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const categoryName =
    typeof category === "string" ? category : "Unknown Category";

  // gets all the questions for whatever category you choose
  const questions = useMemo(() => {
    return getQuestionsByCategory(categoryName);
  }, [categoryName]);

  const [leftQuestions, setLeftQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [pickedAnswer, setPickedAnswer] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  // refs keep the latest values ready for saving
  const scoreRef = useRef(0);
  const answeredCountRef = useRef(0);

  // prevents dup saves
  const alreadySaved = useRef(false);

  // starts the quiz up when you go to a new cat
  useEffect(() => {
    const randomQuestions = shuffleArray(questions);
    const selectedQuestions = randomQuestions.slice(0, QUIZ_LENGTH);

    if (selectedQuestions.length > 0) {
      setCurrentQuestion(selectedQuestions[0]);
      setOptions(shuffleArray(selectedQuestions[0].options));
      setLeftQuestions(selectedQuestions.slice(1));
    } else {
      setCurrentQuestion(null);
      setOptions([]);
      setLeftQuestions([]);
    }

    setPickedAnswer(null);
    setFeedbackText("");
    setScore(0);
    setAnsweredCount(0);
    scoreRef.current = 0;
    answeredCountRef.current = 0;
    alreadySaved.current = false;
  }, [questions]);

  const totalQuestions = Math.min(QUIZ_LENGTH, questions.length);
  const questionNumber = answeredCount + (pickedAnswer ? 0 : 1);

  // saves progress if you need to stop for whatever reason
  const saveProgress = async () => {
    if (alreadySaved.current || answeredCountRef.current === 0) return;

    await saveQuizResult(
      categoryName,
      scoreRef.current,
      answeredCountRef.current
    );
    alreadySaved.current = true;
  };

  const finishQuiz = async () => {
    if (!alreadySaved.current && answeredCountRef.current > 0) {
      await saveQuizResult(
        categoryName,
        scoreRef.current,
        answeredCountRef.current
      );
      alreadySaved.current = true;
    }

    router.replace({
      pathname: "/results",
      params: {
        category: categoryName,
        score: String(scoreRef.current),
        answered: String(answeredCountRef.current),
      },
    });
  };

  const goNext = async () => {
    if (leftQuestions.length === 0) {
      await finishQuiz();
      return;
    }

    const next = leftQuestions[0];

    setCurrentQuestion(next);
    setOptions(shuffleArray(next.options));
    setLeftQuestions((prev) => prev.slice(1));
    setPickedAnswer(null);
    setFeedbackText("");
  };

  const onBack = async () => {
    await saveProgress();
    router.back();
  };

  const onAnswerPress = async (option: string) => {
    if (!currentQuestion || pickedAnswer) return;

    setPickedAnswer(option);

    const newAnsweredCount = answeredCountRef.current + 1;
    answeredCountRef.current = newAnsweredCount;
    setAnsweredCount(newAnsweredCount);

    if (option === currentQuestion.answer) {
      setFeedbackText("Correct!");

      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);

      await playCorrectFeedback();
    } else {
      setFeedbackText(`Incorrect. Correct answer: ${currentQuestion.answer}`);
      await playIncorrectFeedback();
    }
  };

  const onNextPress = async () => {
    await goNext();
  };

  const onSkipPress = async () => {
    if (pickedAnswer) return;
    await goNext();
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.backHeaderButton} onPress={onBack}>
          <Text style={styles.backHeaderText}>← Back to Categories</Text>
        </Pressable>

        <Text style={styles.header}>{categoryName}</Text>

        <View style={styles.card}>
          <Text style={styles.emptyText}>
            No questions found for this category.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backHeaderButton} onPress={onBack}>
        <Text style={styles.backHeaderText}>← Back to Categories</Text>
      </Pressable>

      <Text style={styles.header}>{categoryName}</Text>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.scoreText}>
          Question {Math.min(questionNumber, totalQuestions)} / {totalQuestions}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${(answeredCount / totalQuestions) * 100}%`,
            },
          ]}
        />
      </View>

      {currentQuestion ? (
        <View style={styles.card}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.optionsContainer}>
            {options.map((option) => {
              const isPicked = pickedAnswer === option;
              const isCorrect = option === currentQuestion.answer;
              const isWrong =
                pickedAnswer === option && option !== currentQuestion.answer;

              return (
                <Pressable
                  key={option}
                  style={[
                    styles.optionButton,
                    isPicked && styles.selectedOption,
                    pickedAnswer && isCorrect && styles.correctOption,
                    isWrong && styles.wrongOption,
                  ]}
                  onPress={() => onAnswerPress(option)}
                  disabled={!!pickedAnswer}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              );
            })}
          </View>

          {feedbackText ? (
            <Text style={styles.feedbackText}>{feedbackText}</Text>
          ) : null}

          {pickedAnswer ? (
            <Pressable style={styles.nextButton} onPress={onNextPress}>
              <Text style={styles.nextButtonText}>
                {leftQuestions.length === 0 ? "Finish Quiz" : "Next Question"}
              </Text>
            </Pressable>
          ) : (
            <Pressable style={styles.skipButton} onPress={onSkipPress}>
              <Text style={styles.skipButtonText}>
                {leftQuestions.length === 0 ? "Finish Quiz" : "Skip Question"}
              </Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  backHeaderButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  backHeaderText: {
    fontWeight: "800",
    color: COLORS.text,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scoreText: {
    fontWeight: "700",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    ...SHADOW,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  correctOption: {
    backgroundColor: "#CFF7D3",
  },
  wrongOption: {
    backgroundColor: "#FFD6D6",
  },
  optionText: {
    textAlign: "center",
    fontWeight: "600",
  },
  feedbackText: {
    marginTop: 15,
    textAlign: "center",
    fontWeight: "700",
  },
  nextButton: {
    marginTop: 15,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    fontWeight: "800",
  },
  skipButton: {
    marginTop: 15,
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  skipButtonText: {
    fontWeight: "800",
  },
  emptyText: {
    textAlign: "center",
  },
});