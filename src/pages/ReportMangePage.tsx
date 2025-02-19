import { Button, DatePicker, Flex, Pagination, Typography } from "antd";
import { ReactNode, useEffect, useState } from "react";
import dayjs from "dayjs";
import { getReportListApi, ReportView } from "../api/report.api";
import ReportCreateButton from "../components/buttons/ReportCreateButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appRoute, QURERY_PARAM, REPORT_MODE } from "../const";
import { padZero } from "../helpers/util";
import { calculateArc } from "../helpers/math";

const ReportMangePage = () => {
  const [selectedDate, setselectedDate] = useState<string>(
    dayjs(new Date()).format("YYYY-MM")
  );

  const navigate = useNavigate();
  const [searchParams, setsearchParams] = useSearchParams();
  const [reportList, setreportList] = useState<{
    maxDate: string;
    list: { [key: string]: ReportView };
  }>({
    maxDate: "",
    list: {},
  });
  const [total, settotal] = useState(0);

  useEffect(() => {
    if (searchParams.get(QURERY_PARAM.DATE)) {
      setselectedDate(searchParams.get(QURERY_PARAM.DATE) || "");
    }
  }, [searchParams]);

  useEffect(() => {
    getReportList(selectedDate);
  }, [selectedDate]);

  const getReportList = async (selectedDate: string) => {
    const res = await getReportListApi({
      date: selectedDate,
    });

    setreportList({
      list: res.data,
      maxDate: dayjs(selectedDate).daysInMonth().toString(),
    });
    settotal(res.total);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(QURERY_PARAM.DATE, date.format("YYYY-MM"));
      setsearchParams(newSearchParams);
    }
  };
  const onClickButton = (date: string, mode: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set(QURERY_PARAM.DATE, date);
    newSearchParams.set(QURERY_PARAM.MODE, mode);
    navigate({
      pathname: appRoute.reportRegister,
      search: newSearchParams.toString(),
    });
  };
  const CreateButton = ({ date, mode }: { date: string; mode: string }) => {
    return <Button onClick={() => onClickButton(date, mode)}>作成</Button>;
  };

  const WorkHourPieChart = ({
    data,
    worktype,
  }: {
    data: any;
    worktype: string;
  }) => {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
    console.log(data);
    return (
      <div>
        <h4>{worktype}</h4>
        <svg width="120" height="120" viewBox="-60 -60 120 120">
          {/* 背景の円 */}
          <circle
            cx="0"
            cy="0"
            r="50"
            fill="none"
            stroke="#eee"
            strokeWidth="10"
          />

          {/* 作業時間のアーク */}
          {data.reportitems.length > 0 &&
            data.reportitems.map((item: any, index: number) => {
              console.log(item);
              const arc = calculateArc(
                item.ri_starttime,
                item.ri_endtime,
                data.workhour
              );
              return (
                <g key={index}>
                  <path
                    d={arc.path}
                    fill="none"
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth="10"
                  />
                  {/* オプション: 時間を表示 */}
                  <text
                    x="0"
                    y={-60 + index * 20}
                    fontSize="10"
                    fill={COLORS[index % COLORS.length]}
                  >
                    {`${item.starttime}-${item.endtime}`}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Flex className="w-full" justify="space-between" align="center">
        <Typography.Title level={3}>
          {`${selectedDate.split("-")[0]}年${
            selectedDate.split("-")[1]
          }月の日報一覧`}
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={handleDateChange}
            picker="month"
          ></DatePicker>
        </Typography.Title>
        <ReportCreateButton />
      </Flex>
      <Flex>
        {reportList.maxDate &&
          reportList.maxDate !== "" &&
          !isNaN(parseInt(reportList.maxDate)) &&
          Array(parseInt(reportList.maxDate))
            .fill("")
            .map((item, index) => {
              const day = padZero(index + 1);
              const planPropary = `${day}-${REPORT_MODE.PLAN}`;
              const actionPropary = `${day}-${REPORT_MODE.ACTION}`;
              console.log(planPropary);
              return (
                <div className="w-[50%]" key={day}>
                  <div>{day}日</div>
                  <Flex>
                    <div>
                      {planPropary in reportList.list ? (
                        <WorkHourPieChart
                          data={reportList.list[planPropary]}
                          worktype="Plan"
                        />
                      ) : (
                        <CreateButton
                          date={`${selectedDate}-${day}`}
                          mode={REPORT_MODE.PLAN}
                        />
                      )}
                    </div>
                    <div>
                      {actionPropary in reportList.list ? (
                        <WorkHourPieChart
                          data={reportList.list[actionPropary]}
                          worktype="Action"
                        />
                      ) : (
                        <CreateButton
                          date={`${selectedDate}-${day}`}
                          mode={REPORT_MODE.ACTION}
                        />
                      )}
                    </div>
                  </Flex>
                </div>
              );
            })}
      </Flex>
    </div>
  );
};

export default ReportMangePage;
