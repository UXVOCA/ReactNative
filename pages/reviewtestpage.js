import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";

const ReviewTestPage = () => {
  const navigation = useNavigation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [viewWords, setViewWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [optionsMap, setOptionsMap] = useState({});
  const [options, setOptions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const handleAnswer = (selectedOption) => {
    const updatedUserAnswers = {
      ...userAnswers,
      [currentWord.word]: selectedOption,
    };

    // 콘솔 로그를 통해 데이터 확인
    console.log("Updated User Answers:", updatedUserAnswers);
    console.log("View Words with Options:", viewWords);

    if (currentWordIndex < viewWords.length - 1) {
      setUserAnswers(updatedUserAnswers);
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // ReviewTestAnswerPage로 이동하기 전에 데이터 확인
      console.log("Final User Answers:", updatedUserAnswers);
      console.log("Final View Words with Options:", viewWords);
      navigation.navigate("ReviewTestAnswerPage", {
        userAnswers,
        viewWords,
      });
    }
  };

  useEffect(() => {
    if (currentWordIndex < viewWords.length) {
      setCurrentWord(viewWords[currentWordIndex]);
      setOptions(viewWords[currentWordIndex].options || []);
    } else {
      setCurrentWord({});
    }
  }, [currentWordIndex, viewWords]);

  useEffect(() => {
    if (currentWord && currentWord.answer) {
      if (!optionsMap[currentWord.word]) {
        const correctAnswer = currentWord.answer[0];
        const wrongOptions = _.sampleSize(
          viewWords
            .filter((w) => w.word !== currentWord.word)
            .map((w) => w.answer[0]),
          2
        );
        const newOptions = _.shuffle([correctAnswer, ...wrongOptions]);

        setOptionsMap((prevOptionsMap) => ({
          ...prevOptionsMap,
          [currentWord.word]: newOptions,
        }));
      }

      setOptions(optionsMap[currentWord.word] || []);
    }
  }, [currentWord, viewWords, optionsMap]);

  useEffect(() => {
    const fetchWordList = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("selectedWords");
        let storedWordList = jsonValue ? JSON.parse(jsonValue) : [];
        const today = new Date().toISOString().split("T")[0];

        const filteredWords = storedWordList.filter((word) => {
          if (!word.learneddate) return false;
          const learnDateOnly = word.learneddate.split("T")[0];
          const differenceInDays = Math.ceil(
            (new Date(today) - new Date(learnDateOnly)) / (1000 * 3600 * 24)
          );
          return [1, 5, 7, 15].includes(differenceInDays);
        });

        // 올바른 답과 잘못된 보기를 혼합하여 options 배열 생성
        const updatedViewWords = filteredWords.map((word) => {
          const correctAnswer = word.answer[0];
          const wrongOptions = _.sampleSize(
            filteredWords
              .filter((w) => w.word !== word.word)
              .map((w) => w.answer[0]),
            2
          );
          const options = _.shuffle([correctAnswer, ...wrongOptions]);
          return { ...word, options };
        });

        setViewWords(updatedViewWords);
      } catch (e) {
        console.error("Failed to fetch wordList:", e);
      }
    };

    fetchWordList();
  }, []);

  const handleNextWord = () => {
    if (currentWordIndex < viewWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.wordText}>{currentWord.word || ""}</Text>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrevWord}>
          <Text style={styles.navButtonText}> {"<"} </Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          {currentWordIndex + 1}/{viewWords.length}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={handleNextWord}>
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => handleAnswer(option)}
        >
          <Text style={styles.buttonText}>{option}</Text>
          {userAnswers[currentWord.word] === option && (
            <FontAwesome
              name="check-circle"
              size={40}
              color="white"
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navButtonText: {
    fontSize: 30,
    color: "black",
  },
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
    marginTop: 30,
    marginBottom: 5, // 버튼 사이의 간격
    backgroundColor: "#AABCFD", // 버튼의 배경색
    borderRadius: 20, // 버튼의 모서리 둥글기
    justifyContent: "center",
    width: "75%", // 버튼의 너비
    height: "15%",
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
    paddingTop: 30,
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

export default ReviewTestPage;
