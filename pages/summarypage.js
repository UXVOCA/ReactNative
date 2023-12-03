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

  // 선택된 날짜 이전의 출석 데이터 중 wrongcount가 undefined가 아닌 마지막 데이터를 찾는 함수
  const findLastValidWrongCountDate = (attendData, selectedDate) => {
    const dates = Object.keys(attendData).filter(
      (date) =>
        date < selectedDate &&
        attendData[date].marked &&
        attendData[date].wrongcount !== undefined
    );
    const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
    return sortedDates[0] || null; // 이전 날짜 중 wrongcount가 유효한 마지막 날짜 반환
  };

  // 이전 유효한 wrongcount를 가진 출석 날짜 찾기
  const lastValidWrongCountDate = findLastValidWrongCountDate(
    attendData,
    selectedDate
  );
  const previousValidData = lastValidWrongCountDate
    ? attendData[lastValidWrongCountDate]
    : null;

  // 틀린 단어 변화 계산
  let wrongWordChange = "변화 없습니다.";
  if (!previousValidData) {
    // 이전에 유효한 wrongcount가 없을 경우
    wrongWordChange = `틀린 단어가 없습니다.`;
  } else {
    const difference = data.wrongcount - previousValidData.wrongcount;
    if (difference > 0) {
      wrongWordChange = `지난번보다 틀린 단어가 ${difference}개 증가했습니다.`;
    } else if (difference < 0) {
      wrongWordChange = `지난번보다 틀린 단어가 ${-difference}개 감소했습니다.`;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>Selected Date: {selectedDate}</Text>
      </View>

      {/* 오늘의 단어 */}
      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>오늘의 단어</Text>
        <Text style={styles.resultText}>
          <Text style={styles.resultCount}>
            {data.todaytestresult !== undefined ? data.todaytestresult : "0"}
          </Text>
          <Text style={styles.totalCount}> / {todayWordCount}</Text>
        </Text>
      </View>

      {/* 복습 단어 */}
      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>복습 단어</Text>
        <Text style={styles.resultText}>
          <Text style={styles.resultCount}>
            {data.reviewtestresult !== undefined ? data.reviewtestresult : "0"}
          </Text>
          <Text style={styles.totalCount}> / {data.totalReviewCount}</Text>
        </Text>
      </View>

      {/* 틀린 단어 */}
      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>틀린 단어</Text>
        <Text style={styles.resultText}>
          {data.wrongcount !== undefined ? (
            <Text style={[styles.resultCount, { color: "red" }]}>
              {data.wrongcount}
            </Text>
          ) : (
            <Text>"테스트를 아직 안 봤습니다."</Text>
          )}
        </Text>
      </View>
      {data.wrongcount !== undefined && (
        <Text style={styles.change}>{wrongWordChange}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // 중앙 정렬에서 시작 정렬로 변경
    alignItems: "center",
    paddingTop: 50, // 상단에 여백 추가
    backgroundColor: "#F0F8FF", // 밝은 청색 계열의 배경색
  },
  title: {
    fontSize: 26, // 글자 크기 증가
    fontWeight: "600", // 글자 무게 변경
    color: "#333", // 글자 색상을 진한 회색으로 변경
    paddingBottom: 20, // 제목 아래 여백 추가
    borderBottomWidth: 1, // 하단 경계선 추가
    borderBottomColor: "#DDD", // 하단 경계선 색상 설정
    marginBottom: 20, // 경계선 아래 여백 추가
    alignSelf: "stretch", // 컨테이너 너비에 맞게 조정
    textAlign: "center", // 중앙 정렬
  },
  result: {
    fontSize: 18,
    marginVertical: 10, // 상하 여백 증가
    backgroundColor: "#FFF", // 배경색을 흰색으로 설정
    paddingVertical: 8, // 상하 패딩 추가
    paddingHorizontal: 16, // 좌우 패딩 추가
    borderRadius: 20, // 모서리 둥글게 설정
    width: "90%", // 너비를 90%로 설정
    alignSelf: "center", // 중앙 정렬
    elevation: 1, // 그림자 효과 추가 (안드로이드)
    shadowColor: "#000", // 그림자 색상 설정 (iOS)
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치 조정 (iOS)
    shadowOpacity: 0.1, // 그림자 투명도 조정 (iOS)
    shadowRadius: 2, // 그림자 둥근 정도 조정 (iOS)
    marginHorizontal: "5%", // 좌우 여백 설정
  },
  change: {
    fontSize: 18,
    color: "red", // 글자 색상을 빨간색으로 변경
    marginTop: 20, // 위쪽 여백 추가
    fontWeight: "500", // 글자 무게 변경
  },
  resultBox: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left", // 텍스트를 박스 중앙에 정렬
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingBottom: 5, // 타이틀과 내용 사이의 여백
  },
  resultCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green", // 맞은 갯수는 녹색으로 표시
    paddingRight: 5, // 숫자와 슬래시 사이의 여백
  },
  totalCount: {
    fontSize: 16,
    color: "#777", // 전체 갯수는 회색으로 표시
  },
});

export default SummaryPage;
