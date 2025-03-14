import { Badge, Button, Card, Flex, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  getReportListApi,
  ReportItemView,
  ReportView,
} from "../api/report.api";
import ReportCreateButton from "../components/buttons/ReportCreateButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appRoute, QURERY_PARAM, REPORT_MODE } from "../const";
import { formatDate, padZero } from "../helpers/util";
import { calculateArc } from "../helpers/math";
import ChangeSelectedMonthButton from "../components/buttons/ChangeSelectedMonthButton";
import ReportDetailModal from "../components/modals/ReportDetailModal";
const REPORT_STATUS = {
  Plan: "予定",
  Action: "実働",
};
const ReportMangePage = () => {
  const [selectedDate, setselectedDate] = useState<string>(
    dayjs(new Date()).format("YYYY-MM")
  );
  const [selectedReport, setselectedReport] = useState<ReportView | null>(null);
  const navigate = useNavigate();
  const [searchParams, setsearchParams] = useSearchParams();
  const [reportList, setreportList] = useState<{
    maxDate: string;
    list: { [key: string]: ReportView };
  }>({
    maxDate: "",
    list: {},
  });
  const [_, settotal] = useState(0);

  useEffect(() => {
    if (searchParams.get(QURERY_PARAM.DATE)) {
      setselectedDate(searchParams.get(QURERY_PARAM.DATE) || "");
    }
  }, [searchParams]);

  useEffect(() => {
    getReportList(selectedDate);

    return () => {
      setreportList({
        maxDate: "",
        list: {},
      });
    };
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
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Button
          className=" mt-16 mb-10"
          onClick={() => onClickButton(date, mode)}
        >
          作成
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Flex className="w-full px-2" justify="space-between" align="center">
        <Space>
          <Typography.Title level={3}>
            {`${selectedDate.split("-")[0]}年${
              selectedDate.split("-")[1]
            }月の日報一覧`}
          </Typography.Title>
          <ChangeSelectedMonthButton
            value={dayjs(selectedDate)}
            onChange={handleDateChange}
          />
        </Space>
        <ReportCreateButton />
      </Flex>
      <Flex wrap="wrap">
        {reportList.maxDate &&
          reportList.maxDate !== "" &&
          !isNaN(parseInt(reportList.maxDate)) &&
          Array(parseInt(reportList.maxDate))
            .fill("")
            .map((_, index) => {
              const day = padZero(index + 1);
              const planPropary = `${day}-${REPORT_MODE.PLAN}`;
              const actionPropary = `${day}-${REPORT_MODE.ACTION}`;
              return (
                <div className="w-full md:w-[calc(50%-1rem)] rounded-lg p-2 min-h-[300px]">
                  <Badge.Ribbon text={`${day}日`} placement="start">
                    <Card className="shadow-lg w-full h-full" key={day}>
                      <Flex className="w-full h-full" justify="space-around">
                        <div className="w-[50%] h-full mt-2">
                          <Typography.Title level={4}>
                            {
                              REPORT_STATUS[
                                "Plan" as keyof typeof REPORT_STATUS
                              ]
                            }
                          </Typography.Title>
                          {planPropary in reportList.list ? (
                            <WorkHourPieChart
                              onClick={() => {
                                setselectedReport(reportList.list[planPropary]);
                              }}
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
                        <div className="w-[50%] h-full mt-2">
                          <Typography.Title level={4}>
                            {
                              REPORT_STATUS[
                                "Action" as keyof typeof REPORT_STATUS
                              ]
                            }
                          </Typography.Title>
                          {actionPropary in reportList.list ? (
                            <WorkHourPieChart
                              onClick={() => {
                                setselectedReport(
                                  reportList.list[actionPropary]
                                );
                              }}
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
                    </Card>
                  </Badge.Ribbon>
                </div>
              );
            })}
      </Flex>

      <ReportDetailModal
        data={selectedReport}
        modalProps={{
          open: !!selectedReport,
          onCancel: () => setselectedReport(null),
        }}
      />
    </div>
  );
};

export default ReportMangePage;
const WorkHourPieChart = ({
  data,
  onClick,
}: {
  data: ReportView;
  worktype: string;
  onClick: () => void;
}) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="-mt-2">
      <svg width="200" height="200" viewBox="-100 -100 200 200">
        {/* 背景の円 */}
        <circle
          onClick={onClick}
          cx="0"
          cy="0"
          r="80"
          fill="none"
          stroke="#eee"
          strokeWidth="16"
        />

        {/* 作業時間のアーク */}
        {data.reportitems.length > 0 &&
          data.reportitems.map((item: ReportItemView, index: number) => {
            const arc = calculateArc(
              item.ri_starttime.toString(),
              item.ri_endtime.toString(),
              parseInt(data.report_workhour),
              parseInt(data.report_workhour.split("-")[0]),
              80
            );
            return (
              <g key={index}>
                <path
                  d={arc}
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth="1"
                />
              </g>
            );
          })}

        {/* 中心の白い円 */}
        <circle
          cx="0"
          cy="0"
          r="32"
          fill="white"
          stroke="#eee"
          strokeWidth="1"
        />

        {/* 中心のテキスト（例：合計時間など） */}
        <text
          x="0"
          y="0"
          fontSize="16"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#333"
        >
          {data.report_workhour}h
        </text>
      </svg>
      <div>{"作成日：" + formatDate(data.report_created_at)}</div>
    </div>
  );
};
