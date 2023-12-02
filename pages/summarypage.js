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
  const reviewWordCount = 30; // 복습 단어 개수

  // 틀린 단어 변화 계산
  // 이전 출석 날짜 찾기
  const sortedDates = Object.keys(attendData)
    .filter((date) => date < selectedDate && attendData[date].marked)
    .sort((a, b) => new Date(b) - new Date(a)); // 내림차순 정렬

  const lastAttendedDate = sortedDates[0] || null;
  const previousData = lastAttendedDate ? attendData[lastAttendedDate] : {};

  let wrongWordChange = "변화 없습니다.";
  if (previousData.wrongcount && data.wrongcount > previousData.wrongcount) {
    wrongWordChange = `지난번보다 틀린 단어가 ${
      data.wrongcount - previousData.wrongcount
    }개 증가했습니다.`;
  } else if (
    previousData.wrongcount &&
    data.wrongcount < previousData.wrongcount
  ) {
    wrongWordChange = `지난번보다 틀린 단어가 ${
      previousData.wrongcount - data.wrongcount
    }개 감소했습니다.`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Date: {selectedDate}</Text>
      <Text style={styles.result}>
        오늘의 단어: {data.todaytestresult || "테스트를 아직 안 봤습니다."} /{" "}
        {todayWordCount}
      </Text>
      <Text style={styles.result}>
        복습 단어: {data.reviewtestresult || "테스트를 아직 안 봤습니다."} /{" "}
        {reviewWordCount}
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
