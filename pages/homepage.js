import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import Attendance from "../components/Attendance";
import { attendContext } from "../store/attendContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const getWrongWordCount = async () => {
  try {
    const totalWrongCountString = await AsyncStorage.getItem("totalWrongCount");
    if (totalWrongCountString !== null) {
      return JSON.parse(totalWrongCountString);
    }
  } catch (error) {
    console.error("Error reading totalWrongCount from AsyncStorage", error);
    return 0; // 또는 적절한 에러 처리
  }
};
function HomePage() {
  const { attendData } = useContext(attendContext);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [attendanceStreak, setAttendanceStreak] = useState(0);
  //정민아!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 여기가 틀린 단어 테스트 개수야. 그냥 wrongWordCount를 쓰면 돼!!!!
  useFocusEffect(
    React.useCallback(() => {
      const fetchWrongWordCount = async () => {
        const wrongWordCount = await getWrongWordCount();
        console.log("총 틀린 단어 수:", wrongWordCount);
      };

      fetchWrongWordCount();
    }, [])
  );
  //정민아!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!여기가 오늘의 단어 맞춘 총 개수임. correctAnswersCount 쓰면 돼
  useFocusEffect(
    React.useCallback(() => {
      const fetchCorrectAnswersCount = async () => {
        try {
          const correctAnswersCountString = await AsyncStorage.getItem(
            "correctAnswersCount"
          );
          const correctAnswersCount = correctAnswersCountString
            ? JSON.parse(correctAnswersCountString)
            : 0;
          console.log(
            "오늘의 단어 테스트 맞춘 총 문제 수:",
            correctAnswersCount
          );
        } catch (error) {
          console.error(
            "AsyncStorage에서 정답 맞춘 횟수를 불러오는 중 오류 발생:",
            error
          );
        }
      };

      fetchCorrectAnswersCount();
    }, [])
  );
  //정민아!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 여기가 복습단어 테스트 결과야!
  useFocusEffect(
    React.useCallback(() => {
      const fetchReviewedWordsData = async () => {
        try {
          const totalReviewedWordsCountString = await AsyncStorage.getItem(
            "totalReviewedWordsCount"
          );
          const correctReviewedWordsCountString = await AsyncStorage.getItem(
            "correctReviewedWordsCount"
          );

          const totalReviewedWordsCount = totalReviewedWordsCountString
            ? JSON.parse(totalReviewedWordsCountString)
            : 0;
          const correctReviewedWordsCount = correctReviewedWordsCountString
            ? JSON.parse(correctReviewedWordsCountString)
            : 0;

          console.log("전체 복습 단어 개수:", totalReviewedWordsCount);
          console.log("맞은 복습 단어 개수:", correctReviewedWordsCount);
        } catch (error) {
          console.error(
            "AsyncStorage에서 복습 단어 데이터를 불러오는 중 오류 발생:",
            error
          );
        }
      };

      fetchReviewedWordsData();
    }, [])
  );

  const navigation = useNavigation();

  //날짜 바뀌었는지 확인
  const checkAndUpdate = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // 현재 날짜 (YYYY-MM-DD)
      const lastVisitDate = await AsyncStorage.getItem("lastVisitDate");

      console.log("최종방문일 : ", lastVisitDate);
      console.log("오늘: ", today);
      if (lastVisitDate !== today) {
        await updateWordList(); // 필요한 갱신 작업 수행
        await AsyncStorage.setItem("lastVisitDate", today); // 오늘 날짜로 갱신
      }
    } catch (e) {
      console.error("Error checking last visit date:", e);
    }
  };

  // 앱 시작 시 호출
  checkAndUpdate();

  //바뀌었으면 learncount와 todaytested갱신
  const updateWordList = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("wordList");
      let wordList = jsonValue != null ? JSON.parse(jsonValue) : [];

      // 단어 목록 업데이트
      const updatedWordList = wordList.map((word) => ({
        ...word,
        learncount: word.todaytested ? word.learncount + 1 : word.learncount,
        todaytested: false,
      }));

      // 업데이트된 목록 저장
      await AsyncStorage.setItem("wordList", JSON.stringify(updatedWordList));
    } catch (e) {
      console.error("Failed to update wordList:", e);
    }
  };

  const handleMonthChange = (month) => {
    setCurrentYear(month.year);
    setCurrentMonth(month.month);
  };

  const handleDayPress = (day) => {
    const marked = attendData[day.dateString]?.marked;

    if (marked) {
      navigation.navigate("SummaryPage", { selectedDate: day.dateString });
    } else {
      // marked 되지 않은 날짜라면 다른 액션을 취함.
      console.log("This date is not marked for attendance");
    }
  };

  const calculateStreak = (attendData) => {
    const today = new Date();
    let streak = 0;
    let currentDay = today;

    while (true) {
      const dateString = `${currentDay.getFullYear()}-${String(
        currentDay.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDay.getDate()).padStart(2, "0")}`;

      if (attendData[dateString]?.marked) {
        streak++;
        // 이전 날짜로 이동
        currentDay = new Date(currentDay.setDate(currentDay.getDate() - 1));
      } else {
        break; // 출석 안하면 종료
      }
    }
    return streak;
  };

  const getAttendanceStreakText = (streak) => {
    if (streak === 0) {
      return "오늘도 출석을 시작해 보세요!";
    } else {
      return `${streak}일 연속 출석 중!`;
    }
  };

  useEffect(() => {
    const streak = calculateStreak(attendData);
    setAttendanceStreak(streak);
  }, [attendData]);

  return (
    <View style={styles.container}>
      <Text style={[{ marginBottom: 15 }, styles.attendanceTitle]}>
        이 달의 출석률
      </Text>
      <Attendance currentMonth={currentMonth} currentYear={currentYear} />
      <Calendar
        markedDates={attendData}
        style={{ marginTop: 15 }}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
      />
      <Text style={styles.attendanceStreak}>
        {getAttendanceStreakText(attendanceStreak)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  attendanceStreak: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B9CD3",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textShadowColor: "#AAA",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#4B9CD3",
    backgroundColor: "#E8F0F2",
    elevation: 3, // 안드로이드에만 적용되는 그림자 효과
    shadowColor: "#000", // iOS에만 적용되는 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // iOS에만 적용되는 그림자 위치
    shadowOpacity: 0.25, // iOS에만 적용되는 그림자 투명도
    shadowRadius: 3.84, // iOS에만 적용되는 그림자 둥글기
  },
  attendanceTitle: {
    marginBottom: 15,
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B9CD3", // 주제색과 일치하게
    paddingVertical: 5, // 상하 여백 추가
    paddingHorizontal: 10, // 좌우 여백 추가
    backgroundColor: "#E8F0F2", // 배경색 추가
    borderRadius: 20, // 둥근 모서리
    overflow: "hidden", // 배경색이 모서리를 넘치지 않게
    elevation: 3, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // iOS 그림자 위치
    shadowOpacity: 0.1, // iOS 그림자 투명도
    shadowRadius: 1.5, // iOS 그림자 반경
  },
});

export default HomePage;
