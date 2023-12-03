import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WrongPage = () => {
  const navigation = useNavigation();
  return (
      <View style={styles.container}>
          {/* 헤더 */}
          {/* <View style={styles.header}>
              <Text style={styles.headerTitle}>단어 리스트</Text>
          </View> */}

          <View style={styles.body}>
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("WrongListPage")}
              >
                  <Text style={styles.buttonText}>틀린 단어</Text>
                  {/* <Text style={styles.buttonText}></Text> */}
                  <Text style={styles.buttonText}>📝리스트📝</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("WrongTestPage")}
              >
                  <Text style={styles.buttonText}>틀린 단어</Text>
                  {/* <Text style={styles.buttonText}>새로운 단어</Text> */}
                  <Text style={styles.buttonText}>💯테스트💯</Text>
              </TouchableOpacity>
          </View>
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  headerTitle: {
      fontSize: 30,
      color: "#7794FF",
      fontWeight: "bold",
  },
  body:{
      marginTop: 80,
      alignItems: "center",
  },
  button: {
      alignItems: 'center',
      marginBottom: 100, // 버튼 사이의 간격
      backgroundColor: "#AABCFD", // 버튼의 배경색
      borderRadius: 30, // 버튼의 모서리 둥글기
      paddingVertical: 50, // 상하 패딩
      paddingHorizontal: 74, // 좌우 패딩
      width: "80%", // 버튼의 너비
      elevation: 3, // 안드로이드에서 그림자 효과
      shadowOpacity: 0.3, // iOS에서 그림자 효과
      shadowRadius: 4, // iOS에서 그림자 둥근 효과
      shadowColor: "#000", // iOS에서 그림자 색상
      shadowOffset: { height: 2, width: 0 }, // iOS에서 그림자 방향
      borderColor: "#A4A4A4",
      borderWidth: 1,
  },
  buttonText: {
      width: 150,
      color: "white", // 텍스트 색상
      textAlign: "center", // 텍스트 정렬
      fontSize: 30, // 텍스트 크기
      fontWeight: "bold", // 텍스트 굵기
      
  }
});
export default WrongPage;
