import React from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

function SummaryPage() {
  const route = useRoute();
  const { selectedDate } = route.params; // 파라미터에서 선택된 날짜 추출

  return (
    <View>
      <Text>Selected Date : {selectedDate}</Text>
    </View>
  );
}

export default SummaryPage;
