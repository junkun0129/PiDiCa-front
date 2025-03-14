import { fetchRequest } from "./helper.api";

type GetCretedByMonthReq = {
  date: string;
  status: string;
};

type GetCretedByMonthRes = {
  result: string;
  data: any[];
};

export const getCreatedByMonthApi = async (
  req: GetCretedByMonthReq
): Promise<GetCretedByMonthRes> => {
  const url =
    "/report/createdbymonth" + "?date=" + req.date + "&status=" + req.status;
  const res = await fetchRequest(url, "get");
  return res;
};

type CreateReportReq = {
  body: {
    report_date: string;
    report_status: string;
    report_workhour: string;
    report_items: {
      task_cd: string;
      starttime: string;
      endtime: string;
      check: string;
      do: string;
      plan: string;
      action: string;
    }[];
  };
};

type CreateReportRes = {
  result: string;
};

export const createReportApi = async (
  req: CreateReportReq
): Promise<CreateReportRes> => {
  const url = "/report/create";
  const res = await fetchRequest(url, "post", req.body);
  return res;
};
type GetReportListApiReq = {
  date: string;
};

export type ReportItemView = {
  ri_starttime: string;
  ri_endtime: string;
  tasks: {
    task_name: string;
    ri_starttime: string;
    ri_endtime: string;
    ri_action: string;
    ri_check: string;
    ri_do: string;
    ri_plan: string;
  };
};
export type ReportView = {
  report_cd: string;
  report_created_at: string;
  report_date: string;
  report_status: string;
  report_workhour: string;
  reportitems: ReportItemView[];
};
type GetReportListApiRes = {
  result: string;
  data: { [key: string]: ReportView };
  total: number;
};
export const getReportListApi = async (
  req: GetReportListApiReq
): Promise<GetReportListApiRes> => {
  const url = `/report/list?&date=${req.date}`;
  const res = await fetchRequest(url, "get");
  return res;
};
