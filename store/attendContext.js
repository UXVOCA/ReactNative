import React, { createContext, useState } from "react";

export const attendContext = createContext({});

const markedDates = {
  "2023-11-01": { marked: true, dotColor: "#7794FF" },
  "2023-11-02": { marked: true, dotColor: "#7794FF" },
  "2023-11-03": { marked: true, dotColor: "#7794FF" },
  "2023-11-13": { marked: true, dotColor: "#7794FF" },
};

export function AttendProvider({ children }) {
  const [attendData, setAttendData] = useState(markedDates);

  return (
    <attendContext.Provider value={{ attendData, setAttendData }}>
      {children}
    </attendContext.Provider>
  );
}
