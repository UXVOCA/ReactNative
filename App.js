import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TestPage from "./pages/testpage";

export default function App() {
  return (
    <View style={styles.container}>
      <TestPage />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
