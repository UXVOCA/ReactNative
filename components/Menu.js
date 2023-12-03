import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

function Menu({ navigation, setMenuVisible, menuVisible }) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: menuVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);

  const navigateToScreen = (screenName) => {
    // 메뉴 닫기 애니메이션 시작
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // 애니메이션이 끝난 후 메뉴 상태를 업데이트하고 화면 전환
      setMenuVisible(false);
      navigation.navigate(screenName);
    });
  };

  return (
    <>
      <Animated.View style={[styles.menuContainer, { opacity: opacityAnim }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("TodayListPage")}
        >
          <AntDesign style={styles.icon} name="book" size={24} color="black" />
          <Text style={styles.menuText}>오늘의 단어</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("TestPage")}
        >
          <FontAwesome
            style={styles.icon}
            name="question-circle-o"
            size={24}
            color="black"
          />
          <Text style={styles.menuText}>복습 단어</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("WrongPage")}
        >
          <Ionicons
            style={styles.icon}
            name="book-outline"
            size={24}
            color="black"
          />
          <Text style={styles.menuText}>틀린 단어</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateToScreen("Home")}
        >
          <Ionicons
            style={styles.icon}
            name="ios-home-outline"
            size={24}
            color="black"
          />
          <Text style={styles.menuText}>HOME</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    borderTopColor: "black",
    position: "absolute",
    width: "100%",
    opacity: 1,
    backgroundColor: "white",
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: 0.8,
    paddingBottom: 10,
  },

  menuItem: {
    alignItems: "center",
  },
  menuText: {
    fontWeight: "bold",
  },
  icon: {
    marginBottom: 5,
    color: "#7794FF",
  },
});

export default Menu;
