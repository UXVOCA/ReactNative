import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Button,
  StyleSheet,
} from "react-native";
import wordList from "../vocab/vocab";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodayNewListPage = () => {
  const [selectedWords, setSelectedWords] = useState([]); //단어빨간색 처리하는
  const [viewWords, setViewWords] = useState([]); //무슨단어보여줄지

  //vocab.js를 storage에 저장하는 함수
  // const storeWordList = async (wordList) => {
  //     try {
  //       const jsonValue = JSON.stringify(wordList);
  //       await AsyncStorage.setItem('wordList', jsonValue);
  //     } catch (e) {
  //       // 저장 중 에러 처리
  //     }
  //   };

  //   // wordList 저장
  // storeWordList(wordList);

  // const logWordList = async () => {
  //     try {
  //       const storedWordList = await AsyncStorage.getItem('wordList');
  //       if (storedWordList !== null) {
  //         // 값이 존재하면 로그로 출력
  //         console.log('wordList:', JSON.parse(storedWordList));
  //       } else {
  //         console.log('wordList not found');
  //       }
  //     } catch (e) {
  //       // 에러 처리
  //       console.error('Failed to fetch wordList:', e);
  //     }
  //   };

  //   // 함수 호출
  //   logWordList();

  // const getSortedWordList = async () => {
  //     try {
  //       const jsonValue = await AsyncStorage.getItem('wordList');
  //       let wordList = jsonValue != null ? JSON.parse(jsonValue) : [];

  //       // learncount 기준으로 정렬
  //       wordList.sort((a, b) => a.learncount - b.learncount);

  //       // 상위 30개 항목 추출
  //       return wordList.slice(0, 30);
  //     } catch (e) {
  //       // 검색 중 에러 처리
  //       return []; // 에러가 발생한 경우 빈 배열 반환
  //     }
  // };

  // // 사용 예시
  // const top30Words = await getSortedWordList();
  // setSelectedWords(top30Words);

  useEffect(() => {
    const fetchWordList = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("wordList");
        let storedWordList = jsonValue != null ? JSON.parse(jsonValue) : [];
        storedWordList.sort((a, b) => a.learncount - b.learncount);
        setViewWords(storedWordList.slice(0, 30));
      } catch (e) {
        // 에러 처리
      }
    };

    fetchWordList();
  }, []);

  // const updateWordData = async () => {
  //     try {
  //         const jsonValue = await AsyncStorage.getItem('wordList');
  //         let wordList = jsonValue != null ? JSON.parse(jsonValue) : [];

  //         // "demonstrate" 단어 찾아 데이터 업데이트
  //         const updatedWordList = wordList.map(word => {
  //             if (word.word === 'demonstrate') {
  //                 return {
  //                     ...word,
  //                     learncount: word.learncount + 1,
  //                     learneddate: "2023-12-02", // 오늘 날짜로 설정
  //                 };
  //             }
  //             return word;
  //         });

  //         // 수정된 wordList 저장
  //         const updatedJsonValue = JSON.stringify(updatedWordList);
  //         await AsyncStorage.setItem('wordList', updatedJsonValue);
  //     } catch (e) {
  //         // 에러 처리
  //     }
  // };

  // 함수 호출
  // updateWordData();

  // 단어 선택 토글 함수
  const toggleWordSelection = (index) => {
    setSelectedWords((prevState) =>
      prevState.includes(index)
        ? prevState.filter((i) => i !== index)
        : [...prevState, index]
    );
  };

  // 모든 단어 선택 해제
  const resetSelections = () => {
    setSelectedWords([]);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
                <Text style={styles.headerTitle}>오늘의 새로운 단어</Text>
            </View> */}

      {/* 모두 해제 버튼 */}
      <View style={styles.checkResetBtnContainer}>
        <TouchableOpacity
          onPress={resetSelections}
          style={styles.checkResetBtn}
        >
          <Text style={styles.checkResetBtnText}>모두 해제</Text>
        </TouchableOpacity>
      </View>

      {/* 단어 리스트 */}
      {/* <ScrollView style={styles.wordlist}>
                {viewWords.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.wordRow,
                            selectedWords.includes(index) && styles.selectedWord,
                        ]}
                        onPress={() => toggleWordSelection(index)}
                    >
                        <Text style={[
                            styles.wordText,
                            selectedWords.includes(index) && styles.selectedWordText // 선택된 단어의 글씨 색 변경
                        ]}>
                            {item.word}
                        </Text>
                        <Text style={[
                            styles.wordText,
                            selectedWords.includes(index) && styles.selectedWordText // 선택된 단어의 글씨 색 변경
                        ]}>{item.answer.join(", ")}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView> */}
      {/* 단어 리스트 */}
      <ScrollView style={styles.wordlist}>
        {viewWords.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.wordRow,
              selectedWords.includes(index) && styles.selectedWord,
            ]}
            onPress={() => toggleWordSelection(index)}
          >
            <Text
              style={[
                styles.wordText,
                selectedWords.includes(index) && styles.selectedWordText, // 선택된 단어의 글씨 색 변경
              ]}
            >
              {item.word}
            </Text>

            {/* 단어 뜻을 순서대로 */}
            {item.answer.map((meaning, meaningIndex) => (
              <Text
                key={meaningIndex}
                style={[
                  styles.wordText,
                  selectedWords.includes(index) && styles.selectedWordText, // 선택된 단어의 글씨 색 변경
                ]}
              >
                {meaningIndex + 1}. {meaning}
              </Text>
            ))}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 16, // 각 버튼 사이의 간격을 위해 적절한 패딩을 설정합니다.
    backgroundColor: "white", // 배경색을 흰색으로 설정합니다.
  },
  header: {
    marginTop: 20,
    paddingVertical: 20,
    backgroundColor: "white",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 30,
    color: "#7794FF",
    fontWeight: "bold",
  },
  checkResetBtnContainer: {
    flexDirection: "row-reverse",
    width: "80%",
    paddingTop: 0,
    paddingBottom: 10,
  },
  checkResetBtn: {
    color: "black",
  },
  checkResetBtnText: {
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
  },
  wordlist: {
    backgroundColor: "white",
    width: "90%",
  },
  wordRow: {
    marginBottom: 10, // 버튼 사이의 간격
    marginHorizontal: 15,
    backgroundColor: "#AABCFD", // 버튼의 배경색
    borderRadius: 30, // 버튼의 모서리 둥글기
    padding: 20, // 상하 패딩
    width: "90%", // 버튼의 너비
    elevation: 3, // 안드로이드에서 그림자 효과
    shadowOpacity: 0.3, // iOS에서 그림자 효과
    shadowRadius: 4, // iOS에서 그림자 둥근 효과
    shadowColor: "#000", // iOS에서 그림자 색상
    shadowOffset: { height: 2, width: 0 }, // iOS에서 그림자 방향
    borderColor: "#A4A4A4",
    borderWidth: 1,
  },
  selectedWord: {},
  selectedWordText: {
    color: "red",
  },
  wordText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TodayNewListPage;
