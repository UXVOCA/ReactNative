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
  const { attendData, updateAttendance } = useContext(attendContext);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [attendanceStreak, setAttendanceStreak] = useState(0);

  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [correctReviewedWordsCount, setCorrectReviewedWordsCount] = useState(0);
  const [totalReviewedWordsCount, setTotalReviewedWordsCount] = useState(0);
  const [wrongWordCount, setWrongWordCount] = useState(0);

  //틀린 단어 테스트 개수야. 그냥 wrongWordCount를 쓰면 돼!!!!
  useFocusEffect(
    React.useCallback(() => {
      const fetchWrongWordCount = async () => {
        const wrongWordCount = await getWrongWordCount();
        setWrongWordCount(wrongWordCount);
        console.log("총 틀린 단어 수:", wrongWordCount);
      };

      fetchWrongWordCount();
    }, [])
  );

  //여기가 오늘의 단어 맞춘 총 개수임. correctAnswersCount 쓰면 돼
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

          setCorrectAnswersCount(correctAnswersCount);
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

  //여기가 복습단어 테스트 결과야!
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

          setTotalReviewedWordsCount(totalReviewedWordsCount);
          setCorrectReviewedWordsCount(correctReviewedWordsCount);
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

  // 출석체크 로직
  useEffect(() => {
    (async () => {
      try {
        const selectedWordsString = await AsyncStorage.getItem("selectedWords");
        const selectedWords = selectedWordsString
          ? JSON.parse(selectedWordsString)
          : [];

        const today = new Date().toISOString().split("T")[0];

        const hasTestedToday = selectedWords.some((word) => word.todaytested);

        if (hasTestedToday) {
          const newAttendanceData = {
            [today]: {
              marked: true,
              dotColor: "#7794FF",
              todaytestresult: correctAnswersCount,
              reviewtestresult: correctReviewedWordsCount,
              wrongcount: wrongWordCount,
              totalReviewCount: totalReviewedWordsCount,
            },
          };

          await updateAttendance(newAttendanceData);
        }
      } catch (error) {
        console.error("Error updating attendance", error);
      }
    })();
  }, [
    correctAnswersCount,
    correctReviewedWordsCount,
    totalReviewedWordsCount,
    wrongWordCount,
    updateAttendance,
  ]);

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
