import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

function Menu({ navigation, setMenuVisible }) {
  const navigateToScreen = (screenName) => {
    setMenuVisible(false);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.menuContainer}>
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
        <Text style={styles.menuText}>단어 테스트</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigateToScreen("WrongTestPage")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    // Style your menu container
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
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
