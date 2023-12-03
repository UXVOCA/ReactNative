import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { attendContext } from "../store/attendContext";

function SummaryPage() {
  const { attendData } = useContext(attendContext);
  const route = useRoute();
  const { selectedDate } = route.params;

  const data = attendData[selectedDate] || {};
  const todayWordCount = 30; // 오늘의 단어 개수

  // 선택된 날짜 바로 이전 날짜를 찾는 함수
  const findLastAttendedDate = (attendData, selectedDate) => {
    const dates = Object.keys(attendData).filter(
      (date) => attendData[date].marked
    );
    const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
    const selectedIndex = sortedDates.findIndex(
      (date) => date === selectedDate
    );
    return sortedDates[selectedIndex + 1] || null; // 선택된 날짜의 바로 이전 날짜 반환
  };

  // 이전 출석 날짜 찾기
  const lastAttendedDate = findLastAttendedDate(attendData, selectedDate);
  const previousData = lastAttendedDate ? attendData[lastAttendedDate] : null;

  // 틀린 단어 변화 계산
  let wrongWordChange = "변화 없습니다.";
  if (!previousData) {
    // 이전 출석 데이터가 없을 경우
    if (data.wrongcount > 0) {
      wrongWordChange = `이전 출석 데이터가 없습니다. 틀린 단어가 ${data.wrongcount}개 있습니다.`;
    } else {
      wrongWordChange = `이전 출석 데이터가 없습니다. 틀린 단어가 없습니다.`;
    }
  } else if (data.wrongcount > (previousData.wrongcount || 0)) {
    // 이전 데이터가 있고 틀린 단어가 증가한 경우
    wrongWordChange = `지난번보다 틀린 단어가 ${
      data.wrongcount - (previousData.wrongcount || 0)
    }개 증가했습니다.`;
  } else if (data.wrongcount < (previousData.wrongcount || 0)) {
    // 이전 데이터가 있고 틀린 단어가 감소한 경우
    wrongWordChange = `지난번보다 틀린 단어가 ${
      (previousData.wrongcount || 0) - data.wrongcount
    }개 감소했습니다.`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Date: {selectedDate}</Text>
      <Text style={styles.result}>
        오늘의 단어:{" "}
        {`${data.todaytestresult} / ${todayWordCount}` ||
          "테스트를 아직 안 봤습니다."}
      </Text>
      <Text style={styles.result}>
        복습 단어:{" "}
        {`${data.reviewtestresult} / ${data.totalReviewCount}` ||
          "테스트를 아직 안 봤습니다."}
      </Text>
      <Text style={styles.result}>틀린 단어: {data.wrongcount}</Text>
      <Text style={styles.change}>{wrongWordChange}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  result: {
    fontSize: 16,
    marginVertical: 5,
  },
  change: {
    fontSize: 16,
    color: "red",
  },
});

export default SummaryPage;
