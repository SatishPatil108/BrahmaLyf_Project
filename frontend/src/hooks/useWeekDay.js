import { useState } from "react";

const useWeekDay = (initialWeek = 1, initialDay = 1) => {
  const [weekNo, setWeekNo] = useState(initialWeek);
  const [dayNo, setDayNo] = useState(initialDay);

  return {
    weekNo,
    dayNo,
    setWeekNo,
    setDayNo,
  };
};

export default useWeekDay;
