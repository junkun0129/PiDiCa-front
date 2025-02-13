import { Button, DatePicker, Segmented } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appRoute, REPORT_MODE } from "../const";
import dayjs from "dayjs";
import { getCreatedByMonthApi } from "../api/report.api";

const ReportMangePage = () => {
  const [date, setdate] = useState<string>("");
  const navigate = useNavigate();
  const [selectedMonth, setselectedMonth] = useState<string>(
    dayjs(new Date()).format("YYYY-MM")
  );
  const [mode, setmode] = useState<string>(REPORT_MODE.PLAN);
  const [createdList, setcreatedList] = useState<any[]>([]);

  useEffect(() => {
    getCreatedByMonthApi({ date: selectedMonth, status: mode }).then((res) => {
      console.log(res);
      if (res.result === "success") {
        setcreatedList(res.data);
      }
    });
  }, [mode, selectedMonth]);

  return (
    <div>
      <DatePicker
        format={"YYYY-MM"}
        onChange={(date, dateString) => {
          console.log(dateString);
          setdate(dateString as string);
        }}
        disabledDate={(current) => {
          const date = dayjs(current).format("DD");
          return createdList.some(
            (item) =>
              dayjs(item.date).format("DD") === date &&
              dayjs(current).format("YYYY-MM") === selectedMonth
          );
        }}
        onPanelChange={(date, dateString) => {
          console.log(dayjs(date).format("YYYY-MM"));
          setselectedMonth(dayjs(date).format("YYYY-MM"));
        }}
        renderExtraFooter={() => (
          <Segmented
            options={[
              {
                label: "計画",
                value: REPORT_MODE.PLAN,
              },
              {
                label: "実績",
                value: REPORT_MODE.ACTION,
              },
            ]}
            onChange={(value) => {
              setmode(value);
            }}
          />
        )}
      />
    </div>
  );
};

export default ReportMangePage;
