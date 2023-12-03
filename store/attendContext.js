import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const attendContext = createContext({});

const initialMarkedDates = {
  "2023-11-01": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 20,
    reviewtestresult: 15,
    wrongcount: 3,
    totalReviewCount: 20,
  },
  "2023-11-02": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 25,
    reviewtestresult: 18,
    wrongcount: 1,
    totalReviewCount: 20,
  },
  "2023-11-03": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 22,
    reviewtestresult: 20,
    wrongcount: 0,
    totalReviewCount: 20,
  },
  "2023-11-13": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 30,
    reviewtestresult: 28,
    wrongcount: 2,
    totalReviewCount: 20,
  },
};

export function AttendProvider({ children }) {
  const [attendData, setAttendData] = useState(initialMarkedDates);

  const loadAttendanceData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("attendanceData");
      if (storedData !== null) {
        setAttendData(JSON.parse(storedData));
      } else {
        // 처음 앱을 사용할 때는 초기 데이터를 설정
        setAttendData(initialMarkedDates);
        await AsyncStorage.setItem(
          "attendanceData",
          JSON.stringify(initialMarkedDates)
        );
      }
    } catch (error) {
      console.error("Error loading attendance data", error);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  // 출석 데이터를 업데이트하고 AsyncStorage에 저장하는 함수
  const updateAttendance = async (newData) => {
    try {
      // attendData 상태를 업데이트
      const updatedData = { ...attendData, ...newData };
      setAttendData(updatedData);
      // AsyncStorage에 'attendanceData' 키로 데이터 저장
      await AsyncStorage.setItem("attendanceData", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error updating attendance data", error);
    }
  };

  return (
    <attendContext.Provider value={{ attendData, updateAttendance }}>
      {children}
    </attendContext.Provider>
  );
}
