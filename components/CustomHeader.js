import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Menu from "./Menu";
import { AntDesign } from "@expo/vector-icons";

function CustomHeader({ navigation, title }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.hamburger}>
            {menuVisible ? (
              <AntDesign
                name="closecircleo"
                style={styles.closecircle}
                size={28}
              />
            ) : (
              <AntDesign name="bars" style={styles.bars} size={28} />
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {menuVisible && (
          <Menu navigation={navigation} setMenuVisible={setMenuVisible} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "white", // Set your own color
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7794FF",
    // Add other styles for the title
  },
  closecircle: {
    color: "#7794FF",
  },
  bars: {
    color: "#7794FF",
  },
});

export default CustomHeader;
