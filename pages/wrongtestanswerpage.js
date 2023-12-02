import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const WrongTestAnswerPage = ({ route }) => {
  const { userAnswers, selectedWords } = route.params;
  const [currentNumber, setCurrentNumber] = useState(0);

  const currentWordData = selectedWords[currentNumber];
  const currentAnswerData = userAnswers[currentNumber];

  const correctAnswer = currentWordData.answer[0];
  const isCorrect = currentAnswerData.selected === correctAnswer;

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
        style={[styles.card, { backgroundColor: isCorrect ? "green" : "red" }]}
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
        {currentWordData.options.map((option, idx) => {
          const isSelected = currentAnswerData.selected === option;
          const isCorrectOption = option === correctAnswer;
          const isCorrectSelected = isSelected && isCorrect;

          let borderColor = "#A4A4A4"; // 기본 테두리 색상
          let borderWidth = 1; // 기본 테두리 두께
          let textColor = "black"; // 기본 텍스트 색상
          let iconName = isSelected
            ? isCorrect
              ? "check-circle"
              : "times-circle"
            : null;
          let iconColor = isCorrectSelected ? "green" : "red";

          if (isCorrectSelected) {
            borderColor = "green";
            borderWidth = 3;
            textColor = "green";
          } else if (isSelected && !isCorrect) {
            borderColor = "red";
            borderWidth = 3;
            textColor = "red";
          } else if (!isSelected && isCorrectOption) {
            borderColor = "green";
            borderWidth = 3;
            textColor = "green";
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.button, { borderColor, borderWidth }]}
              disabled={true} // 옵션을 선택할 수 없도록 비활성화
            >
              <Text style={[styles.buttonText, { color: textColor }]}>
                {option}
              </Text>
              {iconName && (
                <Icon
                  name={iconName}
                  size={40}
                  color={iconColor}
                  style={styles.checkIcon}
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
  checkIcon: {
    position: "absolute",
    right: 15,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
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
    marginBottom: 40, // 버튼 사이의 간격
    backgroundColor: "#AABCFD", // 버튼의 배경색
    borderRadius: 20, // 버튼의 모서리 둥글기
    justifyContent: "center",
    width: "75%", // 버튼의 너비
    height: "20%",
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

export default WrongTestAnswerPage;
