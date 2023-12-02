import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestPage from "./pages/testpage.js";
import TodayTestPage from "./pages/todaytestpage.js";
import ReviewTestPage from "./pages/reviewtestpage.js";
import WrongTestPage from "./pages/wrongtestpage.js";
import TodayTestAnswerPage from "./pages/todaytestanswerpage.js";
import WrongTestAnswerPage from "./pages/wrongtestanswerpage.js";
import HomePage from "./pages/homepage.js";
import CustomHeader from "./components/CustomHeader.js";
import TodayListPage from "./pages/todaylistpage.js";
import TodayNewListPage from "./pages/todaynewlistpage.js";
import TodayReviewListPage from "./pages/todayreviewlistpage.js";
import WrongListPage from "./pages/wronglistpage.js";
import WrongPage from "./pages/wrongpage.js";
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
              <CustomHeader
                navigation={navigation}
                title="오늘의 단어 테스트 결과"
              />
            ),
          })}
        />

        <Stack.Screen
          name="WrongPage"
          component={WrongPage}
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader navigation={navigation} title="틀린 단어" />
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
        <Stack.Screen
          name="WrongTestAnswerPage"
          component={WrongTestAnswerPage}
          options={({ navigation }) => ({
            header: () => (
              <CustomHeader
                navigation={navigation}
                title="틀린 단어 테스트 결과"
              />
            ),
          })}
        />
        <Stack.Screen
          name="TodayListPage"
          component={TodayListPage}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} title="오늘의 단어" />,
          })}
        />
        <Stack.Screen
          name="TodayNewListPage"
          component={TodayNewListPage}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} title="오늘의 새로운 단어" />,
          })}
        />
        <Stack.Screen
          name="TodayReviewListPage"
          component={TodayReviewListPage}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} title="오늘의 복습 단어" />,
          })}
        />
        <Stack.Screen
          name="WrongListPage"
          component={WrongListPage}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} title="Home" />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;