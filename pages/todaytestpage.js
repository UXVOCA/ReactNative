import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import wordList from "../vocab/vocab"; // vocab.js에서 단어 목록 가져오기
import _ from "lodash";

const TodayTestPage = () => {
  // const clearAsyncStorage = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     console.log("AsyncStorage has been cleared!");
  //   } catch (error) {
  //     console.error("Error clearing AsyncStorage:", error);
  //   }
  // };

  // // // 이 함수를 필요한 곳에서 호출하여 AsyncStorage를 초기화할 수 있습니다.
  // clearAsyncStorage();
  const navigation = useNavigation();
  const [currentNumber, setCurrentNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [wrongVocab, setWrongVocab] = useState([]);
  useEffect(() => {
    // 오답 목록을 불러오는 함수
    const loadWrongVocab = async () => {
      try {
        const storedWrongVocab = await AsyncStorage.getItem("wrongVocab");
        if (storedWrongVocab !== null) {
          const wrongVocab = JSON.parse(storedWrongVocab);
          setWrongVocab(wrongVocab); // 오답 목록 상태 업데이트
          //console.log("이전에 틀린 단어 목록:", wrongVocab);
        }
        const storedSelectedWords = await AsyncStorage.getItem("selectedWords");
        if (storedSelectedWords !== null) {
          const selectedWords = JSON.parse(storedSelectedWords);
          setSelectedWords(selectedWords); // todaytested 상태 업데이트
          //console.log("todaytested 값이 변경된 단어 목록:", selectedWords);
        }
      } catch (error) {
        //console.error("오답 목록을 불러오는 데 실패했습니다.", error);
      }
    };

    loadWrongVocab();
  }, []);

  useEffect(() => {
    const loadAndUpdateAllVocabData = async () => {
      try {
        // learncountData, selectedWordsData, wrongVocabData 불러오기
        const [storedLearncountData, storedSelectedWords, storedWrongVocab] =
          await Promise.all([
            AsyncStorage.getItem("learncountData"),
            AsyncStorage.getItem("selectedWords"),
            AsyncStorage.getItem("wrongVocab"),
          ]);

        let learncountData = storedLearncountData
          ? JSON.parse(storedLearncountData)
          : {};
        let selectedWordsData = storedSelectedWords
          ? JSON.parse(storedSelectedWords)
          : [];
        let wrongVocabData = storedWrongVocab
          ? JSON.parse(storedWrongVocab)
          : [];

        let allWordsData = wordList.map((word) => ({
          ...word,
          todaytested: selectedWordsData.some(
            (sw) => sw.word === word.word && sw.todaytested
          ),
          wrongcount:
            wrongVocabData.find((wv) => wv.word === word.word)?.wrongcount || 0,
          learncount: learncountData[word.word] || 0,
        }));

        console.log(
          "vocab.js의 모든 단어들의 데이터 (업데이트 포함):",
          allWordsData
        );
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    loadAndUpdateAllVocabData();
  }, []);
  const updateLearnCountForSelectedWords = async (words) => {
    const storedLearncountData = await AsyncStorage.getItem("learncountData");
    let learncountData = storedLearncountData
      ? JSON.parse(storedLearncountData)
      : {};

    words.forEach((word) => {
      if (!word.todaytested) {
        if (learncountData[word.word]) {
          learncountData[word.word] += 1;
        } else {
          learncountData[word.word] = 1;
        }
      }
    });

    await AsyncStorage.setItem(
      "learncountData",
      JSON.stringify(learncountData)
    );
    console.log("learncount가 업데이트되었습니다.");
  };
  const updateTodayTested = async () => {
    // 모든 단어의 todaytested 값을 true로 설정하고 저장
    const updatedWords = selectedWords.map((word) => ({
      ...word,
      todaytested: true,
    }));
    setSelectedWords(updatedWords);
    await updateLearnCountForSelectedWords(selectedWords);
    try {
      await AsyncStorage.setItem("selectedWords", JSON.stringify(updatedWords));
      console.log("todaytested 값이 업데이트되었습니다.");
      navigation.navigate("TodayTestAnswer", {
        userAnswers: userAnswers,
        selectedWords: updatedWords, // 최신 상태 반영
      });
    } catch (error) {
      console.error(
        "todaytested 값을 업데이트하는 중 오류가 발생했습니다.",
        error
      );
    }
  };
  useEffect(() => {
    const loadAndSortWords = async () => {
      try {
        // learncount 데이터 불러오기
        const storedLearncountData = await AsyncStorage.getItem(
          "learncountData"
        );
        let learncountData = {};
        if (storedLearncountData !== null) {
          learncountData = JSON.parse(storedLearncountData);
        }

        // 단어 데이터 초기화
        let allWordsData = wordList.map((word) => ({
          ...word,
          todaytested: false,
          //wrongcount: 0, 여기 12/02 7시 2분에 변경함
        }));

        // 오늘 테스트된 단어들을 먼저 선택
        const todayTestedWords = allWordsData.filter(
          (word) => word.todaytested
        );
        let remainingWords = allWordsData.filter((word) => !word.todaytested);

        // learncount 기준으로 나머지 단어들 정렬
        remainingWords.sort((a, b) => {
          const learncountA = learncountData[a.word] || 0;
          const learncountB = learncountData[b.word] || 0;
          return learncountA - learncountB;
        });

        // 오늘 테스트할 단어들을 추가하여 총 30개가 되도록 선택
        const numberOfWordsToSelect = 30 - todayTestedWords.length;
        const selectedWords = [
          ...todayTestedWords,
          ...remainingWords.slice(0, numberOfWordsToSelect),
        ];

        selectedWords.forEach((word) => {
          word.options = _.shuffle([
            word.answer[0],
            ..._.sampleSize(
              _.without(
                wordList.map((w) => w.answer[0]),
                word.answer[0]
              ),
              2
            ),
          ]);
        });

        setSelectedWords(selectedWords);
      } catch (error) {
        console.error("learncount 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    loadAndSortWords();
  }, []);

  const handleAnswer = (option) => {
    const selectedWord = selectedWords[currentNumber];
    const correctAnswer = selectedWord.answer[0];

    // 수정된 부분: 이미 있는 답변을 업데이트
    let newUserAnswers = [...userAnswers];
    const existingAnswerIndex = newUserAnswers.findIndex(
      (answer) => answer.word === selectedWord.word
    );

    if (existingAnswerIndex >= 0) {
      newUserAnswers[existingAnswerIndex].selected = option;
    } else {
      newUserAnswers.push({ word: selectedWord.word, selected: option });
    }

    setUserAnswers(newUserAnswers);
    if (option === correctAnswer) {
      console.log("정답입니다!");
      if (!selectedWord.todaytested) {
        // learncount 업데이트 로직
        updateLearnCount(selectedWord.word);
      }
    } else {
      if (!selectedWord.todaytested) {
        // learncount 업데이트 로직
        updateLearnCount(selectedWord.word);
      } //여기도 12/02 7시 05분에 변경함
      // 틀린 답변을 선택한 경우
      const existingIndex = wrongVocab.findIndex(
        (word) => word.word === selectedWord.word
      );
      let newWrongVocab;

      if (existingIndex >= 0) {
        // 이미 오답 목록에 있는 경우, wrongcount만 업데이트
        newWrongVocab = [...wrongVocab];
        newWrongVocab[existingIndex].wrongcount += 1;
      } else {
        // 새로운 오답인 경우, 목록에 추가
        newWrongVocab = [...wrongVocab, { ...selectedWord, wrongcount: 1 }];
      }

      setWrongVocab(newWrongVocab);

      // AsyncStorage에 오답 목록 저장
      AsyncStorage.setItem("wrongVocab", JSON.stringify(newWrongVocab))
        .then(() => {
          console.log("오답 목록이 AsyncStorage에 업데이트 되었습니다.");
        })
        .catch((error) => {
          console.error("오답 목록을 저장하는 중 오류가 발생했습니다.", error);
        });
    }

    // 테스트의 다음 문제로 이동
    if (currentNumber < selectedWords.length - 1) {
      setCurrentNumber(currentNumber + 1);
    } else {
      updateTodayTested();
    }
  };
  const updateLearnCount = async (word) => {
    try {
      const storedLearncountData = await AsyncStorage.getItem("learncountData");
      let learncountData = storedLearncountData
        ? JSON.parse(storedLearncountData)
        : {};

      if (learncountData[word]) {
        learncountData[word] += 1;
      }

      await AsyncStorage.setItem(
        "learncountData",
        JSON.stringify(learncountData)
      );
      console.log("learncount가 업데이트되었습니다.");
    } catch (error) {
      console.error("learncount를 업데이트하는 중 오류가 발생했습니다.", error);
    }
  };
  const goToPrevious = () => {
    if (currentNumber > 0) {
      setCurrentNumber(currentNumber - 1);
    }
  };

  const goToNext = () => {
    if (currentNumber < selectedWords.length - 1) {
      setCurrentNumber(currentNumber + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* currentNumber가 범위 내에 있는지 확인 */}
        {selectedWords[currentNumber] && (
          <Text style={styles.wordText}>
            {selectedWords[currentNumber].word}
          </Text>
        )}
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity>
          <Text style={styles.navButtonText} onPress={goToPrevious}>
            {"<"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.navText}>
          {currentNumber + 1}/{selectedWords.length}
        </Text>
        <TouchableOpacity>
          <Text style={styles.navButtonText} onPress={goToNext}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* currentNumber가 범위 내에 있는지 확인 */}
      {selectedWords[currentNumber] &&
        selectedWords[currentNumber].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
            {userAnswers.some(
              (answer) =>
                answer.word === selectedWords[currentNumber].word &&
                answer.selected === option
            ) && (
              <FontAwesome
                name="check-circle"
                size={40}
                color="white"
                style={styles.checkIcon}
              /> // 체크 원 아이콘 추가
            )}
          </TouchableOpacity>
        ))}
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
    //justifyContent: "center",
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
    marginBottom: 20,
  },
  wordText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
    marginVertical: 20,
    marginBottom: 40,
  },
  navButton: {
    padding: 20,
  },
  navText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  button: {
    marginBottom: 40, // 버튼 사이의 간격
    backgroundColor: "#AABCFD", // 버튼의 배경색
    borderRadius: 20, // 버튼의 모서리 둥글기
    justifyContent: "center",
    width: "75%", // 버튼의 너비
    height: "14%",
    elevation: 3, // 안드로이드에서 그림자 효과
    shadowOpacity: 0.3, // iOS에서 그림자 효과
    shadowRadius: 4, // iOS에서 그림자 둥근 효과
    shadowColor: "#000", // iOS에서 그림자 색상
    shadowOffset: { height: 2, width: 0 }, // iOS에서 그림자 방향
    borderColor: "#A4A4A4",
    borderWidth: 1,
  },
  buttonText: {
    color: "black", // 텍스트 색상
    textAlign: "center", // 텍스트 정렬
    fontSize: 30, // 텍스트 크기
    fontWeight: "bold", // 텍스트 굵기
  },
  navButtonText: {
    fontSize: 30,
    color: "black",
  },
});

export default TodayTestPage;
