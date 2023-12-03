import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReviewTestAnswerPage = ({ route }) => {
  const { userAnswers, viewWords } = route.params;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentWord = viewWords[currentWordIndex];
  const userAnswer = userAnswers[currentWord.word];
  const isCorrect = userAnswer === currentWord.answer[0];

  const goToPreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const goToNextWord = () => {
    if (currentWordIndex < viewWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };
  useEffect(() => {
    const totalReviewedWordsCount = viewWords.length;
    const correctAnswersCount = viewWords.filter(
      (word) => userAnswers[word.word] === word.answer[0]
    ).length;

    // 계산된 값을 AsyncStorage에 저장
    const saveReviewedWordsData = async () => {
      try {
        await AsyncStorage.setItem(
          "totalReviewedWordsCount",
          JSON.stringify(totalReviewedWordsCount)
        );
        await AsyncStorage.setItem(
          "correctReviewedWordsCount",
          JSON.stringify(correctAnswersCount)
        );
      } catch (error) {
        console.error(
          "AsyncStorage에 복습 단어 데이터 저장 중 오류 발생:",
          error
        );
      }
    };

    saveReviewedWordsData();
  }, [viewWords, userAnswers]);

  return (
    <View style={styles.container}>
      <View
        style={[styles.card, { backgroundColor: isCorrect ? "green" : "red" }]}
      >
        <Text style={styles.wordText}>{currentWord.word}</Text>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={goToPreviousWord}>
          <Text style={styles.navButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          {currentWordIndex + 1}/{viewWords.length}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={goToNextWord}>
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionsContainer}>
        {currentWord.options.map((option, index) => {
          const isSelected = userAnswer === option;
          const isCorrectOption = option === currentWord.answer[0];

          let buttonStyle = styles.button;

          // 올바른 정답에 대해서는 항상 초록색 테두리
          if (isCorrectOption) {
            buttonStyle = {
              ...styles.button,
              borderColor: "green",
              borderWidth: 3,
            };
          }

          // 사용자가 선택한 답변에 대한 처리
          if (isSelected) {
            if (isCorrectOption) {
              // 정답을 선택한 경우: 초록색 테두리와 체크 아이콘
              buttonStyle = {
                ...styles.button,
                borderColor: "green",
                borderWidth: 3,
              };
              // } else {
              //   // 잘못된 답변을 선택한 경우: 빨간색 테두리와 'X' 아이콘
              //   buttonStyle = {
              //     ...styles.button,
              //     borderColor: "red",
              //     borderWidth: 3,
              //   };
            }
          }

          return (
            <TouchableOpacity key={index} style={buttonStyle} disabled={true}>
              <Text style={styles.buttonText}>{option}</Text>
              {isSelected && (
                <FontAwesome
                  name={isCorrectOption ? "check-circle" : "times-circle"}
                  size={40}
                  color={isCorrectOption ? "green" : "red"}
                  style={styles.iconStyle}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    position: "absolute",
    right: 15,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "white",
  },
  card: {
    width: "75%",
    height: "20%",
    marginVertical: 2,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#A4A4A4",
    borderRadius: 30,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  optionsContainer: {
    alignItems: "center",
    width: "100%",
  },
  button: {
    marginBottom: 40,
    backgroundColor: "#AABCFD",
    borderRadius: 20,
    justifyContent: "center",
    width: "75%",
    height: "20%",
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    borderColor: "#A4A4A4",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
    marginVertical: 20,
  },
  navButton: {},
  navText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  navButtonText: {
    fontSize: 30,
    color: "black",
  },
});

export default ReviewTestAnswerPage;
