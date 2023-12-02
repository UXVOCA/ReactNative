import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import Attendance from "../components/Attendance";
import { attendContext } from "../store/attendContext";

function HomePage() {
  const { attendData } = useContext(attendContext);
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 15 }}>Attendance</Text>
      <Attendance />
      <Calendar markedDates={attendData} style={{ marginTop: 15 }} />
      <Text style={styles.attendanceStreak}>1일 연속 출석 중 !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
});
export default HomePage;
