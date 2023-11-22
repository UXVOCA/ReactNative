import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TodayTestPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.wordText}>sdf</Text>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton}>
          <Text>〈</Text>
        </TouchableOpacity>
        <Text style={styles.navText}>3/10</Text>
        <TouchableOpacity style={styles.navButton}>
          <Text>〉</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>다가가다 ✔</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>멀어지다</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>왔다갔다</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  card: {
    width: "80%",
    marginVertical: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
  wordText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  button: {
    // ... 기존 버튼 스타일 ...
    // borderColor와 borderWidth 추가하기
    borderColor: "black",
    borderWidth: 1,
    // ... 기존 버튼 스타일 ...
  },
  buttonText: {
    // ... 기존 텍스트 스타일 ...
  },
});

export default TodayTestPage;
