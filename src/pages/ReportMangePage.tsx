import {
  Button,
  DatePicker,
  Flex,
  Pagination,
  Segmented,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appRoute, QURERY_PARAM, REPORT_MODE } from "../const";
import dayjs from "dayjs";
import { getCreatedByMonthApi, getReportListApi } from "../api/report.api";
import ReportCreateButton from "../components/buttons/ReportCreateButton";

const ReportMangePage = () => {
  const [selectedDate, setselectedDate] = useState<string>(
    dayjs(new Date()).format("YYYY-MM")
  );
  const [offset, setoffset] = useState(0);
  const [pagination, setpagination] = useState(10);
  const [reportList, setreportList] = useState<any[]>([]);
  const [total, settotal] = useState(0);
  useEffect(() => {
    getReportList();
  }, [selectedDate]);
  const getReportList = async () => {
    const res = await getReportListApi({
      date: selectedDate,
      offset,
      pagination,
    });
    console.log(res);
    setreportList(res.data);
    settotal(res.total);
  };
  return (
    <div className="w-full">
      <Flex className="w-full" justify="space-between" align="center">
        <Typography.Title level={3}>{`${selectedDate.split("-")[0]}年${
          selectedDate.split("-")[1]
        }月の日報一覧`}</Typography.Title>
        <ReportCreateButton />
      </Flex>

      <Pagination
        total={total}
        pageSize={pagination}
        current={offset}
        onChange={(page, pageSize) => {
          setoffset(page);
          setpagination(pageSize);
        }}
      />
    </div>
  );
};

export default ReportMangePage;
