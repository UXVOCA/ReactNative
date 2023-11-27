import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestPage from "./pages/testpage.js";
import TodayTestPage from "./pages/todaytestpage.js";
import ReviewTestPage from "./pages/reviewtestpage.js";
import WrongTestPage from "./pages/wrongtestpage.js";
import TodayTestAnswerPage from "./pages/todaytestanswerpage.js";
import HomePage from "./pages/homepage.js";
import CustomHeader from "./components/CustomHeader.js";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} title="Home" />,
          })}
        />
        <Stack.Screen
          name="TestPage"
          component={TestPage}
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="단어 테스트" />
            ),
          })}
        />
        <Stack.Screen
          name="TodayTestPage"
          component={TodayTestPage}
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader
                navigation={navigation}
                title="오늘의 단어 테스트"
              />
            ),
          })}
        />
        <Stack.Screen
          name="TodayTestAnswer"
          component={TodayTestAnswerPage}
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="TodayTestAnswer" />
            ),
          })}
        />
        <Stack.Screen
          name="ReviewTestPage"
          component={ReviewTestPage}
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="복습 단어 테스트" />
            ),
          })}
        />
        <Stack.Screen
          name="WrongTestPage"
          component={WrongTestPage}
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="틀린 단어 테스트" />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
