import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { attendContext } from "../store/attendContext";

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

function Attendance({ currentYear, currentMonth }) {
  const [fillPercentage, setFillPercentage] = useState(0);
  const { attendData } = useContext(attendContext);

  useEffect(() => {
    let percentage = caculateAttendancePercentage(
      attendData,
      currentYear,
      currentMonth
    );
    setFillPercentage(percentage);
  }, [attendData, currentYear, currentMonth]);

  return (
    <View style={styles.attndance}>
      <AnimatedCircularProgress
        size={120}
        width={15}
        fill={fillPercentage}
        tintColor="#7794FF"
        backgroundColor="#BEBEBE"
        rotation={0}
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
  );
}

const styles = StyleSheet.create({
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

export default Attendance;
