import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import words from "../vocab/todayvocab";

const TodayTestAnswerPage = ({ route }) => {
  const { userAnswers } = route.params;
  const [currentNumber, setCurrentNumber] = useState(0);

  const correctAnswer = words.find(
    (w) => w.word === userAnswers[currentNumber].word
  ).answer;
  const isCorrect = userAnswers[currentNumber].selected === correctAnswer;

  const goToPrevious = () => {
    if (currentNumber > 0) {
      setCurrentNumber(currentNumber - 1);
    }
  };

  const goToNext = () => {
    if (currentNumber < userAnswers.length - 1) {
      setCurrentNumber(currentNumber + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.card, { backgroundColor: isCorrect ? "blue" : "red" }]}
      >
        <Text style={styles.wordText}>{userAnswers[currentNumber].word}</Text>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={goToPrevious}>
          <Text style={styles.navButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          {currentNumber + 1}/{userAnswers.length}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={goToNext}>
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionsContainer}>
        {words
          .find((w) => w.word === userAnswers[currentNumber].word)
          .options.map((option, idx) => (
            <View
              key={idx}
              style={[
                styles.button,
                {
                  backgroundColor:
                    userAnswers[currentNumber].selected === option
                      ? isCorrect
                        ? "blue"
                        : "red"
                      : "#AABCFD",
                },
              ]}
            >
              <Text style={styles.buttonText}>{option}</Text>
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },
  card: {
    width: "75%",
    height: "20%",
    marginVertical: 2,
    padding: 20,
    marginTop: 150,
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
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  button: {
    marginBottom: 40, // 버튼 사이의 간격
    backgroundColor: "#AABCFD", // 버튼의 배경색
    borderRadius: 20, // 버튼의 모서리 둥글기
    paddingVertical: 30, // 상하 패딩
    width: "75%", // 버튼의 너비
    elevation: 3, // 안드로이드에서 그림자 효과
    shadowOpacity: 0.3, // iOS에서 그림자 효과
    shadowRadius: 4, // iOS에서 그림자 둥근 효과
    shadowColor: "#000", // iOS에서 그림자 색상
    shadowOffset: { height: 2, width: 0 }, // iOS에서 그림자 방향
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
    justifyContent: "center",
    width: "30%",
  },
  navButton: {
    padding: 20,
  },
  navText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  navButtonText: {
    fontSize: 30,
    color: "black",
  },
});

export default TodayTestAnswerPage;