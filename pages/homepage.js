import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Calendar } from "react-native-calendars";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const markedDates = {
  "2023-11-01": { marked: true, dotColor: "#7794FF" },
  "2023-11-02": { marked: true, dotColor: "#7794FF" },
  "2023-11-03": { marked: true, dotColor: "#7794FF" },
  "2023-11-13": { marked: true, dotColor: "#7794FF" },
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const caculateAttendancePercentage = (markedDates, year, month) => {
  const daysInMonth = getDaysInMonth(month, year);
  let attendedDays = Object.keys(markedDates).filter((date) => {
    const dateObj = new Date(date);
    return (
      dateObj.getMonth() === month - 1 &&
      dateObj.getFullYear() === year &&
      markedDates[date].marked
    );
  }).length;

  return (attendedDays / daysInMonth) * 100;
};

function HomePage() {
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let percentage = caculateAttendancePercentage(markedDates, year, month);
    setFillPercentage(percentage);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 15 }}>Attendance</Text>
      <View style={styles.attndance}>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={fillPercentage}
          tintColor="#7794FF"
          backgroundColor="#BEBEBE"
        >
          {(fill) => <Text>{`${Math.round(fill)} %`}</Text>}
        </AnimatedCircularProgress>
        <View style={styles.attendanceLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, styles.presentIndicator]} />
            <Text style={styles.legendLabel}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, styles.absentIndicator]} />
            <Text style={styles.legendLabel}>Absent</Text>
          </View>
        </View>
      </View>
      <Calendar markedDates={markedDates} style={{ marginTop: 15 }} />
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
  attndance: {
    flexDirection: "row",
  },
  attendanceLegend: {
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginBottom: 15,
  },
  legendIndicator: {
    width: 20,
    height: 20,
  },
  presentIndicator: {
    backgroundColor: "#7794FF",
  },
  absentIndicator: {
    backgroundColor: "#BEBEBE",
  },
  legendLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  attendanceStreak: {
    fontSize: 18,
    fontWeight: 500,
    marginVertical: 20,
  },
});
export default HomePage;
