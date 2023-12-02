import React, { createContext, useState } from "react";

export const attendContext = createContext({});

const markedDates = {
  "2023-11-01": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 20,
    reviewtestresult: 15,
    wrongcount: 3,
  },
  "2023-11-02": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 25,
    reviewtestresult: 18,
    wrongcount: 1,
  },
  "2023-11-03": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 22,
    reviewtestresult: 20,
    wrongcount: 0,
  },
  "2023-11-13": {
    marked: true,
    dotColor: "#7794FF",
    todaytestresult: 30,
    reviewtestresult: 28,
    wrongcount: 2,
  },
};

export function AttendProvider({ children }) {
  const [attendData, setAttendData] = useState(markedDates);

  return (
    <attendContext.Provider value={{ attendData, setAttendData }}>
      {children}
    </attendContext.Provider>
  );
}
