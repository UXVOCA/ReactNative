// HomePage.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>홈페이지에 오신 것을 환영합니다!</Text>
      {/* 추가적인 컨텐츠와 컴포넌트들을 여기에 배치할 수 있습니다. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});

export default HomePage;
