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

const TodayReviewListPage = () => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [viewWords, setViewWords] = useState([]);

  const logWordList = async () => {
    try {
      const storedWordList = await AsyncStorage.getItem("selectedWords");
      if (storedWordList !== null) {
        // 값이 존재하면 로그로 출력
        console.log("wordList:", JSON.parse(storedWordList));
      } else {
        console.log("wordList not found");
      }
    } catch (e) {
      // 에러 처리
      console.error("Failed to fetch wordList:", e);
    }
  };

  // 함수 호출
  // logWordList();

  useEffect(() => {
    const fetchWordList = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("selectedWords");
        let storedWordList = jsonValue != null ? JSON.parse(jsonValue) : [];
        console.log("storedWordList:", storedWordList);

        const today = new Date();
        // 날짜만을 고려하기 위해, 날짜 문자열을 생성 후 다시 Date 객체로 변환
        const todayDateOnly = new Date();

        const filteredWords = storedWordList.filter((word) => {
          const learnDate = new Date(word.learneddate);
          // learnDate도 마찬가지로 날짜만 고려
          const learnDateOnly = new Date(learnDate.toISOString().split("T")[0]);
          console.log(todayDateOnly);
          console.log(learnDateOnly);
          const differenceInDays = Math.ceil(
            (todayDateOnly - learnDateOnly) / (1000 * 3600 * 24)
          );
          console.log("differenceInDays:", differenceInDays);
          return [1, 5, 7, 15].includes(differenceInDays);
        });

        console.log("filteredWords:", filteredWords);
        setViewWords(filteredWords);
      } catch (e) {
        console.error("Failed to fetch wordList:", e);
      }
    };

    fetchWordList();
  }, []);

  // useEffect(() => {
  //     console.log('viewWords:', viewWords);
  // }, [viewWords]);

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

  //d+ 날짜 계산
  const calculateDateDifference = (learndate) => {
    const today = new Date();
    const learnDate = new Date(learndate);
    const differenceInTime = today.getTime() - learnDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  return (
    <View style={styles.container}>
      {/* 헤더
            <View style={styles.header}>
                <Text style={styles.headerTitle}>오늘의 복습 단어</Text>
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
            <View style={styles.wordheader}>
              <Text
                style={[
                  styles.wordText,
                  selectedWords.includes(index) && styles.selectedWordText, // 선택된 단어의 글씨 색 변경
                ]}
              >
                {item.word}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  selectedWords.includes(index) && styles.selectedWordText, // 선택된 단어의 글씨 색 변경
                ]}
              >
                {" "}
                D+{calculateDateDifference(item.learneddate)}
              </Text>
            </View>

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
  wordheader: {
    flexDirection: "row",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "grey",
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

export default TodayReviewListPage;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Button, StyleSheet } from 'react-native';
// import wordList from "../vocab/vocab";

// const TodayReviewListPage = () => {
//     const [selectedWords, setSelectedWords] = useState([]);
//     const [viewWords, setViewWords] = useState([]);

//     useEffect(() => {
//         const sortedWords = [...wordList].sort((a, b) => a.learncount - b.learncount);
//         setViewWords(sortedWords.slice(0, 5));
//     }, []);

//     // 단어 선택 토글 함수
//     const toggleWordSelection = index => {
//         setSelectedWords(prevState =>
//             prevState.includes(index)
//                 ? prevState.filter(i => i !== index)
//                 : [...prevState, index]
//         );
//     };

//     // 모든 단어 선택 해제
//     const resetSelections = () => {
//         setSelectedWords([]);
//     };

//     return (
//         <View style={styles.container}>

//             {/* 헤더 */}
//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>오늘의 새로운 단어</Text>
//             </View>

//             {/* 모두 해제 버튼 */}
//             <View style={styles.checkResetBtnContainer}>
//                 <TouchableOpacity onPress={resetSelections} style={styles.checkResetBtn}>
//                     <Text style={styles.checkResetBtnText}>모두 해제</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* 단어 리스트 */}
//             {/* <ScrollView style={styles.wordlist}>
//                 {viewWords.map((item, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={[
//                             styles.wordRow,
//                             selectedWords.includes(index) && styles.selectedWord,
//                         ]}
//                         onPress={() => toggleWordSelection(index)}
//                     >
//                         <Text style={[
//                             styles.wordText,
//                             selectedWords.includes(index) && styles.selectedWordText // 선택된 단어의 글씨 색 변경
//                         ]}>
//                             {item.word}
//                         </Text>
//                         <Text style={[
//                             styles.wordText,
//                             selectedWords.includes(index) && styles.selectedWordText // 선택된 단어의 글씨 색 변경
//                         ]}>{item.answer.join(", ")}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView> */}
//             {/* 단어 리스트 */}
//             <ScrollView style={styles.wordlist}>
//                 {viewWords.map((item, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={[
//                             styles.wordRow,
//                             selectedWords.includes(index) && styles.selectedWord,
//                         ]}
//                         onPress={() => toggleWordSelection(index)}
//                     >
//                         <Text style={[
//                             styles.wordText,
//                             selectedWords.includes(index) && styles.selectedWordText // 선택된 단어의 글씨 색 변경
//                         ]}>
//                             {item.word}
//                         </Text>

//                         {/* 단어 뜻을 순서대로 */}
//                         {item.answer.map((meaning, meaningIndex) => (
//                             <Text key={meaningIndex} style={[
//                                 styles.wordText,
//                                 selectedWords.includes(index) && styles.selectedWordText // 선택된 단어의 글씨 색 변경
//                             ]}>
//                                 {meaningIndex + 1}. {meaning}
//                             </Text>
//                         ))}
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // justifyContent: "center",
//         alignItems: "center",
//         padding: 16, // 각 버튼 사이의 간격을 위해 적절한 패딩을 설정합니다.
//         backgroundColor: "white", // 배경색을 흰색으로 설정합니다.
//     },
//     header: {
//         marginTop: 20,
//         paddingVertical: 20,
//         backgroundColor: "white",
//         width: "90%",
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     headerTitle: {
//         fontSize: 30,
//         color: "#7794FF",
//         fontWeight: "bold",
//     },
//     checkResetBtnContainer: {
//         flexDirection: 'row-reverse',
//         width: '80%',
//         paddingTop: 0,
//         paddingBottom: 10,
//     },
//     checkResetBtn: {
//         color: 'black',
//     },
//     checkResetBtnText: {
//         fontWeight: 'bold',
//         borderWidth: 1,
//         borderRadius: 10,
//         padding: 2,
//     },
//     wordlist: {
//         backgroundColor: 'white',
//         width: "90%",
//     },
//     wordRow: {
//         marginBottom: 10, // 버튼 사이의 간격
//         marginHorizontal: 15,
//         backgroundColor: "#AABCFD", // 버튼의 배경색
//         borderRadius: 30, // 버튼의 모서리 둥글기
//         padding: 20, // 상하 패딩
//         width: "90%", // 버튼의 너비
//         elevation: 3, // 안드로이드에서 그림자 효과
//         shadowOpacity: 0.3, // iOS에서 그림자 효과
//         shadowRadius: 4, // iOS에서 그림자 둥근 효과
//         shadowColor: "#000", // iOS에서 그림자 색상
//         shadowOffset: { height: 2, width: 0 }, // iOS에서 그림자 방향
//         borderColor: "#A4A4A4",
//         borderWidth: 1,
//     },
//     selectedWord: {
//     },
//     selectedWordText: {
//         color: 'red',
//     },
//     wordText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default TodayReviewListPage;
