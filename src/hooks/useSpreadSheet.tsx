import { useState, useEffect, useRef } from "react";
import jspreadsheet from "jspreadsheet";
import dayjs from "dayjs";
import "jspreadsheet/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";
import { getAttendApi, submitAttendApi } from "../api/attend.api";
import {
  COLORIZE,
  generateCellsData,
  generateColumns,
  generateRowsFromDate,
  SPREAD_ROW_INDEX,
  validateSubmitData,
} from "../helpers/spreadsheet";
import formula from "@jspreadsheet/formula-pro";
formula.adjustPrecision = true;
formula.license({
  clientId: "e08277878957dd2d0bbf2023a920dcf2000f2d81",
  licenseKey:
    "YzE5ZDc1NTkzNGZlM2I0NTE2YTFkZjdkN2IwODA2ZGY2YzdhOTE3ZTYyYmUzMDYyNzJmYTY5NWRlOWNiNmUwNDgxNDY5YTA4OWJiNjNmZWI5NDAzODU5NmI3ZGEwOTZiMDcyYmJhYjYwMzZhOWUzMzRhZGY2MzQ4YWMzYjQ3NDQsZXlKamJHbGxiblJKWkNJNkltVXdPREkzTnpnM09EazFOMlJrTW1Rd1ltSm1NakF5TTJFNU1qQmtZMll5TURBd1pqSmtPREVpTENKdVlXMWxJam9pWEhVMVkyRTVYSFU0WXpNM1hIVTJaR1l6WEhVMVpUY3pJaXdpWkdGMFpTSTZNVGMwTWpReU9EZ3dNQ3dpWkc5dFlXbHVJanBiSW5kbFlpSXNJbXh2WTJGc2FHOXpkQ0pkTENKd2JHRnVJam96TVN3aWMyTnZjR1VpT2xzaWRqY2lMQ0oyT0NJc0luWTVJaXdpZGpFd0lpd2lkakV4SWl3aVptOXliWFZzWVNJc0ltWnZjbTF6SWl3aWNtVnVaR1Z5SWl3aWNHRnljMlZ5SWl3aWFXMXdiM0owWlhJaUxDSnpaV0Z5WTJnaUxDSmpiMjF0Wlc1MGN5SXNJblpoYkdsa1lYUnBiMjV6SWl3aVkyaGhjblJ6SWl3aWNISnBiblFpTENKaVlYSWlMQ0p6YUdWbGRITWlMQ0p6YUdGd1pYTWlMQ0p6WlhKMlpYSWlYWDA9",
} as any);

jspreadsheet.setLicense(
  "YzE5ZDc1NTkzNGZlM2I0NTE2YTFkZjdkN2IwODA2ZGY2YzdhOTE3ZTYyYmUzMDYyNzJmYTY5NWRlOWNiNmUwNDgxNDY5YTA4OWJiNjNmZWI5NDAzODU5NmI3ZGEwOTZiMDcyYmJhYjYwMzZhOWUzMzRhZGY2MzQ4YWMzYjQ3NDQsZXlKamJHbGxiblJKWkNJNkltVXdPREkzTnpnM09EazFOMlJrTW1Rd1ltSm1NakF5TTJFNU1qQmtZMll5TURBd1pqSmtPREVpTENKdVlXMWxJam9pWEhVMVkyRTVYSFU0WXpNM1hIVTJaR1l6WEhVMVpUY3pJaXdpWkdGMFpTSTZNVGMwTWpReU9EZ3dNQ3dpWkc5dFlXbHVJanBiSW5kbFlpSXNJbXh2WTJGc2FHOXpkQ0pkTENKd2JHRnVJam96TVN3aWMyTnZjR1VpT2xzaWRqY2lMQ0oyT0NJc0luWTVJaXdpZGpFd0lpd2lkakV4SWl3aVptOXliWFZzWVNJc0ltWnZjbTF6SWl3aWNtVnVaR1Z5SWl3aWNHRnljMlZ5SWl3aWFXMXdiM0owWlhJaUxDSnpaV0Z5WTJnaUxDSmpiMjF0Wlc1MGN5SXNJblpoYkdsa1lYUnBiMjV6SWl3aVkyaGhjblJ6SWl3aWNISnBiblFpTENKaVlYSWlMQ0p6YUdWbGRITWlMQ0p6YUdGd1pYTWlMQ0p6WlhKMlpYSWlYWDA9"
);
formula.setFormula({ COLORIZE });
jspreadsheet.setExtensions({ formula });

const useSpreadsheet = (selectedDate: string) => {
  const jssRef = useRef<HTMLDivElement>(null);
  const [attendStatus, setAttendStatus] = useState("");
  const [table, setTable] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!jssRef.current) return;
      jspreadsheet.destroy(jssRef.current);
      const res = await getAttendApi({ yearmonth: selectedDate });
      if (res.result !== "success") return;
      const { rows, status } = res.data;
      setAttendStatus(status);
      const maxDate = dayjs(selectedDate).daysInMonth();
      const generatedRows = generateRowsFromDate(maxDate);
      const generatedData =
        status === "未提出" ? generateCellsData(maxDate) : rows;
      const generatedColumns = generateColumns(status === "提出済");
      const spreadSheet = jspreadsheet(jssRef.current, {
        worksheets: [
          {
            data: generatedData,
            columns: generatedColumns as any,
            rows: generatedRows,
          },
        ],
      });
      setTable(spreadSheet);
    };

    fetchData();
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!table) return;
    const validateResult = validateSubmitData(table[0].getData(false, true));
    if (!validateResult.isSuccess) {
      if (!validateResult.indexes) return;
      table[0].setStyle(
        `${
          SPREAD_ROW_INDEX[
            validateResult.indexes.col as keyof typeof SPREAD_ROW_INDEX
          ]
        }${validateResult.indexes?.row}`,
        "background-color",
        "red"
      );
      return { success: false, message: validateResult.message };
    }
    if (!validateResult.value)
      return { success: false, message: "Validation failed" };
    if (dayjs(selectedDate).daysInMonth() === validateResult.value.length - 1) {
      const monthly = validateResult.value[validateResult.value.length - 1];
      const workhours = monthly[6] as number;
      const night = monthly[4] as number;
      const over = monthly[3] as number;
      if (isNaN(workhours) || isNaN(night) || isNaN(over))
        return { success: false, message: "Invalid data" };
      const res = await submitAttendApi({
        yearmonth: selectedDate,
        monthly: { workhours, night, over },
        daily: validateResult.value.slice(0, validateResult.value.length - 1),
      });
      return res.result === "success"
        ? { success: true, message: "出勤簿を提出しました。" }
        : { success: false, message: "出勤簿を提出できませんでした。" };
    } else {
      return { success: false, message: "日付が一致しません。" };
    }
  };

  return { jssRef, attendStatus, handleSubmit };
};

export default useSpreadsheet;
