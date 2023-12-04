import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
} from "react-native";
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
  const navigation = useNavigation(); //todayteestanswerpage로 넘어가려고 선언한거
  const [currentDate, setCurrentDate] = useState(new Date()); //다음날 됐을때를 위한 선언
  const [currentNumber, setCurrentNumber] = useState(0); //단어 번호
  const [userAnswers, setUserAnswers] = useState([]); //사용자 입력 버튼 (각 문제에 대한 정답)
  const [selectedWords, setSelectedWords] = useState([]); //todaytested 상태 때문에 선언
  const [wrongVocab, setWrongVocab] = useState([]); //틀린 단어

  const resetTodayTested = async () => {
    // todaytested 값을 false로 설정하는 로직
    const updatedWords = selectedWords.map((word) => ({
      ...word,
      todaytested: false,
    }));
    setSelectedWords(updatedWords);
    try {
      await AsyncStorage.setItem("selectedWords", JSON.stringify(updatedWords));
      console.log("모든 todaytested 값이 초기화되었습니다.");
    } catch (error) {
      console.error(
        "todaytested 값을 초기화하는 중 오류가 발생했습니다.",
        error
      );
    }
  };


  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      const now = new Date();
      if (
        now.getDate() !== currentDate.getDate() ||
        now.getMonth() !== currentDate.getMonth() ||
        now.getFullYear() !== currentDate.getFullYear()
      ) {
        setCurrentDate(now);
        resetTodayTested();
      }
    }
  };
  useEffect(() => {
    // AppState 이벤트 리스너 추가
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      subscription.remove();
    };
  }, [currentDate, selectedWords]);
  useEffect(() => {
    // 오답 목록을 불러오는 함수
    const loadWrongVocab = async () => {
      try {
        const storedWrongVocab = await AsyncStorage.getItem("wrongVocab"); //asyncstorage에 저장된 wrongVocab들을 불러오는거임
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
  const printWordListData = async () => {
    try {
      const wordListData = await AsyncStorage.getItem("wordList");
      if (wordListData !== null) {
        const parsedData = JSON.parse(wordListData);
        console.log("wordList 데이터:", parsedData);
      } else {
        console.log("wordList 데이터가 존재하지 않습니다.");
      }
    } catch (error) {
      console.error("wordList 데이터를 불러오는 데 실패했습니다:", error);
    }
  };

  // 함수 호출

  const loadAndUpdateAllVocabData = async () => {
    try {
      // AsyncStorage에서 wordList, learncountData, selectedWords, wrongVocab 불러오기
      const [
        storedWordList,
        storedLearncountData,
        storedSelectedWords,
        storedWrongVocab,
      ] = await Promise.all([
        AsyncStorage.getItem("wordList"),
        AsyncStorage.getItem("learncountData"),
        AsyncStorage.getItem("selectedWords"),
        AsyncStorage.getItem("wrongVocab"),
      ]);

      // wordList 파싱 (AsyncStorage에 있는 경우만 업데이트)
      let allWordsData = storedWordList ? JSON.parse(storedWordList) : wordList;

      // learncountData, selectedWordsData, wrongVocabData 파싱
      let learncountData = storedLearncountData
        ? JSON.parse(storedLearncountData)
        : {};
      let selectedWordsData = storedSelectedWords
        ? JSON.parse(storedSelectedWords)
        : [];
      let wrongVocabData = storedWrongVocab ? JSON.parse(storedWrongVocab) : [];

      // allWordsData 업데이트
      allWordsData = allWordsData.map((word) => {
        const selectedWordData = selectedWordsData.find(
          (sw) => sw.word === word.word
        );
        return {
          ...word,
          todaytested: selectedWordData?.todaytested || false,
          wrongcount:
            wrongVocabData.find((wv) => wv.word === word.word)?.wrongcount || 0,
          learncount: learncountData[word.word] || 0,
          learneddate: selectedWordData?.learneddate || null,
          wrongwordcount: wrongVocabData?.wrongwordcount || 0,
        };
      });

      // 업데이트된 allWordsData를 다시 AsyncStorage에 저장
      await AsyncStorage.setItem("wordList", JSON.stringify(allWordsData));
    } catch (error) {
      console.error("데이터를 불러오는 데 실패했습니다.", error);
    }
  };

  const updateLearnCountForSelectedWords = async (words) => {
    const storedLearncountData = await AsyncStorage.getItem("learncountData");
    let learncountData = storedLearncountData
      ? JSON.parse(storedLearncountData)
      : {};

    await AsyncStorage.setItem(
      "learncountData",
      JSON.stringify(learncountData)
    );
    console.log("learncount가 업데이트되었습니다.");
  };
  const updateTodayTested = async () => {
    // 모든 selected 단어의 todaytested 값을 true로 설정하고 저장
    const updatedWords = selectedWords.map((word) => ({
      ...word,
      todaytested: true,
    }));
    setSelectedWords(updatedWords);
    await updateLearnCountForSelectedWords(selectedWords);
    try {
      await AsyncStorage.setItem("selectedWords", JSON.stringify(updatedWords));
      console.log("todaytested 값이 업데이트되었습니다.");
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

        // 단어 데이터 가져오기
        let allWordsData = [...wordList];

        // 오늘 테스트된 단어들을 선택
        const todayTestedWords = allWordsData.filter(
          (word) => word.todaytested
        );

        let selectedWords = [];

        if (todayTestedWords.length > 0) {
          // todaytested가 true인 단어들을 모두 선택
          selectedWords = todayTestedWords;
        } else {
          // 모든 todaytested 값이 false인 경우
          // learncount 기준으로 단어들 정렬 후 상위 30개 선택
          let sortedWords = allWordsData.sort((a, b) => {
            const learncountA = learncountData[a.word] || 0;
            const learncountB = learncountData[b.word] || 0;
            return learncountA - learncountB;
          });
          selectedWords = sortedWords.slice(0, 10);
        }

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

  const handleAnswer = async (option) => {
    const selectedWord = selectedWords[currentNumber];

    const correctAnswer = selectedWord.answer[0];
    const todayDate = new Date().toISOString().split("T")[0]; // 현재 날짜를 YYYY-MM-DD 형식으로 가져옵니다.

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
      selectedWords[currentNumber].learneddate = todayDate;
      const wrongWordIndex = wrongVocab.findIndex(
        (word) => word.word === selectedWord.word
      );
      if (wrongWordIndex >= 0) {
        wrongVocab[wrongWordIndex].wrongcount = Math.max(
          wrongVocab[wrongWordIndex].wrongcount - 1,
          0
        );
        if (wrongVocab[wrongWordIndex].wrongcount === 0) {
          wrongVocab.splice(wrongWordIndex, 1); // wrongcount가 0이면 배열에서 제거
        }
      }
    } else {
      selectedWords[currentNumber].learneddate = null;
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
    setSelectedWords([...selectedWords]);
    try {
      await AsyncStorage.setItem(
        "selectedWords",
        JSON.stringify(selectedWords)
      );
      console.log("selectedWords가 AsyncStorage에 업데이트 되었습니다.");
    } catch (error) {
      console.error("selectedWords를 저장하는 중 오류가 발생했습니다.", error);
    }
    // 테스트의 다음 문제로 이동
    if (currentNumber === selectedWords.length - 1) {
      await updateTodayTested(newUserAnswers);
      await loadAndUpdateAllVocabData();

      navigation.navigate("TodayTestAnswer", {
        userAnswers: newUserAnswers,
        selectedWords: selectedWords,
      });
      printWordListData();
    } else {
      setCurrentNumber(currentNumber + 1);
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
