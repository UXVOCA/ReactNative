import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestPage from "./pages/testpage.js";
import TodayTestPage from "./pages/todaytestpage.js";
import ReviewTestPage from "./pages/reviewtestpage.js";
import WrongTestPage from "./pages/wrongtestpage.js";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TestPage" component={TestPage} />
        <Stack.Screen name="TodayTestPage" component={TodayTestPage} />
        <Stack.Screen name="ReviewTestPage" component={ReviewTestPage} />
        <Stack.Screen name="WrongTestPage" component={WrongTestPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
