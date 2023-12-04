import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    totalReviewCount: 30,
  },
};

// Added attendDataLoaded state to the context
export const attendContext = createContext({
  attendData: {},
  updateAttendance: () => {},
  attendDataLoaded: false,
  setAttendDataLoaded: () => {},
});

export function AttendProvider({ children }) {
  const [attendData, setAttendData] = useState(initialMarkedDates);
  const [attendDataLoaded, setAttendDataLoaded] = useState(false);

  // This function loads the attendance data and sets the loaded flag
  const loadAttendanceData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("attendanceData");
      if (storedData !== null) {
        setAttendData(JSON.parse(storedData));
      } else {
        await AsyncStorage.setItem(
          "attendanceData",
          JSON.stringify(initialMarkedDates)
        );
        setAttendData(initialMarkedDates);
      }
      // Set the attendDataLoaded flag to true after the data is set
      setAttendDataLoaded(true);
    } catch (error) {
      console.error("Error loading attendance data", error);
    }
  };

  // Call loadAttendanceData when the component mounts
  useEffect(() => {
    loadAttendanceData();
  }, []);

  // The updateAttendance function now checks if the data is loaded before updating
  const updateAttendance = async (newData) => {
    if (attendDataLoaded) {
      try {
        const updatedData = { ...attendData, ...newData };
        setAttendData(updatedData);
        await AsyncStorage.setItem(
          "attendanceData",
          JSON.stringify(updatedData)
        );
      } catch (error) {
        console.error("Error updating attendance data", error);
      }
    }
  };

  // Provide the attendData, updateAttendance, and attendDataLoaded flag to the context
  return (
    <attendContext.Provider
      value={{
        attendData,
        updateAttendance,
        attendDataLoaded,
        setAttendDataLoaded,
      }}
    >
      {children}
    </attendContext.Provider>
  );
}
