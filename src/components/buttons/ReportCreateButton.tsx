import { Button, DatePicker, Segmented } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { appRoute, QURERY_PARAM, REPORT_MODE } from "../../const";
import { getCreatedByMonthApi } from "../../api/report.api";
import { PlusOutlined } from "@ant-design/icons";
const ReportCreateButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMonth, setselectedMonth] = useState<string>(
    dayjs(new Date()).format("YYYY-MM")
  );
  const [open, setopen] = useState(false);
  const [mode, setmode] = useState<string>(REPORT_MODE.PLAN);
  const [ChangedStats, setChangedStatus] = useState<{
    list: any[];
    newDate: string | null;
    newMode: string | null;
  }>({
    list: [],
    newDate: null,
    newMode: null,
  });

  useEffect(() => {
    if (ChangedStats.newDate) {
      console.log("datechanged", ChangedStats);
      setselectedMonth(ChangedStats.newDate);
      setChangedStatus((pre) => ({ ...pre, newDate: null }));
    }
    if (ChangedStats.newMode) {
      console.log("modechanged", ChangedStats);
      setmode(ChangedStats.newMode);
      setselectedMonth(selectedMonth);
      setChangedStatus((pre) => ({ ...pre, newMode: null }));
    }
  }, [ChangedStats]);

  const onPanelChange = async (date: any, modenode: string) => {
    const newMonth = dayjs(date).format("YYYY-MM");
    const list = await updateDateList(modenode, newMonth);
    if (!list) return;
    setChangedStatus((pre) => ({ ...pre, list, newDate: newMonth }));
  };

  const onModeChange = async (mode: string, date: string) => {
    const list = await updateDateList(mode, date);
    if (!list) return;
    setChangedStatus((pre) => ({ ...pre, list, newMode: mode }));
  };

  const updateDateList = async (mode: string, selectedMonth: string) => {
    try {
      const res = await getCreatedByMonthApi({
        date: selectedMonth,
        status: mode,
      });
      return res.data;
    } catch (err) {
      console.log("データ取得に失敗しました");
    }
  };
  const onClickDate = (date: any, mode: string) => {
    const selectedDate = dayjs(date).format("YYYY-MM-DD");
    const selectedMode = mode;
    const queryParams = new URLSearchParams(location.search);
    queryParams.set(QURERY_PARAM.DATE, selectedDate);
    queryParams.set(QURERY_PARAM.MODE, selectedMode);
    console.log(selectedMode, selectedDate);
    navigate({
      pathname: appRoute.reportRegister,
      search: queryParams.toString(),
    });
  };
  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setopen(true);
        }}
        icon={<PlusOutlined />}
        type="primary"
      >
        新規日報作成
      </Button>
      <DatePicker
        showNow={false}
        style={{ visibility: "hidden", width: 0 }}
        open={open}
        onOpenChange={(open) => setopen(open)}
        format={"YYYY-MM"}
        disabledDate={(current) => {
          if (dayjs(current).format("MM") !== selectedMonth.split("-")[1])
            return false;
          const date = dayjs(current).format("DD");
          return ChangedStats.list.includes(date);
        }}
        onChange={(date) => onClickDate(date, mode)}
        onPanelChange={(date) => onPanelChange(date, mode)}
        pickerValue={dayjs(selectedMonth)}
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
            onChange={(value) => onModeChange(value, selectedMonth)}
          />
        )}
      />
    </>
  );
};

export default ReportCreateButton;
