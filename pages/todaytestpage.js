import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TodayTestPage = () => {
  const [currentNumber, setCurrentNumber] = useState(3); // 현재 번호를 상태로 관리합니다.

  // 숫자를 증가시키는 함수입니다.
  const increment = () => {
    setCurrentNumber((prevNumber) =>
      prevNumber < 10 ? prevNumber + 1 : prevNumber
    );
  };

  // 숫자를 감소시키는 함수입니다.
  const decrement = () => {
    setCurrentNumber((prevNumber) =>
      prevNumber > 1 ? prevNumber - 1 : prevNumber
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.wordText}>approach</Text>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton} onPress={decrement}>
          <Text style={styles.navButtonText}>〈</Text>
        </TouchableOpacity>
        <Text style={styles.navText}>{currentNumber}/10</Text>
        <TouchableOpacity style={styles.navButton} onPress={increment}>
          <Text style={styles.navButtonText}>〉</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={increment}>
        <Text style={styles.buttonText}>다가가다</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={increment}>
        <Text style={styles.buttonText}>멀어지다</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={increment}>
        <Text style={styles.buttonText}>왔다갔다</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  card: {
    width: "75%",
    height: "20%",
    marginVertical: 2,
    padding: 20,
    marginTop: 150,
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
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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
    paddingVertical: 30, // 상하 패딩
    width: "75%", // 버튼의 너비
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
});

export default TodayTestPage;
